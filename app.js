document.addEventListener('DOMContentLoaded', () => {
    const apiKeyInput = document.getElementById('api-key');

    // Template elements
    const templateDropZone = document.getElementById('template-drop-zone');
    const templateFileInput = document.getElementById('template-file-input');
    const templateUploadContent = document.getElementById('template-upload-content');
    const templatePreviewContainer = document.getElementById('template-preview-container');
    const templatePdfName = document.getElementById('template-pdf-name');
    const templatePdfMeta = document.getElementById('template-pdf-meta');
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

    let templatePdfText = null;  // raw text extracted from the template PDF
    let labelBase64 = null;

    const labelTextarea = document.getElementById('label-ingredients-edit');
    const labelBackdrop = document.getElementById('label-ingredients-backdrop');

    const ingredientColors = [
        'rgba(255, 179, 186, 0.4)',
        'rgba(255, 223, 186, 0.4)',
        'rgba(255, 255, 186, 0.3)',
        'rgba(186, 255, 201, 0.4)',
        'rgba(186, 225, 255, 0.4)',
        'rgba(212, 240, 240, 0.4)',
        'rgba(226, 240, 203, 0.4)',
        'rgba(203, 170, 203, 0.4)'
    ];

    function updateIngredientsBackdrop(text) {
        if (!labelBackdrop) return;
        const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

        let html = '';
        const parts = text.split(',');

        parts.forEach((part, i) => {
            const color = ingredientColors[i % ingredientColors.length];
            const leadingMatch = part.match(/^\s*/);
            const trailingMatch = part.match(/\s*$/);
            const leadingSpace = leadingMatch ? leadingMatch[0] : '';
            const trailingSpace = trailingMatch ? trailingMatch[0] : '';
            const core = part.substring(leadingSpace.length, part.length - trailingSpace.length);

            html += escape(leadingSpace);
            if (core) {
                html += `<span style="background-color: ${color}; border-radius: 4px; color: transparent;">${escape(core)}</span>`;
            }
            html += escape(trailingSpace);

            if (i < parts.length - 1) {
                html += ',';
            }
        });

        if (text.endsWith('\n')) html += '&nbsp;';
        labelBackdrop.innerHTML = html;
    }

    if (labelTextarea && labelBackdrop) {
        labelTextarea.addEventListener('scroll', () => {
            labelBackdrop.scrollTop = labelTextarea.scrollTop;
            labelBackdrop.scrollLeft = labelTextarea.scrollLeft;
        });
    }

    // table of concentration ranges
    const concentrationRanges = [
        { "concentrationRange": "A", "percentageMin": 80.0, "percentageMax": 100.0 },
        { "concentrationRange": "B", "percentageMin": 60.0, "percentageMax": 80.0 },
        { "concentrationRange": "C", "percentageMin": 40.0, "percentageMax": 60.0 },
        { "concentrationRange": "D", "percentageMin": 20.0, "percentageMax": 40.0 },
        { "concentrationRange": "E", "percentageMin": 10.0, "percentageMax": 20.0 },
        { "concentrationRange": "F", "percentageMin": 1.0, "percentageMax": 10.0 },
        { "concentrationRange": "G", "percentageMin": 0.5, "percentageMax": 1.0 },
        { "concentrationRange": "H", "percentageMin": 0.1, "percentageMax": 0.5 },
        { "concentrationRange": "I", "percentageMin": 0.05, "percentageMax": 0.1 },
        { "concentrationRange": "J", "percentageMin": 0.0, "percentageMax": 0.05 }
    ]

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
            if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
                throw new Error("The template must be a PDF document.");
            }
            const { text, pageCount } = await parsePdfText(file);
            templatePdfText = text;
            templatePdfName.textContent = file.name;
            templatePdfMeta.textContent = `${pageCount} page${pageCount !== 1 ? 's' : ''} · ${(file.size / 1024).toFixed(0)} KB · ${text.length.toLocaleString()} characters extracted`;
            templateFileInfo.textContent = `${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`;
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
        templatePdfText = null;
        templateFileInput.value = '';
        templatePdfName.textContent = '';
        templatePdfMeta.textContent = '';
        templateUploadContent.classList.remove('hidden');
        templatePreviewContainer.classList.add('hidden');
        resultSection.classList.add('hidden');
        document.getElementById('download-pdf-btn').style.display = 'none';
        validateState();
    });

    clearLabelBtn.addEventListener('click', () => {
        labelBase64 = null;
        labelFileInput.value = '';
        labelUploadContent.classList.remove('hidden');
        labelPreviewContainer.classList.add('hidden');
        resultSection.classList.add('hidden');
        document.getElementById('download-pdf-btn').style.display = 'none';
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

    // Parse all text from a PDF using PDF.js (no rendering needed)
    async function parsePdfText(file) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const pageCount = pdf.numPages;
        const pageTexts = [];
        for (let i = 1; i <= pageCount; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            // Join text items, preserving line breaks via transform y-position changes
            let lastY = null;
            let pageText = '';
            for (const item of content.items) {
                if (lastY !== null && Math.abs(item.transform[5] - lastY) > 2) {
                    pageText += '\n';
                }
                pageText += item.str;
                lastY = item.transform[5];
            }
            pageTexts.push(pageText.trim());
        }
        return { text: pageTexts.join('\n\n--- Page Break ---\n\n'), pageCount };
    }

    function validateState() {
        const hasKey = apiKeyInput.value.trim().length > 0;
        extractBtn.disabled = !(hasKey && templatePdfText && labelBase64);
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

    // Text-only AI call: sends the document text inline in the prompt (no image attachment).
    async function fetchAiTextExtraction(apiKey, documentText, prompt, maxRetries = 3) {
        const fullPrompt = `${prompt}\n\n=== DOCUMENT TEXT START ===\n${documentText}\n=== DOCUMENT TEXT END ===`;
        let lastError = null;

        let apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
        let aiModel = 'openrouter/free';
        let isGeminiFormat = false;
        let isAnthropicFormat = false;

        if (apiKey.startsWith('AIza')) {
            apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
            isGeminiFormat = true;
        } else if (apiKey.startsWith('sk-ant-')) {
            apiUrl = 'https://api.anthropic.com/v1/messages';
            isAnthropicFormat = true;
            aiModel = 'claude-haiku-4-5-20251001';
        } else if (/^[a-zA-Z0-9]{32}$/.test(apiKey)) {
            apiUrl = 'https://api.mistral.ai/v1/chat/completions';
            aiModel = 'mistral-small-latest';
        } else if (!apiKey.startsWith('sk-or-v1-')) {
            apiUrl = 'https://api.openai.com/v1/chat/completions';
            aiModel = 'gpt-4o-mini';
        }

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                let payload;
                let headers = { 'Content-Type': 'application/json' };

                if (isGeminiFormat) {
                    payload = {
                        contents: [{ parts: [{ text: fullPrompt }] }],
                        generationConfig: { responseMimeType: "application/json" }
                    };
                } else if (isAnthropicFormat) {
                    headers['x-api-key'] = apiKey;
                    headers['anthropic-version'] = '2023-06-01';
                    headers['anthropic-dangerous-direct-browser-access'] = 'true';
                    payload = {
                        model: aiModel,
                        max_tokens: 4096,
                        messages: [{ role: "user", content: [{ type: "text", text: fullPrompt }] }]
                    };
                } else {
                    headers['Authorization'] = `Bearer ${apiKey}`;
                    if (apiUrl === 'https://openrouter.ai/api/v1/chat/completions') {
                        headers['HTTP-Referer'] = window.location.href;
                        headers['X-Title'] = 'Ingredient Extractor';
                    }
                    payload = {
                        model: aiModel,
                        max_tokens: 4096,
                        messages: [{ role: "user", content: fullPrompt }]
                    };
                    if (apiUrl === 'https://api.openai.com/v1/chat/completions' || apiUrl === 'https://api.mistral.ai/v1/chat/completions') {
                        payload.response_format = { type: "json_object" };
                    }
                }

                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(payload)
                });

                const data = await response.json();
                if (!response.ok) throw new Error(data.error?.message || 'API Request Failed');

                if (isGeminiFormat) {
                    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) throw new Error("Invalid response structure from Gemini API");
                    return data.candidates[0].content.parts[0].text;
                } else if (isAnthropicFormat) {
                    if (!data.content?.[0]?.text) throw new Error("Invalid response structure from Anthropic API");
                    return data.content[0].text;
                } else {
                    return data.choices?.[0]?.message?.content || '{}';
                }
            } catch (error) {
                lastError = error;
                console.warn(`Text extraction attempt ${attempt} failed:`, error.message);
                if (attempt < maxRetries) await new Promise(r => setTimeout(r, 2000 * attempt));
            }
        }
        throw lastError;
    }

    async function fetchAiExtraction(apiKey, imageBase64, prompt, maxRetries = 3) {
        let lastError = null;

        let apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
        let aiModel = 'openrouter/free';
        let isGeminiFormat = false;
        let isAnthropicFormat = false;
        let isMistralFormat = false;

        // Auto-detect key type
        if (apiKey.startsWith('AIza')) {
            apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
            isGeminiFormat = true;
        } else if (apiKey.startsWith('sk-ant-')) {
            apiUrl = 'https://api.anthropic.com/v1/messages';
            isAnthropicFormat = true;
            aiModel = 'claude-haiku-4-5-20251001';
        } else if (/^[a-zA-Z0-9]{32}$/.test(apiKey)) {
            apiUrl = 'https://api.mistral.ai/v1/ocr';
            isMistralFormat = true;
            aiModel = 'mistral-ocr-2512';
        } else if (!apiKey.startsWith('sk-or-v1-')) {
            apiUrl = 'https://api.openai.com/v1/chat/completions';
            aiModel = 'gpt-4o-mini'; // Extremely fast and supports vision + json formatting natively
        }

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                if (isMistralFormat) {
                    const ocrResponse = await fetch('https://api.mistral.ai/v1/ocr', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${apiKey}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            model: "mistral-ocr-2512",
                            document: {
                                type: "document_url",
                                document_url: imageBase64
                            }
                        })
                    });

                    const ocrData = await ocrResponse.json();
                    if (!ocrResponse.ok) throw new Error(ocrData.message || 'Mistral OCR API Failed');

                    const markdownText = ocrData.pages.map(p => p.markdown).join('\n');

                    const fullPrompt = `${prompt}\n\n=== OCR EXTRACTED TEXT ===\n${markdownText}\n========================`;
                    const chatResponse = await fetch('https://api.mistral.ai/v1/chat/completions', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${apiKey}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            model: "mistral-small-latest",
                            messages: [{ role: "user", content: fullPrompt }],
                            response_format: { type: "json_object" }
                        })
                    });

                    const chatData = await chatResponse.json();
                    if (!chatResponse.ok) throw new Error(chatData.message || 'Mistral Chat API Failed');

                    return chatData.choices?.[0]?.message?.content || '{}';
                }

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
                } else if (isAnthropicFormat) {
                    const base64Data = imageBase64.split(',')[1];
                    const mimeType = imageBase64.split(';')[0].split(':')[1];

                    headers['x-api-key'] = apiKey;
                    headers['anthropic-version'] = '2023-06-01';
                    headers['anthropic-dangerous-direct-browser-access'] = 'true';

                    payload = {
                        model: aiModel,
                        max_tokens: 4096,
                        messages: [
                            {
                                role: "user",
                                content: [
                                    {
                                        type: "image",
                                        source: {
                                            type: "base64",
                                            media_type: mimeType || 'image/jpeg',
                                            data: base64Data
                                        }
                                    },
                                    { type: "text", text: prompt }
                                ]
                            }
                        ]
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
                } else if (isAnthropicFormat) {
                    if (!data.content?.[0]?.text) throw new Error("Invalid response structure from Anthropic API");
                    return data.content[0].text;
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
        if (!apiKey || !templatePdfText || !labelBase64) return;

        const startTime = performance.now();

        setProcessingUI(true, "AI is processing documents...");
        resultSection.classList.add('hidden');
        document.getElementById('download-pdf-btn').style.display = 'none';
        validationStatus.innerHTML = '';
        validationResults.innerHTML = '';
        resultContent.textContent = '';

        try {
            const templatePrompt = `Extract the following from the template document and return strictly as a valid JSON object with no extra text:
1. The metadata fields: "marca", "proyecto", "formula", "ensayo" (look for labels like Marca, Proyecto, Fórmula/Formula, Ensayo in the document header or info section; use empty string if not found).
2. The list of ingredients and their percentages. Exclude any ingredients in sections labelled 'No etiquetables' (e.g. 'Alergenos No etiquetables'), but include those in sections like 'Alergenos etiquetables'.
Return exactly this JSON format: {"marca": "string", "proyecto": "string", "formula": "string", "ensayo": "string", "ingredients": [{"name": "string", "percentage": number}]}`;
            const labelPrompt = `Extract the list of ingredients from the product label in the exact order they appear. Return strictly as a valid JSON object with this format exactly: {"ingredients": ["string", "string"]}. Do not include any extra text.`;

            let templateResponseText = await fetchAiTextExtraction(apiKey, templatePdfText, templatePrompt);
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

            const templateMeta = {
                marca:    templateJson.marca    || '',
                proyecto: templateJson.proyecto || '',
                formula:  templateJson.formula  || '',
                ensayo:   templateJson.ensayo   || ''
            };

            const templateItems = templateJson.ingredients.map(i => ({
                ...i,
                name: i.name.replace(/\*/g, '').trim()
            }));

            const labelItems = labelJson.ingredients.map(name => name.replace(/\*/g, '').trim());

            const labelTextarea = document.getElementById('label-ingredients-edit');
            labelTextarea.value = labelItems.join(', ');
            updateIngredientsBackdrop(labelTextarea.value);

            const initialTimeTaken = ((performance.now() - startTime) / 1000).toFixed(2);

            const runValidation = (currentLabelItems) => {
                const normTemplateMap = new Map();
                templateItems.forEach(i => normTemplateMap.set(normalizeIngredient(i.name), i));

                const normLabelItems = currentLabelItems.map(name => normalizeIngredient(name));
                const labelOriginalNames = new Map();
                currentLabelItems.forEach(name => labelOriginalNames.set(normalizeIngredient(name), name));

                const missing = [];
                for (const item of templateItems) {
                    if (!normLabelItems.includes(normalizeIngredient(item.name))) {
                        missing.push(item.name);
                    }
                }

                const unnecessary = [];
                for (const originalName of currentLabelItems) {
                    if (!normTemplateMap.has(normalizeIngredient(originalName))) {
                        unnecessary.push(originalName);
                    }
                }

                // Calculation for misordered
                const strictTemplateItems = templateItems.filter(i => {
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

                const labelNodes = currentLabelItems.map((name, index) => {
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
                validationStatus.innerHTML = (isSuccess ? '✅ Validation Passed!' : '❌ Validation Failed') + `<div style="font-size: 0.85em; font-weight: normal; margin-top: 5px; opacity: 0.8;">Validation took ${initialTimeTaken} seconds</div>`;

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

                const downloadBtn = document.getElementById('download-pdf-btn');
                if (downloadBtn) {
                    downloadBtn.style.display = 'flex';
                    // Remove previous event listeners by cloning
                    const newBtn = downloadBtn.cloneNode(true);
                    downloadBtn.parentNode.replaceChild(newBtn, downloadBtn);
                    newBtn.addEventListener('click', () => {
                        const originalHTML = newBtn.innerHTML;
                        newBtn.innerHTML = 'Generating...';
                        newBtn.disabled = true;
                        const currentLabelText = labelTextarea ? labelTextarea.value : '';
                        // Small delay to let the button text update render
                        setTimeout(() => {
                            generatePdfReport(templateNodes, labelNodes, isSuccess, missing, unnecessary, misordered, templateMeta, currentLabelText)
                                .finally(() => {
                                    newBtn.innerHTML = originalHTML;
                                    newBtn.disabled = false;
                                });
                        }, 50);
                    });
                }

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
            };

            runValidation(labelItems);

            resultSection.classList.remove('hidden');
            resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

            labelTextarea.addEventListener('input', (e) => {
                updateIngredientsBackdrop(e.target.value);
                const updatedLabelItems = e.target.value.split(',').map(s => s.trim()).filter(s => s.length > 0);
                runValidation(updatedLabelItems);
            });

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

    function generatePdfReport(templateNodes, labelNodes, isSuccess, missing, unnecessary, misordered, meta, labelIngredientsText) {
        // Use jsPDF directly — no html2canvas / DOM capture needed, fully reliable
        var jsPDFClass = (window.jspdf && window.jspdf.jsPDF) || window.jsPDF;
        if (!jsPDFClass) { alert('PDF library not loaded. Please refresh the page.'); return Promise.resolve(); }

        var doc = new jsPDFClass({ unit: 'mm', format: 'a4', orientation: 'portrait' });
        var pageW = doc.internal.pageSize.getWidth();
        var pageH = doc.internal.pageSize.getHeight();
        var margin = 15;
        var contentW = pageW - margin * 2;
        var y = margin;
        var concColW = 32;  // Concentration column width
        var nameColW = contentW - concColW;
        var rowH = 7;

        function getConcentrationLabel(pctNum) {
            if (pctNum === null || pctNum === undefined) return '—';
            for (var ci = 0; ci < concentrationRanges.length; ci++) {
                var r = concentrationRanges[ci];
                if (pctNum >= r.percentageMin && pctNum < r.percentageMax) {
                    return r.concentrationRange;
                }
            }
            // Edge case: exactly 100 %
            if (pctNum >= 80) return concentrationRanges[0].concentrationRange;
            return '—';
        }

        function checkPage(needed) {
            if (y + needed > pageH - margin) {
                doc.addPage();
                y = margin;
            }
        }

        // --- Header ---
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(18);
        doc.setTextColor(59, 130, 246);
        doc.text('Ingredient Validation Report', pageW / 2, y + 7, { align: 'center' });
        y += 12;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(100, 116, 139);
        doc.text('Generated on ' + new Date().toLocaleString(), pageW / 2, y, { align: 'center' });
        y += 7;

        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.3);
        doc.line(margin, y, pageW - margin, y);
        y += 7;

        // --- Metadata fields ---
        var metaFields = [
            { label: 'Marca',    value: meta.marca },
            { label: 'Proyecto', value: meta.proyecto },
            { label: 'F\u00f3rmula', value: meta.formula },
            { label: 'Ensayo',   value: meta.ensayo }
        ];
        var metaColW = contentW / 2;
        metaFields.forEach(function(field, i) {
            var col = i % 2;
            var xPos = margin + col * metaColW;
            if (col === 0 && i > 0) { y += 7; }
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(9);
            doc.setTextColor(100, 116, 139);
            doc.text(field.label + ':', xPos, y);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(30, 41, 59);
            var valLines = doc.splitTextToSize(field.value || '—', metaColW - 25);
            doc.text(valLines, xPos + 22, y);
        });
        y += 10;

        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.3);
        doc.line(margin, y, pageW - margin, y);
        y += 8;

        // --- Product Label Image ---
        if (labelBase64 && labelImagePreview && labelImagePreview.naturalWidth > 0) {
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(12);
            doc.setTextColor(30, 41, 59);
            doc.text('Product Label Image', margin, y);
            y += 6;

            var imgW = contentW;
            var imgH = (labelImagePreview.naturalHeight / labelImagePreview.naturalWidth) * imgW;
            var maxImgH = pageH - margin * 2 - 20;

            if (imgH > maxImgH) {
                imgH = maxImgH;
                imgW = (labelImagePreview.naturalWidth / labelImagePreview.naturalHeight) * imgH;
            }

            checkPage(imgH + 10);

            var imgFormat = 'JPEG';
            if (labelBase64.startsWith('data:image/png')) imgFormat = 'PNG';
            else if (labelBase64.startsWith('data:image/webp')) imgFormat = 'WEBP';

            try {
                doc.addImage(labelBase64, imgFormat, margin + (contentW - imgW) / 2, y, imgW, imgH);
            } catch (e) {
                console.warn('Could not add label image to PDF:', e);
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(10);
                doc.text('(Image format not supported by PDF generator)', margin, y + 5);
                imgH = 10;
            }
            y += imgH + 10;
        }

        // --- Ingredients Found in the Label (First Page) ---
        checkPage(20);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(30, 41, 59);
        doc.text('Ingredients Found in the Label', margin, y);
        y += 6;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(51, 65, 85);
        var labelLines = doc.splitTextToSize(labelIngredientsText || '—', contentW);
        doc.text(labelLines, margin, y);
        y += labelLines.length * 4.5 + 4;

        // --- Ingredients in the Template (First Page) ---
        checkPage(20);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(30, 41, 59);
        doc.text('Ingredients in the Template', margin, y);
        y += 6;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(51, 65, 85);
        var templateString = templateNodes.map(t => t.name).join(', ');
        var templateLines = doc.splitTextToSize(templateString || '—', contentW);
        doc.text(templateLines, margin, y);
        y += templateLines.length * 4.5 + 6;

        // Force rest of report to next page
        doc.addPage();
        y = margin;

        // --- Ingredients Mapping Diagram ---
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(30, 41, 59);
        doc.text('Ingredients Mapping Diagram', pageW / 2, y + 6, { align: 'center' });
        y += 12;

        var diagRowH = 5.2; // Compact row height
        var diagBoxH = 4.2;
        var colW = 65;
        var tColX = margin + 12;
        var lColX = pageW - margin - colW;
        
        // Headers for columns
        doc.setFontSize(9);
        doc.setTextColor(100, 116, 139);
        doc.text('TEMPLATE', tColX + colW/2, y, { align: 'center' });
        doc.text('LABEL', lColX + colW/2, y, { align: 'center' });
        
        doc.setFontSize(6.5);
        doc.text('CONCENTRATION', tColX - 6, y - 1.5, { align: 'center' });
        doc.text('RANGE', tColX - 6, y + 1.5, { align: 'center' });
        
        y += 6;

        var tPositions = {};
        var lPositions = {};

        // Render Template Column
        var currentY = y;
        var separatorAdded = false;
        templateNodes.forEach(function(t, i) {
            if (!separatorAdded && t.pctNum !== null && t.pctNum < 1) {
                // Draw 1% threshold
                doc.setDrawColor(148, 163, 184);
                doc.setLineWidth(0.2);
                doc.line(tColX - 3, currentY, tColX + colW + 5, currentY);
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(7);
                doc.setTextColor(148, 163, 184);
                doc.text('< 1%', tColX - 11, currentY + 1);
                currentY += 2;
                separatorAdded = true;
            }

            var itemY = currentY;
            tPositions[t.id] = itemY + diagBoxH/2;

            // Concentration Letter
            var concLabel = getConcentrationLabel(t.pctNum);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(8);
            doc.setTextColor(59, 130, 246);
            doc.text(concLabel, tColX - 6, itemY + diagBoxH/2 + 1, { align: 'center' });

            // Status Color
            var statusColor = [148, 163, 184]; // default
            if (t.status === 'matched') statusColor = [16, 185, 129];
            else if (t.status === 'missing') statusColor = [245, 158, 11];
            
            doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
            doc.rect(tColX, itemY, 1.5, diagBoxH, 'F');

            // Item Box
            doc.setFillColor(248, 250, 252);
            doc.setDrawColor(226, 232, 240);
            doc.rect(tColX + 1.5, itemY, colW - 1.5, diagBoxH, 'FD');

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(7.5);
            doc.setTextColor(51, 65, 85);
            var displayName = t.name;
            if (displayName.length > 35) displayName = displayName.substring(0, 32) + '...';
            doc.text(displayName, tColX + 3, itemY + diagBoxH/2 + 0.8);

            currentY += diagRowH;
        });

        // Render Label Column
        currentY = y;
        labelNodes.forEach(function(l, i) {
            var itemY = currentY;
            lPositions[l.id] = itemY + diagBoxH/2;

            // Status Color
            var statusColor = [148, 163, 184];
            if (l.status === 'matched') statusColor = [16, 185, 129];
            else if (l.status === 'misordered') statusColor = [59, 130, 246];
            else if (l.status === 'unnecessary') statusColor = [239, 68, 68];

            doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
            doc.rect(lColX, itemY, 1.5, diagBoxH, 'F');

            // Item Box
            doc.setFillColor(248, 250, 252);
            doc.setDrawColor(226, 232, 240);
            doc.rect(lColX + 1.5, itemY, colW - 1.5, diagBoxH, 'FD');

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(7.5);
            doc.setTextColor(51, 65, 85);
            var displayName = l.name;
            if (displayName.length > 35) displayName = displayName.substring(0, 32) + '...';
            doc.text(displayName, lColX + 3, itemY + diagBoxH/2 + 0.8);

            currentY += diagRowH;
        });

        // Draw Connections (Arrows)
        templateNodes.forEach(function(t) {
            if (t.status !== 'missing') {
                labelNodes.forEach(function(l) {
                    if (l.normName === t.normName) {
                        var startX = tColX + colW;
                        var startY = tPositions[t.id];
                        var endX = lColX;
                        var endY = lPositions[l.id];

                        var color = (l.status === 'misordered') ? [59, 130, 246] : [16, 185, 129];
                        doc.setDrawColor(color[0], color[1], color[2]);
                        doc.setLineWidth(0.3);
                        
                        // Draw line
                        doc.line(startX, startY, endX, endY);
                        
                        // Draw arrow head
                        var headSize = 1.2;
                        var angle = Math.atan2(endY - startY, endX - startX);
                        doc.setFillColor(color[0], color[1], color[2]);
                        doc.triangle(
                            endX, endY,
                            endX - headSize * Math.cos(angle - Math.PI/6), endY - headSize * Math.sin(angle - Math.PI/6),
                            endX - headSize * Math.cos(angle + Math.PI/6), endY - headSize * Math.sin(angle + Math.PI/6),
                            'F'
                        );
                    }
                });
            }
        });

        // Force rest of report to next page
        doc.addPage();
        y = margin;

        y += 3;



        // --- Validation Results ---
        checkPage(16);
        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.3);
        doc.line(margin, y, pageW - margin, y);
        y += 6;

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(30, 41, 59);
        doc.text('Validation Results', margin, y);
        y += 7;

        if (isSuccess) {
            checkPage(12);
            doc.setFillColor(220, 252, 231);
            doc.setDrawColor(134, 239, 172);
            doc.roundedRect(margin, y, contentW, 10, 2, 2, 'FD');
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(10);
            doc.setTextColor(22, 101, 52);
            doc.text('Validation Passed — All ingredients match the template properly.', margin + 3, y + 6.5);
            y += 14;
        } else {
            checkPage(12);
            doc.setFillColor(254, 226, 226);
            doc.setDrawColor(252, 165, 165);
            doc.roundedRect(margin, y, contentW, 10, 2, 2, 'FD');
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(10);
            doc.setTextColor(153, 27, 27);
            doc.text('Validation Failed', margin + 3, y + 6.5);
            y += 14;

            function renderList(title, items, r, g, b) {
                if (!items.length) return;
                // Reserve space for title + at least the first item so the
                // heading is never stranded alone at the bottom of a page.
                checkPage(16);
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(10);
                doc.setTextColor(r, g, b);
                doc.text(title + ' (' + items.length + ')', margin, y);
                y += 6;
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(71, 85, 105);
                items.forEach(function(item) {
                    var itemLines = doc.splitTextToSize('• ' + item, contentW - 5);
                    checkPage(itemLines.length * 5);
                    doc.text(itemLines, margin + 3, y);
                    y += itemLines.length * 5;
                });
                y += 4;
            }

            renderList('Missing Ingredients', missing, 234, 88, 12);
            renderList('Unnecessary Ingredients', unnecessary, 244, 63, 94);
            renderList('Misordered Ingredients', misordered, 59, 130, 246);
        }

        doc.save('validation-report.pdf');
        return Promise.resolve();
    }

    // Lens Effect Setup
    const globalLens = document.createElement('div');
    globalLens.className = 'lens';
    const lensImg = document.createElement('img');
    lensImg.className = 'lens-img';
    globalLens.appendChild(lensImg);
    document.body.appendChild(globalLens);

    function setupLens(image) {
        const zoom = 5;

        image.addEventListener('mouseenter', () => {
            if (!image.getAttribute('src')) return;
            globalLens.style.display = 'block';
            lensImg.src = image.src;
        });

        image.addEventListener('mouseleave', () => {
            globalLens.style.display = 'none';
        });

        image.addEventListener('mousemove', (e) => {
            if (!image.getAttribute('src')) return;
            const rect = image.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const lensWidth = globalLens.offsetWidth || 500;
            const lensHeight = globalLens.offsetHeight || 500;

            globalLens.style.left = (e.pageX - lensWidth / 2) + 'px';
            globalLens.style.top = (e.pageY - lensHeight / 2) + 'px';

            const imgWidth = image.clientWidth * zoom;
            const imgHeight = image.clientHeight * zoom;
            lensImg.style.width = `${imgWidth}px`;
            lensImg.style.height = `${imgHeight}px`;

            const imgPosX = (lensWidth / 2) - (x * zoom);
            const imgPosY = (lensHeight / 2) - (y * zoom);
            lensImg.style.left = `${imgPosX}px`;
            lensImg.style.top = `${imgPosY}px`;
        });
    }

    setupLens(labelImagePreview);
});
