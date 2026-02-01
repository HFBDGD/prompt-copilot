/**
 * Prompt Copilot - Main Application
 * Manages UI interactions and coordinates data loading/prompt building
 */

class PromptCopilot {
    constructor() {
        // Initialize utilities
        this.dataLoader = new DataLoader();
        this.promptBuilder = new PromptBuilder();

        // State
        this.lang = 'zh';
        this.libraries = {};
        this.currentLibraryData = {};
        this.rolesData = {};
        this.inputWidgets = {};

        // DOM elements
        this.elements = {};

        // Initialize
        this.init();
    }

    /**
     * Initialize the application
     */
    async init() {
        this.cacheElements();
        this.attachEventListeners();
        this.setupOnlineStatusMonitoring();
        await this.loadMasterIndex();
        this.updateUIText();
    }

    /**
     * Cache DOM elements
     */
    cacheElements() {
        this.elements = {
            // Language toggle
            langButtons: document.querySelectorAll('.lang-btn'),

            // Guide and labels
            guideBanner: document.getElementById('guide-text'),
            lblConfig: document.getElementById('lbl-config'),
            lblVars: document.getElementById('lbl-vars'),
            lblResult: document.getElementById('lbl-result'),
            lblLibrary: document.getElementById('lbl-library'),
            lblRole: document.getElementById('lbl-role'),
            lblTask: document.getElementById('lbl-task'),
            lblOutputMode: document.getElementById('lbl-output-mode'),

            // Dropdowns
            librarySelect: document.getElementById('library-select'),
            roleSelect: document.getElementById('role-select'),
            taskSelect: document.getElementById('task-select'),
            outputModeSelect: document.getElementById('output-mode-select'),

            // Variables and result
            variablesContainer: document.getElementById('variables-container'),
            resultArea: document.getElementById('result-area'),

            // Buttons
            copyBtn: document.getElementById('copy-btn'),
            copyBtnText: document.getElementById('copy-btn-text'),

            // Status
            statusBadge: document.getElementById('status-badge')
        };
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Language toggle
        this.elements.langButtons.forEach(btn => {
            btn.addEventListener('click', () => this.onLanguageChange(btn.dataset.lang));
        });

        // Dropdowns
        this.elements.librarySelect.addEventListener('change', () => this.onLibraryChange());
        this.elements.roleSelect.addEventListener('change', () => this.onRoleChange());
        this.elements.taskSelect.addEventListener('change', () => this.onTaskChange());
        this.elements.outputModeSelect.addEventListener('change', () => this.updateResult());

        // Copy button
        this.elements.copyBtn.addEventListener('click', () => this.copyToClipboard());
    }

    /**
     * Setup online/offline status monitoring
     */
    setupOnlineStatusMonitoring() {
        const updateStatus = () => {
            const text = this.promptBuilder.getUIText(this.lang);
            this.elements.statusBadge.textContent = navigator.onLine ?
                text.status_online : text.status_offline;
        };

        window.addEventListener('online', updateStatus);
        window.addEventListener('offline', updateStatus);
        updateStatus();
    }

    /**
     * Load master library index
     */
    async loadMasterIndex() {
        try {
            this.libraries = await this.dataLoader.loadMasterIndex(this.lang);
            this.populateLibraryDropdown();

            // Auto-select first library
            if (Object.keys(this.libraries).length > 0) {
                const firstLibrary = Object.keys(this.libraries)[0];
                this.elements.librarySelect.value = firstLibrary;
                await this.onLibraryChange();
            }
        } catch (error) {
            console.error('Failed to load master index:', error);
            this.elements.librarySelect.innerHTML = '<option>Error loading libraries</option>';
        }
    }

    /**
     * Populate library dropdown
     */
    populateLibraryDropdown() {
        this.elements.librarySelect.innerHTML = '';
        Object.keys(this.libraries).forEach(name => {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            this.elements.librarySelect.appendChild(option);
        });
    }

