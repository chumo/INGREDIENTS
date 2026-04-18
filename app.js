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

        let apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
        let aiModel = 'openrouter/free';
        let isGeminiFormat = false;

        // Auto-detect key type
        if (apiKey.startsWith('AIza')) {
            apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
            isGeminiFormat = true;
        } else if (!apiKey.startsWith('sk-or-v1-')) {
            apiUrl = 'https://api.openai.com/v1/chat/completions';
            aiModel = 'gpt-4o-mini'; // Extremely fast and supports vision + json formatting natively
        }

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                let payload;
                let headers = {
                    'Content-Type': 'application/json'
                };

                if (isGeminiFormat) {
                    const base64Data = imageBase64.split(',')[1];
                    const mimeType = imageBase64.split(';')[0].split(':')[1];

                    payload = {
                        contents: [
                            {
                                parts: [
                                    { text: prompt },
                                    {
                                        inline_data: {
                                            mime_type: mimeType || 'image/jpeg',
                                            data: base64Data
                                        }
                                    }
                                ]
                            }
                        ],
                        generationConfig: {
                            responseMimeType: "application/json"
                        }
                    };
                } else {
                    headers['Authorization'] = `Bearer ${apiKey}`;
                    headers['HTTP-Referer'] = window.location.href; // Ignored by OpenAI, required by OpenRouter
                    headers['X-Title'] = 'Ingredient Extractor';

                    payload = {
                        model: aiModel,
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
                    };

                    // OpenAI guarantees proper JSON output with this flag
                    if (apiUrl === 'https://api.openai.com/v1/chat/completions') {
                        payload.response_format = { type: "json_object" };
                    }
                }

                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(payload)
                });

                const data = await response.json();

                if (!response.ok) {
                    const errorMessage = isGeminiFormat ? data.error?.message : data.error?.message;
                    throw new Error(errorMessage || 'API Request Failed');
                }

                if (isGeminiFormat) {
                    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) throw new Error("Invalid response structure from Gemini API");
                    return data.candidates[0].content.parts[0].text;
                } else {
                    return data.choices?.[0]?.message?.content || '{}';
                }
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

    function drawMappingLines(connections) {
        const container = document.getElementById('comparison-container');
        const svg = document.getElementById('comparison-svg');
        if (!container || !svg) return;

        svg.innerHTML = `
            <defs>
                <marker id="arrow-matched" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(16, 185, 129, 0.6)" />
                </marker>
                <marker id="arrow-misordered" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(59, 130, 246, 0.6)" />
                </marker>
            </defs>
        `;

        const containerRect = container.getBoundingClientRect();

        connections.forEach(conn => {
            const fromEl = document.getElementById(conn.from);
            const toEl = document.getElementById(conn.to);
            if (!fromEl || !toEl) return;

            const fromRect = fromEl.getBoundingClientRect();
            const toRect = toEl.getBoundingClientRect();

            // Calculate anchor points
            const startX = fromRect.right - containerRect.left;
            const startY = fromRect.top + (fromRect.height / 2) - containerRect.top;

            const endX = toRect.left - containerRect.left;
            const endY = toRect.top + (toRect.height / 2) - containerRect.top;

            const controlOffset = (endX - startX) / 2;
            const d = `M ${startX} ${startY} C ${startX + controlOffset} ${startY}, ${endX - controlOffset} ${endY}, ${endX} ${endY}`;

            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', d);

            const isMisordered = conn.status === 'misordered';
            path.setAttribute('stroke', isMisordered ? 'rgba(59, 130, 246, 0.6)' : 'rgba(16, 185, 129, 0.6)');
            path.setAttribute('stroke-width', '2');
            path.setAttribute('fill', 'none');
            path.setAttribute('marker-end', isMisordered ? 'url(#arrow-misordered)' : 'url(#arrow-matched)');

            svg.appendChild(path);
        });
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
            const templatePrompt = `Extract the list of ingredients and their percentages from the template document. Exclude any ingredients that appear in any section with the words 'No etiquetables', such as 'Alergenos No etiquetables'. Return the result strictly as a valid JSON object with this format exactly: {"ingredients": [{"name": "string", "percentage": number}]}. Do not include any extra text.`;
            const labelPrompt = `Extract the list of ingredients from the product label in the exact order they appear. Return strictly as a valid JSON object with this format exactly: {"ingredients": ["string", "string"]}. Do not include any extra text.`;

            let templateResponseText = await fetchAiExtraction(apiKey, templateBase64, templatePrompt);
            let labelResponseText = await fetchAiExtraction(apiKey, labelBase64, labelPrompt);

            // Clean asterisks globally from the raw text
            templateResponseText = templateResponseText.replace(/\*/g, '');
            labelResponseText = labelResponseText.replace(/\*/g, '');

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

            // Build the Mapping View
            const templateNodes = templateItems.map((item, index) => {
                const normName = normalizeIngredient(item.name);
                let status = 'matched';
                if (!normLabelItems.includes(normName)) {
                    status = 'missing';
                }
                const pctNum = item.percentage != null ? parseFloat(item.percentage) : null;
                return { id: `tpl-${index}`, name: item.name, normName, status, percentage: item.percentage, pctNum };
            });

            const labelNodes = labelItems.map((name, index) => {
                const normName = normalizeIngredient(name);
                let status = 'matched';
                if (!normTemplateMap.has(normName)) {
                    status = 'unnecessary';
                } else if (misordered.includes(name)) {
                    status = 'misordered';
                }
                return { id: `lbl-${index}`, name, normName, status };
            });

            const connections = [];
            templateNodes.forEach(t => {
                if (t.status !== 'missing') {
                    labelNodes.forEach(l => {
                        if (l.normName === t.normName) {
                            connections.push({ from: t.id, to: l.id, status: l.status });
                        }
                    });
                }
            });

            let templateColHtml = '';
            let separatorAdded = false;
            templateNodes.forEach(t => {
                if (!separatorAdded && t.pctNum !== null && t.pctNum < 1) {
                    templateColHtml += `<div class="less-than-one-separator"><span>&lt; 1%</span></div>`;
                    separatorAdded = true;
                }
                const pctText = t.percentage != null ? t.percentage + (String(t.percentage).includes('%') ? '' : '%') : '';
                templateColHtml += `
                <div class="template-item-wrapper">
                    <div class="percentage-badge">${pctText}</div>
                    <div class="ing-item ${t.status}" id="${t.id}">${t.name}</div>
                </div>
                `;
            });

            let mappingHtml = `
            <div class="comparison-wrapper">
                <div class="comparison-container" id="comparison-container">
                    <svg class="comparison-svg" id="comparison-svg"></svg>
                    <div class="comparison-column" id="template-col">
                        <h4>Template</h4>
                        ${templateColHtml}
                    </div>
                    <div class="comparison-column" id="label-col">
                        <h4>Label</h4>
                        ${labelNodes.map(l => `<div class="ing-item ${l.status}" id="${l.id}">${l.name}</div>`).join('')}
                    </div>
                </div>
            </div>
            `;

            resultContent.innerHTML = mappingHtml;

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

            // Draw lines after DOM is updated
            setTimeout(() => {
                drawMappingLines(connections);
                if (window._mappingResizeObserver) {
                    window._mappingResizeObserver.disconnect();
                }
                const container = document.getElementById('comparison-container');
                if (container) {
                    window._mappingResizeObserver = new ResizeObserver(() => drawMappingLines(connections));
                    window._mappingResizeObserver.observe(container);
                }
            }, 100);

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
