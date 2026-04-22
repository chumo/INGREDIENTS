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
        let isAnthropicFormat = false;

        // Auto-detect key type
        if (apiKey.startsWith('AIza')) {
            apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
            isGeminiFormat = true;
        } else if (apiKey.startsWith('sk-ant-')) {
            apiUrl = 'https://api.anthropic.com/v1/messages';
            isAnthropicFormat = true;
            aiModel = 'claude-haiku-4-5-20251001';
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
        if (!apiKey || !templateBase64 || !labelBase64) return;

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

            const timeTaken = ((performance.now() - startTime) / 1000).toFixed(2);

            validationStatus.className = 'validation-status ' + (isSuccess ? 'success' : 'error');
            validationStatus.innerHTML = (isSuccess ? '✅ Validation Passed!' : '❌ Validation Failed') + `<div style="font-size: 0.85em; font-weight: normal; margin-top: 5px; opacity: 0.8;">Validation took ${timeTaken} seconds</div>`;

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
                    // Small delay to let the button text update render
                    setTimeout(() => {
                        generatePdfReport(templateNodes, isSuccess, missing, unnecessary, misordered, templateMeta)
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

    function generatePdfReport(templateNodes, isSuccess, missing, unnecessary, misordered, meta) {
        // Use jsPDF directly — no html2canvas / DOM capture needed, fully reliable
        var jsPDFClass = (window.jspdf && window.jspdf.jsPDF) || window.jsPDF;
        if (!jsPDFClass) { alert('PDF library not loaded. Please refresh the page.'); return Promise.resolve(); }

        var doc = new jsPDFClass({ unit: 'mm', format: 'a4', orientation: 'portrait' });
        var pageW = doc.internal.pageSize.getWidth();
        var pageH = doc.internal.pageSize.getHeight();
        var margin = 15;
        var contentW = pageW - margin * 2;
        var y = margin;
        var pctColW = 30;
        var nameColW = contentW - pctColW;
        var rowH = 7;

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

        // --- Ingredients Section ---
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(30, 41, 59);
        doc.text('Ingredients in Template', margin, y);
        y += 6;

        // Table header row
        doc.setFillColor(248, 250, 252);
        doc.setDrawColor(226, 232, 240);
        doc.rect(margin, y, nameColW, rowH, 'FD');
        doc.rect(margin + nameColW, y, pctColW, rowH, 'FD');
        doc.setFontSize(10);
        doc.setTextColor(30, 41, 59);
        doc.text('Ingredient', margin + 2, y + rowH / 2 + 1.5);
        doc.text('Percentage', margin + contentW - 2, y + rowH / 2 + 1.5, { align: 'right' });
        y += rowH;

        // Table data rows
        var separatorAdded = false;
        doc.setFont('helvetica', 'normal');
        templateNodes.forEach(function(t) {
            if (!separatorAdded && t.pctNum !== null && t.pctNum < 1) {
                checkPage(rowH);
                doc.setFillColor(241, 245, 249);
                doc.setDrawColor(226, 232, 240);
                doc.rect(margin, y, contentW, rowH, 'FD');
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(9);
                doc.setTextColor(100, 116, 139);
                doc.text('< 1% CONCENTRATION THRESHOLD', pageW / 2, y + rowH / 2 + 1.5, { align: 'center' });
                doc.setFont('helvetica', 'normal');
                y += rowH;
                separatorAdded = true;
            }

            checkPage(rowH);
            var pctText = t.percentage != null ? String(t.percentage) + (String(t.percentage).includes('%') ? '' : '%') : 'N/A';
            var name = t.name;
            // Wrap long names
            var lines = doc.splitTextToSize(name, nameColW - 4);
            var thisRowH = Math.max(rowH, lines.length * 5 + 2);
            checkPage(thisRowH);

            doc.setFillColor(255, 255, 255);
            doc.setDrawColor(226, 232, 240);
            doc.rect(margin, y, nameColW, thisRowH, 'FD');
            doc.rect(margin + nameColW, y, pctColW, thisRowH, 'FD');

            doc.setFontSize(10);
            doc.setTextColor(51, 65, 85);
            doc.text(lines, margin + 2, y + 4.8);

            doc.setTextColor(71, 85, 105);
            doc.text(pctText, margin + contentW - 2, y + thisRowH / 2 + 1.5, { align: 'right' });
            y += thisRowH;
        });

        y += 6;

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
                checkPage(10 + items.length * 6);
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(10);
                doc.setTextColor(r, g, b);
                doc.text(title + ' (' + items.length + ')', margin, y);
                y += 5;
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(71, 85, 105);
                items.forEach(function(item) {
                    checkPage(6);
                    var itemLines = doc.splitTextToSize('• ' + item, contentW - 5);
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

    setupLens(templateImagePreview);
    setupLens(labelImagePreview);
});