    /**
     * Handle language change
     */
    async onLanguageChange(newLang) {
        if (this.lang === newLang) return;

        this.lang = newLang;

        // Update active button
        this.elements.langButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === newLang);
        });

        // Update UI text
        this.updateUIText();

        // Reload libraries for new language
        await this.loadMasterIndex();
    }

    /**
     * Update UI text based on current language
     */
    updateUIText() {
        const text = this.promptBuilder.getUIText(this.lang);

        this.elements.guideBanner.innerHTML = text.guide;
        this.elements.lblConfig.textContent = text.lbl_config;
        this.elements.lblVars.textContent = text.lbl_vars;
        this.elements.lblResult.textContent = text.lbl_result;
        this.elements.lblLibrary.textContent = text.lbl_lib;
        this.elements.lblRole.textContent = text.lbl_role;
        this.elements.lblTask.textContent = text.lbl_task;
        this.elements.lblOutputMode.textContent = text.lbl_output_mode;
        this.elements.copyBtnText.textContent = text.btn_copy;

        // Update output modes
        this.populateOutputModes();
    }

    /**
     * Populate output mode dropdown
     */
    populateOutputModes() {
        const modes = this.promptBuilder.getOutputModes(this.lang);
        this.elements.outputModeSelect.innerHTML = '';

        modes.forEach(mode => {
            const option = document.createElement('option');
            option.value = mode.prefix;
            option.textContent = mode.label;
            this.elements.outputModeSelect.appendChild(option);
        });
    }

    /**
     * Handle library selection change
     */
    async onLibraryChange() {
        const selectedLibrary = this.elements.librarySelect.value;
        if (!selectedLibrary || !this.libraries[selectedLibrary]) return;

        try {
            const url = this.libraries[selectedLibrary];
            this.currentLibraryData = await this.dataLoader.loadLibrary(url);

            // Normalize data structure
            this.rolesData = this.promptBuilder.normalizeLibraryData(this.currentLibraryData);

            this.populateRoleDropdown();
        } catch (error) {
            console.error('Failed to load library:', error);
            this.elements.roleSelect.innerHTML = '<option>Error loading library</option>';
        }
    }

    /**
     * Populate role/category dropdown
     */
    populateRoleDropdown() {
        this.elements.roleSelect.innerHTML = '';
        const roles = Object.keys(this.rolesData);

        roles.forEach(role => {
            const option = document.createElement('option');
            option.value = role;
            option.textContent = role;
            this.elements.roleSelect.appendChild(option);
        });

        // Auto-select first role
        if (roles.length > 0) {
            this.elements.roleSelect.value = roles[0];
            this.onRoleChange();
        }
    }

    /**
     * Handle role/category selection change
     */
    onRoleChange() {
        const selectedRole = this.elements.roleSelect.value;
        if (!selectedRole || !this.rolesData[selectedRole]) return;

        this.populateTaskDropdown(selectedRole);
    }

    /**
     * Populate task dropdown
     */
    populateTaskDropdown(role) {
        this.elements.taskSelect.innerHTML = '';
        const tasks = Object.keys(this.rolesData[role]);

        tasks.forEach(task => {
            const option = document.createElement('option');
            option.value = task;
            option.textContent = task;
            this.elements.taskSelect.appendChild(option);
        });

        // Auto-select first task
        if (tasks.length > 0) {
            this.elements.taskSelect.value = tasks[0];
            this.onTaskChange();
        }
    }

    /**
     * Handle task selection change
     */
    onTaskChange() {
        const role = this.elements.roleSelect.value;
        const task = this.elements.taskSelect.value;

        if (!role || !task || !this.rolesData[role] || !this.rolesData[role][task]) return;

        const taskData = this.rolesData[role][task];
        this.renderInputs(taskData);
        this.updateResult();
    }

    /**
     * Render input fields based on task variables
     */
    renderInputs(taskData) {
        this.elements.variablesContainer.innerHTML = '';
        this.inputWidgets = {};

        // Show description if available
        if (taskData.description) {
            const desc = document.createElement('div');
            desc.className = 'variable-description';
            desc.innerHTML = `ℹ️ ${taskData.description}`;
            this.elements.variablesContainer.appendChild(desc);
        }

        // Create input fields for each variable
        Object.entries(taskData.vars).forEach(([key, value]) => {
            const formGroup = document.createElement('div');
            formGroup.className = 'form-group';

            // Handle multi-select
            if (key.endsWith('__multi') && Array.isArray(value)) {
                const cleanKey = key.replace('__multi', '');
                const label = document.createElement('div');
                label.className = 'section-label';
                label.textContent = cleanKey;
                formGroup.appendChild(label);

                const select = document.createElement('select');
                select.className = 'form-control';
                select.multiple = true;
                select.size = Math.min(value.length, 8);

                value.forEach(option => {
                    const opt = document.createElement('option');
                    opt.value = option;
                    opt.textContent = option;
                    opt.selected = true; // Select all by default
                    select.appendChild(opt);
                });

                select.addEventListener('change', () => this.updateResult());
                formGroup.appendChild(select);
                this.inputWidgets[key] = select;
            }
            // Handle dropdown
            else if (Array.isArray(value)) {
                const label = document.createElement('label');
                label.textContent = key;
                formGroup.appendChild(label);

                const select = document.createElement('select');
                select.className = 'form-control';

                value.forEach(option => {
                    const opt = document.createElement('option');
                    opt.value = option;
                    opt.textContent = option;
                    select.appendChild(opt);
                });

                select.addEventListener('change', () => this.updateResult());
                formGroup.appendChild(select);
                this.inputWidgets[key] = select;
            }
            // Handle text input
            else {
                const label = document.createElement('label');
                label.textContent = key;
                formGroup.appendChild(label);

                const input = document.createElement('input');
                input.type = 'text';
                input.className = 'form-control';
                input.value = value;
                input.placeholder = value;

                input.addEventListener('input', () => this.updateResult());
                formGroup.appendChild(input);
                this.inputWidgets[key] = input;
            }

            this.elements.variablesContainer.appendChild(formGroup);
        });
    }

    /**
     * Update result preview
     */
    updateResult() {
        const role = this.elements.roleSelect.value;
        const task = this.elements.taskSelect.value;

        if (!role || !task || !this.rolesData[role] || !this.rolesData[role][task]) return;

        const taskData = this.rolesData[role][task];
        const template = taskData.template;

        // Collect variable values
        const variables = {};
        Object.entries(this.inputWidgets).forEach(([key, widget]) => {
            if (widget.multiple) {
                // Multi-select: get selected options
                variables[key] = Array.from(widget.selectedOptions).map(opt => opt.value);
            } else {
                variables[key] = widget.value;
            }
        });

        // Build prompt
        const rawPrompt = this.promptBuilder.buildPrompt(template, variables);

        // Add output mode prefix
        const prefix = this.elements.outputModeSelect.value;
        this.elements.resultArea.value = prefix + rawPrompt;
    }

    /**
     * Copy result to clipboard
     */
    async copyToClipboard() {
        try {
            await navigator.clipboard.writeText(this.elements.resultArea.value);

            // Show success feedback
            const text = this.promptBuilder.getUIText(this.lang);
            const originalText = this.elements.copyBtnText.textContent;
            this.elements.copyBtnText.textContent = text.btn_copied;
            this.elements.copyBtn.classList.add('copied');

            setTimeout(() => {
                this.elements.copyBtnText.textContent = originalText;
                this.elements.copyBtn.classList.remove('copied');
            }, 2000);
        } catch (error) {
            console.error('Failed to copy:', error);
            alert('Failed to copy to clipboard');
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new PromptCopilot();
});
