/**
 * PromptBuilder - Handles prompt template processing
 * Builds final prompts from templates and user inputs
 */

class PromptBuilder {
    constructor() {
        // UI text translations
        this.UI_TEXT = {
            zh: {
                guide: '👈 <b>左側自由探索</b>模組與參數，設定完成後別忘了點擊右側 <b>[複製 Prompt]</b> 帶走你的咒語！',
                lbl_lib: '📚 模組庫:',
                lbl_role: '📂 類別:',
                lbl_task: '⚡ 任務:',
                lbl_config: 'CONFIG (設定)',
                lbl_vars: 'VARIABLES (參數)',
                lbl_result: 'RESULT (結果)',
                lbl_output_mode: '🎛️ 輸出模式:',
                btn_copy: '複製 Prompt (Copy)',
                btn_copied: '已複製! ✅',
                status_online: '🟢 連線正常',
                status_offline: '🟡 離線模式',
                select_library: 'Select library first...',
                select_category: 'Select category first...',
                placeholder: 'Select a task to see available options...'
            },
            en: {
                guide: '👈 <b>Explore</b> the settings on the left, and don\'t forget to click <b>[Copy Prompt]</b> on the right!',
                lbl_lib: '📚 Library:',
                lbl_role: '📂 Category:',
                lbl_task: '⚡ Task:',
                lbl_config: 'CONFIG',
                lbl_vars: 'VARIABLES',
                lbl_result: 'RESULT',
                lbl_output_mode: '🎛️ Output Mode:',
                btn_copy: 'Copy Prompt',
                btn_copied: 'Copied! ✅',
                status_online: '🟢 Online',
                status_offline: '🟡 Offline',
                select_library: 'Select library first...',
                select_category: 'Select category first...',
                placeholder: 'Select a task to see available options...'
            }
        };

        // Output modes
        this.OUTPUT_MODES = {
            zh: [
                { label: '🚀 智能預設 (Auto)', prefix: '' },
                { label: '🤫 靜默接收模式 (Silent Ack)', prefix: '【系統提示】：請接收以下輸入內容，但【先不要執行】任何任務。你只需要簡單回覆一句『🆗 收到，我已理解您的指令，請輸入 OK 讓我開始執行。』，然後等待使用者的下一個信號。除此之外不要輸出任何其他內容。\n\n----------------\n\n' },
                { label: '🎨 繪圖咒語大師 (Midjourney)', prefix: '【系統提示】：請扮演專業的 AI 繪圖詠唱師 (Prompt Engineer)。請根據用戶下方的描述，撰寫給 Midjourney v6 使用的「英文提示詞」。包含：主體、藝術風格、光影、鏡頭角度及長寬比 (--ar)。不需要解釋，直接輸出提示詞即可。\n\n----------------\n\n' },
                { label: '🎬 影片運鏡導演 (Sora/Runway)', prefix: '【系統提示】：請扮演專業的 AI 影片導演。請根據用戶需求，撰寫詳細的影片生成提示詞。重點描述：運鏡方式 (Pan, Zoom, Dolly)、光影氛圍、物理動態以及場景連貫性。格式請針對 Runway Gen-2 或 Sora 優化。\n\n----------------\n\n' },
                { label: '🐍 純代碼模式 (Code Only)', prefix: '【系統提示】：你現在是一台無情的寫程式機器。針對用戶的問題，【只輸出程式碼區塊】(Python/JS/HTML 等)。不要有任何開場白、結尾、解釋或註解。給我 code 就好。\n\n----------------\n\n' },
                { label: '🐞 除錯醫生 (Bug Fixer)', prefix: '【系統提示】：請分析以下程式碼的錯誤 (Bug)。先用簡短的一句話解釋錯誤原因，然後提供【修正後的完整程式碼區塊】。請注重程式的安全性和執行效率。\n\n----------------\n\n' },
                { label: '👶 費曼學習法 (ELI5)', prefix: '【系統提示】：請把以下的內容解釋給我聽，假設我是一個只有 5 歲的小朋友。使用簡單的生活譬喻，避免專業術語，語氣要生動有趣。\n\n----------------\n\n' },
                { label: '🧠 深度思考鏈 (CoT)', prefix: '【系統提示】：請不要直接給我答案。請使用「思維鏈 (Chain of Thought)」模式，一步一步地思考。將問題拆解，分析利弊，展示你的推論過程，最後再給出結論。\n\n----------------\n\n' }
            ],
            en: [
                { label: '🚀 Auto / Default', prefix: '' },
                { label: '🤫 Silent Receiver (Ack Only)', prefix: 'SYSTEM OVERRIDE: Receive the following input BUT DO NOT EXECUTE IT YET. Simply reply with \'🆗 Received. Waiting for your command.\' and wait for the user\'s next signal. Do not output anything else.\n\n----------------\n\n' },
                { label: '🎨 Image Gen Master (Midjourney)', prefix: 'SYSTEM OVERRIDE: Act as a professional prompt engineer for AI image generators (Midjourney v6). Write a detailed, comma-separated prompt including Subject, Art Style, Lighting, Camera Angle, and Aspect Ratio (--ar).\n\n----------------\n\n' },
                { label: '🎬 Video Director (Sora/Runway)', prefix: 'SYSTEM OVERRIDE: Act as a professional AI video director. Write a detailed video generation prompt focusing on Camera Movement, Lighting, Physics, and Continuity.\n\n----------------\n\n' },
                { label: '🐍 Code Generator (No Yapping)', prefix: 'SYSTEM OVERRIDE: You are a coding machine. Output ONLY the code block to solve the problem. Do not provide explanations or comments. Just the code.\n\n----------------\n\n' },
                { label: '🐞 Bug Fixer (Debug)', prefix: 'SYSTEM OVERRIDE: Analyze the input code for bugs. Explain the error briefly, then provide the corrected code block.\n\n----------------\n\n' },
                { label: '👶 ELI5 (Simple Logic)', prefix: 'SYSTEM OVERRIDE: Explain the concept as if I am a 12-year-old beginner. Use simple analogies and avoid jargon.\n\n----------------\n\n' },
                { label: '🧠 Chain of Thought (CoT)', prefix: 'SYSTEM OVERRIDE: Think step-by-step. Break down the problem, analyze pros and cons, and show your reasoning process.\n\n----------------\n\n' }
            ]
        };
    }

