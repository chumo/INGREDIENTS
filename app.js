document.addEventListener('DOMContentLoaded', () => {
    const apiKeyInput = document.getElementById('api-key');
    
    // Template elements
    const templateDropZone = document.getElementById('template-drop-zone');
    const templateFileInput = document.getElementById('template-file-input');
    const templateUploadContent = document.getElementById('template-upload-content');
    const templatePreviewContainer = document.getElementById('template-preview-container');
    const templateImagePreview = document.getElementById('template-image-preview');
    const templateFileInfo = document.getElementById('template-file-info');
    const clearTemplateBtn = document.getElementById('clear-template-file');
    
    // Label elements
    const labelDropZone = document.getElementById('label-drop-zone');
    const labelFileInput = document.getElementById('label-file-input');
    const labelUploadContent = document.getElementById('label-upload-content');
    const labelPreviewContainer = document.getElementById('label-preview-container');
    const labelImagePreview = document.getElementById('label-image-preview');
    const labelFileInfo = document.getElementById('label-file-info');
    const clearLabelBtn = document.getElementById('clear-label-file');

    const extractBtn = document.getElementById('extract-btn');
    const loadingContainer = document.getElementById('loading-container');
    const loadingText = loadingContainer.querySelector('.loading-text');
    
    const resultSection = document.getElementById('result-section');
    const validationStatus = document.getElementById('validation-status');
    const validationResults = document.getElementById('validation-results');
    const resultContent = document.getElementById('result-content');

    let templateBase64 = null;
    let labelBase64 = null;

    // Load saved API key if exists
    const savedKey = localStorage.getItem('openRouterApiKey');
    if (savedKey) {
        apiKeyInput.value = savedKey;
    }

    // Save API key on change
    apiKeyInput.addEventListener('input', (e) => {
        localStorage.setItem('openRouterApiKey', e.target.value);
        validateState();
    });

    // Helper functions for drag and drop setup
    function setupDropZone(dropZone, fileInput, handler) {
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('drag-active');
        });
        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('drag-active');
        });
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('drag-active');
            if (e.dataTransfer.files.length > 0) handler(e.dataTransfer.files[0]);
        });
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) handler(e.target.files[0]);
        });
    }

    setupDropZone(templateDropZone, templateFileInput, async (file) => {
        try {
            setProcessingUI(true, "Processing template...");
            templateFileInfo.textContent = `${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`;
            if (file.type === 'application/pdf') {
                templateBase64 = await renderPdfToImage(file);
            } else if (file.type.startsWith('image/')) {
                templateBase64 = await readImageToBase64(file);
            } else throw new Error("Unsupported template file type.");
            templateImagePreview.src = templateBase64;
            templateUploadContent.classList.add('hidden');
            templatePreviewContainer.classList.remove('hidden');
            validateState();
        } catch (e) {
            alert(e.message);
            clearTemplateBtn.click();
        } finally {
            setProcessingUI(false);
        }
    });

    setupDropZone(labelDropZone, labelFileInput, async (file) => {
        try {
            setProcessingUI(true, "Processing label...");
            labelFileInfo.textContent = `${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`;
            if (file.type === 'application/pdf') {
                labelBase64 = await renderPdfToImage(file);
            } else if (file.type.startsWith('image/')) {
                labelBase64 = await readImageToBase64(file);
            } else throw new Error("Unsupported label file type.");
            labelImagePreview.src = labelBase64;
            labelUploadContent.classList.add('hidden');
            labelPreviewContainer.classList.remove('hidden');
            validateState();
        } catch (e) {
            alert(e.message);
            clearLabelBtn.click();
        } finally {
            setProcessingUI(false);
        }
    });

    clearTemplateBtn.addEventListener('click', () => {
        templateBase64 = null;
        templateFileInput.value = '';
        templateUploadContent.classList.remove('hidden');
        templatePreviewContainer.classList.add('hidden');
        resultSection.classList.add('hidden');
        validateState();
    });

    clearLabelBtn.addEventListener('click', () => {
        labelBase64 = null;
        labelFileInput.value = '';
        labelUploadContent.classList.remove('hidden');
        labelPreviewContainer.classList.add('hidden');
        resultSection.classList.add('hidden');
        validateState();
    });

    function readImageToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    async function renderPdfToImage(file) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 2.0 });
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvasContext: ctx, viewport: viewport }).promise;
        return canvas.toDataURL('image/jpeg', 0.8);
    }

    function validateState() {
        const hasKey = apiKeyInput.value.trim().length > 0;
        extractBtn.disabled = !(hasKey && templateBase64 && labelBase64);
    }

    function setProcessingUI(isLoading, text = "") {
        if (isLoading) {
            extractBtn.classList.add('hidden');
            loadingContainer.classList.remove('hidden');
            if (text) {
                loadingText.textContent = text;
            }
        } else {
            extractBtn.classList.remove('hidden');
            loadingContainer.classList.add('hidden');
            validateState();
        }
    }

    function extractJsonSafely(text) {
        let jsonString = text.trim();
        // Attempt to parse standard or markdown enclosed JSON
        const match = jsonString.match(/```(?:json)?\s*([\s\S]*?)(\s*```|$)/);
        if (match) {
            jsonString = match[1].trim();
        }
        
        try {
            return JSON.parse(jsonString);
        } catch (e) {
            // Attempt to fix common truncation issues like missing closing braces
            try {
                if (!jsonString.endsWith('}')) {
                    if (jsonString.endsWith(']')) {
                        return JSON.parse(jsonString + '}');
                    } else if (jsonString.endsWith('"')) {
                        // In case it truncated just before closing the array
                        return JSON.parse(jsonString + ']}');
                    }
                }
            } catch (retryError) {
                // If the fix didn't work, let it throw the original error down below
            }
            throw e;
        }
    }

    function normalizeIngredient(str) {
        // match exactly except for case and asterisks
        return str.toLowerCase().replace(/\*/g, '').trim();
    }

    async function fetchAiExtraction(apiKey, imageBase64, prompt, maxRetries = 3) {
        let lastError = null;
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json',
                        'HTTP-Referer': window.location.href,
                        'X-Title': 'Ingredient Extractor'
                    },
                    body: JSON.stringify({
                        model: "openrouter/free", 
                        max_tokens: 4096,
                        messages: [
                            {
                                role: "user",
                                content: [
                                    { type: "text", text: prompt },
                                    { type: "image_url", image_url: { url: imageBase64 } }
                                ]
                            }
                        ]
                    })
                });

                const data = await response.json();
                if (!response.ok) throw new Error(data.error?.message || 'API Request Failed');
                return data.choices?.[0]?.message?.content || '{}';
            } catch (error) {
                lastError = error;
                console.warn(`Attempt ${attempt} failed:`, error.message);
                if (attempt < maxRetries) {
                    // Wait before retrying (backoff)
                    await new Promise(r => setTimeout(r, 2000 * attempt));
                }
            }
        }
        throw lastError;
    }

    extractBtn.addEventListener('click', async () => {
        const apiKey = apiKeyInput.value.trim();
        if (!apiKey || !templateBase64 || !labelBase64) return;

        setProcessingUI(true, "AI is processing documents...");
        resultSection.classList.add('hidden');
        validationStatus.innerHTML = '';
        validationResults.innerHTML = '';
        resultContent.textContent = '';

        try {
            const templatePrompt = `Extract the list of ingredients and their percentages from the template document. Exclude any ingredients that appear in any section with the words 'No etiquetables'. Return the result strictly as a valid JSON object with this format exactly: {"ingredients": [{"name": "string", "percentage": number}]}. Do not include any extra text.`;
            const labelPrompt = `Extract the list of ingredients from the product label in the exact order they appear. Return strictly as a valid JSON object with this format exactly: {"ingredients": ["string", "string"]}. Do not include any extra text.`;

            let templateResponseText = await fetchAiExtraction(apiKey, templateBase64, templatePrompt);
            let labelResponseText = await fetchAiExtraction(apiKey, labelBase64, labelPrompt);

            // Strip asterisks globally from the raw text so they don't show up in the Raw Data view
            templateResponseText = templateResponseText.replace(/\*/g, '');
            labelResponseText = labelResponseText.replace(/\*/g, '');

            resultContent.textContent = `TEMPLATE JSON:\n${templateResponseText}\n\nLABEL JSON:\n${labelResponseText}`;

            let templateJson, labelJson;
            try {
                templateJson = extractJsonSafely(templateResponseText);
            } catch (e) {
                throw new Error("Failed to parse correct JSON format for the Template document. The AI model output was invalid.");
            }

            try {
                labelJson = extractJsonSafely(labelResponseText);
            } catch (e) {
                throw new Error("Failed to parse correct JSON format for the Label document. The AI model output was invalid.");
            }

            if (!templateJson.ingredients || !Array.isArray(templateJson.ingredients)) throw new Error("Template JSON structure is missing the 'ingredients' array. The AI model failed to follow instructions.");
            if (!labelJson.ingredients || !Array.isArray(labelJson.ingredients)) throw new Error("Label JSON structure is missing the 'ingredients' array. The AI model failed to follow instructions.");

            const templateItems = templateJson.ingredients.map(i => ({
                ...i,
                name: i.name.replace(/\*/g, '').trim()
            }));

            const labelItems = labelJson.ingredients.map(name => name.replace(/\*/g, '').trim());

            const normTemplateMap = new Map();
            templateItems.forEach(i => normTemplateMap.set(normalizeIngredient(i.name), i));

            const normLabelItems = labelItems.map(name => normalizeIngredient(name));
            const labelOriginalNames = new Map();
            labelItems.forEach(name => labelOriginalNames.set(normalizeIngredient(name), name));

            const missing = [];
            for (const item of templateItems) {
                if (!normLabelItems.includes(normalizeIngredient(item.name))) {
                    missing.push(item.name);
                }
            }

            const unnecessary = [];
            for (const originalName of labelItems) {
                if (!normTemplateMap.has(normalizeIngredient(originalName))) {
                    unnecessary.push(originalName);
                }
            }

            // Calculation for misordered
            const strictTemplateItems = templateItems.filter(i => {
                // If percentage is undefined or null, we might want to default to treating it strict or lenient? 
                // Let's assume percentage is required. Wait, "less than 1% concentration" means strictly < 1. 
                // Anything >= 1 or missing percentage might be considered strict (we can assume >= 1 if not parsed).
                const pct = i.percentage != null ? parseFloat(i.percentage) : 100;
                return pct >= 1;
            });
            const strictTemplateNormNames = strictTemplateItems.map(i => normalizeIngredient(i.name));

            const strictLabelNormNames = normLabelItems.filter(name => strictTemplateNormNames.includes(name));

            let expectedIndex = 0;
            const misordered = [];
            for (const name of strictLabelNormNames) {
                const foundIndex = strictTemplateNormNames.indexOf(name);
                if (foundIndex < expectedIndex) {
                    misordered.push(labelOriginalNames.get(name));
                } else {
                    expectedIndex = foundIndex;
                }
            }

            // Render Validation Result
            let isSuccess = missing.length === 0 && unnecessary.length === 0 && misordered.length === 0;

            validationStatus.className = 'validation-status ' + (isSuccess ? 'success' : 'error');
            validationStatus.textContent = isSuccess ? '✅ Validation Passed!' : '❌ Validation Failed';

            if (!isSuccess) {
                let html = '';
                if (missing.length > 0) {
                    html += `
                        <div class="validation-category missing">
                            <h4>⚠️ Missing Ingredients (${missing.length})</h4>
                            <ul>${missing.map(m => `<li>${m}</li>`).join('')}</ul>
                        </div>
                    `;
                }
                if (unnecessary.length > 0) {
                    html += `
                        <div class="validation-category unnecessary">
                            <h4>⚠️ Unnecessary Ingredients (${unnecessary.length})</h4>
                            <ul>${unnecessary.map(m => `<li>${m}</li>`).join('')}</ul>
                        </div>
                    `;
                }
                if (misordered.length > 0) {
                    html += `
                        <div class="validation-category misordered">
                            <h4>⚠️ Misordered Ingredients (${misordered.length})</h4>
                            <ul>${misordered.map(m => `<li>${m}</li>`).join('')}</ul>
                        </div>
                    `;
                }
                validationResults.innerHTML = html;
            } else {
                validationResults.innerHTML = '<p style="color: var(--text-muted); padding: 1rem; text-align: center;">All ingredients match the template properly.</p>';
            }

            resultSection.classList.remove('hidden');
            resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

        } catch (error) {
            validationStatus.className = 'validation-status error';
            validationStatus.textContent = `❌ System Error: ${error.message}`;
            validationResults.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 1rem;">Please verify the AI returned proper data and try again.</p>';
            resultSection.classList.remove('hidden');
            console.error(error);
        } finally {
            setProcessingUI(false);
        }
    });
});