    /**
     * Get UI text for current language
     * @param {string} lang - Language code
     * @returns {Object} UI text object
     */
    getUIText(lang) {
        return this.UI_TEXT[lang] || this.UI_TEXT.zh;
    }

    /**
     * Get output modes for current language
     * @param {string} lang - Language code
     * @returns {Array} Output modes array
     */
    getOutputModes(lang) {
        return this.OUTPUT_MODES[lang] || this.OUTPUT_MODES.zh;
    }

    /**
     * Build prompt from template and variables
     * @param {string} template - Template string with {placeholders}
     * @param {Object} variables - Key-value pairs for replacement
     * @returns {string} Built prompt
     */
    buildPrompt(template, variables) {
        let prompt = template;

        // Replace all placeholders
        Object.keys(variables).forEach(key => {
            const value = variables[key];
            const placeholder = `{${key}}`;

            // Handle arrays (multi-select values)
            const replacement = Array.isArray(value) ? value.join('、') : value;

            // Replace all occurrences
            prompt = prompt.split(placeholder).join(replacement);
        });

        return prompt;
    }

    /**
     * Normalize library data structure
     * Handles both old format (with 'roles' wrapper) and new format (direct)
     * @param {Object} data - Library data
     * @returns {Object} Normalized data
     */
    normalizeLibraryData(data) {
        // Old format: { "roles": { "Category": {...} } }
        // New format: { "Category": {...} }
        if (data.roles) {
            return data.roles;
        }
        return data;
    }
}

// Export for use in other scripts
window.PromptBuilder = PromptBuilder;
