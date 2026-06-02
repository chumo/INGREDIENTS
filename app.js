document.addEventListener('DOMContentLoaded', () => {
    const translations = {
        es: {
            header_app_name: "REGULATORIO DE ETIQUETADO",
            tab_home: "Inicio",
            tab_allergen: "Extractor de Alérgenos",
            tab_validator: "Validador de Ingredientes",
            home_subtitle: "Conéctate a un proveedor de modelos",
            app_title: "Validador de Ingredientes",
            app_subtitle: "Sube una plantilla y una etiqueta para validar la lista de ingredientes en la etiqueta.",
            allergen_title: "Extractor de Alérgenos",
            allergen_subtitle: "Sube un documento de alérgenos para extraer sus porcentajes de concentración.",
            api_key_label: "Clave API (OpenRouter, OpenAI, Gemini, Anthropic o Mistral)",
            api_key_placeholder: "Empieza por sk-or-v1-, sk-, AIza..., sk-ant-... o clave Mistral de 32 caracteres",
            template_header: "PLANTILLA",
            template_drop: "Arrastra y suelta la Plantilla",
            pdf_only: "Solo documentos PDF",
            browse_files: "Buscar Archivos",
            label_header: "ETIQUETA",
            label_drop: "Arrastra y suelta la Etiqueta",
            image_support: "Soporta PDF, PNG, JPG, JPEG",
            extract_validate: "Extraer y Validar",
            processing: "La IA está procesando los documentos...",
            extracted_ingredients: "Ingredientes Extraídos de la Etiqueta",
            edit_instructions: "Edita la lista separada por comas si la IA omitió o alucinó ingredientes. El informe se actualizará automáticamente.",
            validation_report: "Informe de Validación",
            download_pdf: "Descargar PDF",
            ingredient_mapping: "Mapeo de Ingredientes",
            validation_passed: "✅ ¡Validación Superada!",
            validation_failed: "❌ Validación Fallida",
            validation_took: "La validación tardó {time} segundos",
            missing_ingredients: "Ingredientes Faltantes",
            unnecessary_ingredients: "Ingredientes Innecesarios",
            misordered_ingredients: "Ingredientes Desordenados",
            match_properly: "Todos los ingredientes coinciden correctamente con la plantilla.",
            system_error: "❌ Error del Sistema: {error}",
            verify_ai_data: "Por favor, verifica que la IA haya devuelto datos correctos e inténtalo de nuevo.",
            template_col_header: "Plantilla",
            label_col_header: "Etiqueta",
            generating: "Generando...",
            pdf_report_title: "Informe de Validación de Ingredientes",
            pdf_generated_on: "Generado el",
            pdf_brand: "Marca",
            pdf_project: "Proyecto",
            pdf_formula: "Fórmula",
            pdf_test: "Ensayo",
            pdf_label_img: "Imagen de la Etiqueta del Producto",
            pdf_ingredients_found: "Ingredientes Encontrados en la Etiqueta",
            pdf_ingredients_template: "Ingredientes en la Plantilla",
            pdf_mapping_diagram: "Diagrama de Mapeo de Ingredientes",
            pdf_concentration: "CONCENTRACIÓN",
            pdf_range: "RANGO",
            pdf_validation_results: "Resultados de la Validación",
            pdf_success_msg: "Validación Superada — Todos los ingredientes coinciden correctamente con la plantilla.",
            pdf_fail_msg: "Validación Fallida",
            clear: "Borrar",
            processing_template: "Procesando plantilla...",
            processing_label: "Procesando etiqueta...",
            error_pdf_only: "La plantilla debe ser un documento PDF.",
            error_unsupported_label: "Tipo de archivo de etiqueta no soportado.",
            error_pdf_lib: "La biblioteca PDF no se ha cargado. Por favor, refresca la página.",
            ai_processing: "La IA está procesando los documentos...",
            pdf_meta: "{pageCount} página{plural} · {size} KB · {charCount} caracteres extraídos",
            template_prompt: `Extrae lo siguiente del documento de plantilla y devuélvelo estrictamente como un objeto JSON válido sin texto adicional:
1. Los campos de metadatos: "brand" (marca), "project" (proyecto), "formula" (fórmula), "test" (ensayo). Busca etiquetas como Brand/Marca, Project/Proyecto, Formula/Fórmula, Test/Trial/Ensayo. EXTRAE LOS VALORES LITERALMENTE como aparecen en el documento, NUNCA LOS TRADUZCAS ni los modifiques. Si el documento dice "Marca: (BC_8) ...", el valor debe ser "(BC_8) ...".
2. La lista de ingredientes y sus porcentajes. Excluye cualquier ingrediente en secciones etiquetadas como 'No etiquetables', pero incluye aquellos en secciones como 'Alergenos etiquetables'.
Devuelve exactamente este formato JSON: {"brand": "string", "project": "string", "formula": "string", "test": "string", "ingredients": [{"name": "string", "percentage": number}]}`,
            label_prompt: `Extrae la lista de ingredientes de la etiqueta del producto en el orden exacto en que aparecen. Devuélvelo estrictamente como un objeto JSON válido con este formato exacto: {"ingredients": ["string", "string"]}. No incluyas ningún texto adicional.`,
            roi_title: "Seleccionar Área de Ingredientes",
            roi_instructions: "Dibuja un recuadro sobre la zona donde aparecen los ingredientes para mejorar la precisión de la IA.",
            roi_use_full: "Usar Imagen Completa",
            roi_accept: "Aceptar Selección",
            allergen_uploader_title: "Alérgenos",
            uploaded_files: "Archivos Subidos",
            allergen_prompt: `Extract the following information from the provided document (text or images) and return it strictly as a valid JSON object:
- product_code: typically a 7-digit number near the product name.
- printing_date: typically found as a footnote or elsewhere in the document. Convert to YYYY-mm-dd format.
- allergens: list of INCI names with their corresponding concentration percentage. Use ONLY the INCI names provided in this list: {inci_list}. Some won't have a percentage, in such case assume 0. If a concentration is given as a range (e.g. '0.01 - 0.05%'), always return the upper value of that range (e.g. 0.05).
- extra_incis: list of ALL OTHER INCI names found in the document with their corresponding concentration percentage. Skip those already included in the 'allergens' list. If a range is found, always use the upper value.
Expected JSON format: {"product_code": "string", "printing_date": "string", "allergens": [{"inci": "string", "percentage": number}], "extra_incis": [{"inci": "string", "percentage": number}]}`,
            product_code: "Código de Producto",
            printing_date: "Fecha de Impresión",
            copy_to_clipboard: "Copiar al Portapapeles",
            concentrations_copied: "¡Copiado!",
            allergen_empty_msg: "Sube un PDF para ver los detalles",
            concentration_percent: "Concentración %",
            extra_incis_title: "Otros INCI encontrados",
            brand_label: "Marca",
            product_name_label: "Nombre del Producto",
            rinse_off_label: "¿Producto para aclarado?",
            dose_percent_label: "Dosis %",
            delete_column_tooltip: "Eliminar este componente",
            analysis_results_title: "Resultados del Análisis",
            sort_below_one_label: "Ordenar < 1% alfabéticamente",
            declared_allergens_heading: "Alérgenos a Declarar en Etiqueta"
        },
        en: {
            header_app_name: "LABEL REGULATORY",
            tab_home: "Home",
            tab_allergen: "Allergen Extractor",
            tab_validator: "Ingredients Validator",
            home_subtitle: "Connect to a Model Provider",
            app_title: "Ingredients Validator",
            app_subtitle: "Upload a template and a label to validate the list of ingredients in the label.",
            allergen_title: "Allergen Extractor",
            allergen_subtitle: "Upload an allergen document to extract their concentration percentages.",
            api_key_label: "API Key (OpenRouter, OpenAI, Gemini, Anthropic, or Mistral)",
            api_key_placeholder: "Starts with sk-or-v1-, sk-, AIza..., sk-ant-..., or 32-char Mistral key",
            template_header: "TEMPLATE",
            template_drop: "Drag & Drop Template",
            pdf_only: "PDF documents only",
            browse_files: "Browse Files",
            label_header: "LABEL",
            label_drop: "Drag & Drop Label",
            image_support: "Supports PDF, PNG, JPG, JPEG",
            extract_validate: "Extract & Validate",
            processing: "AI is processing documents...",
            extracted_ingredients: "Extracted Label Ingredients",
            edit_instructions: "Edit the comma-separated list below if the AI missed or hallucinated ingredients. The report will update automatically.",
            validation_report: "Validation Report",
            download_pdf: "Download PDF",
            ingredient_mapping: "Ingredient Mapping",
            validation_passed: "✅ Validation Passed!",
            validation_failed: "❌ Validation Failed",
            validation_took: "Validation took {time} seconds",
            missing_ingredients: "Missing Ingredients",
            unnecessary_ingredients: "Unnecessary Ingredients",
            misordered_ingredients: "Misordered Ingredients",
            match_properly: "All ingredients match the template properly.",
            system_error: "❌ System Error: {error}",
            verify_ai_data: "Please verify the AI returned proper data and try again.",
            template_col_header: "Template",
            label_col_header: "Label",
            generating: "Generating...",
            pdf_report_title: "Ingredient Validation Report",
            pdf_generated_on: "Generated on",
            pdf_brand: "Brand",
            pdf_project: "Project",
            pdf_formula: "Formula",
            pdf_test: "Test",
            pdf_label_img: "Product Label Image",
            pdf_ingredients_found: "Ingredients Found in the Label",
            pdf_ingredients_template: "Ingredients in the Template",
            pdf_mapping_diagram: "Ingredients Mapping Diagram",
            pdf_concentration: "CONCENTRATION",
            pdf_range: "RANGE",
            pdf_validation_results: "Validation Results",
            pdf_success_msg: "Validation Passed — All ingredients match the template properly.",
            pdf_fail_msg: "Validation Failed",
            clear: "Clear",
            processing_template: "Processing template...",
            processing_label: "Processing label...",
            error_pdf_only: "The template must be a PDF document.",
            error_unsupported_label: "Unsupported label file type.",
            error_pdf_lib: "PDF library not loaded. Please refresh the page.",
            ai_processing: "AI is processing documents...",
            pdf_meta: "{pageCount} page{plural} · {size} KB · {charCount} characters extracted",
            template_prompt: `Extract the following from the template document and return strictly as a valid JSON object with no extra text:
1. The metadata fields: "brand", "project", "formula", "test". Look for labels like Brand/Marca, Project/Proyecto, Formula/Fórmula, Test/Trial/Ensayo. EXTRACT THE VALUES LITERALLY as they appear in the document, NEVER TRANSLATE or modify them. If the document says "Marca: (BC_8) ...", the value must be "(BC_8) ...".
2. The list of ingredients and their percentages. Exclude any ingredients in sections labelled 'No etiquetables', but include those in sections like 'Alergenos etiquetables'.
Return exactly this JSON format: {"brand": "string", "project": "string", "formula": "string", "test": "string", "ingredients": [{"name": "string", "percentage": number}]}`,
            label_prompt: `Extract the list of ingredients from the product label in the exact order they appear. Return strictly as a valid JSON object with this format exactly: {"ingredients": ["string", "string"]}. Do not include any extra text.`,
            roi_title: "Select Ingredient Area",
            roi_instructions: "Draw a box over the area where the ingredients appear to improve AI accuracy.",
            roi_use_full: "Use Full Image",
            roi_accept: "Accept Selection",
            allergen_uploader_title: "Allergens",
            uploaded_files: "Uploaded Files",
            allergen_prompt: `Extract the following information from the provided document (text or images) and return it strictly as a valid JSON object:
- product_code: typically a 7-digit number near the product name.
- printing_date: typically found as a footnote or elsewhere in the document. Convert to YYYY-mm-dd format.
- allergens: list of INCI names with their corresponding concentration percentage. Use ONLY the INCI names provided in this list: {inci_list}. Some won't have a percentage, in such case assume 0. If a concentration is given as a range (e.g. '0.01 - 0.05%'), always return the upper value of that range (e.g. 0.05).
- extra_incis: list of ALL OTHER INCI names found in the document with their corresponding concentration percentage. Skip those already included in the 'allergens' list. If a range is found, always use the upper value.
Expected JSON format: {"product_code": "string", "printing_date": "string", "allergens": [{"inci": "string", "percentage": number}], "extra_incis": [{"inci": "string", "percentage": number}]}`,
            product_code: "Product Code",
            printing_date: "Printing Date",
            copy_to_clipboard: "Copy to Clipboard",
            concentrations_copied: "Copied!",
            allergen_empty_msg: "Upload a PDF to see details",
            concentration_percent: "Concentration %",
            extra_incis_title: "Other INCI names found",
            brand_label: "Brand",
            product_name_label: "Product Name",
            rinse_off_label: "Rinse-off product?",
            dose_percent_label: "Dose %",
            delete_column_tooltip: "Delete this component",
            analysis_results_title: "Analysis Results",
            sort_below_one_label: "Sort < 1% alphabetically",
            declared_allergens_heading: "Allergens to Declare on Label"
        }
    };

    window.switchTab = function(tabId) {
        document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

        document.getElementById(`tab-${tabId}`).classList.remove('hidden');
        document.getElementById(`tab-btn-${tabId}`).classList.add('active');

        const container = document.getElementById('main-container');
        if (container) {
            if (tabId === 'allergen') {
                container.classList.add('wide-container');
            } else {
                container.classList.remove('wide-container');
            }
        }

        // Scroll to top when switching tabs
        window.scrollTo(0, 0);
    };

    let currentLanguage = localStorage.getItem('preferredLanguage') || 'es';
    let templatePdfText = null;
    let labelBase64 = null; // This will store the CROPPED image for the AI
    let originalLabelBase64 = null; // This will store the FULL image for the report
    let templateItems = [];
    let templateMeta = {};
    let initialTimeTaken = 0;

    const apiKeyInput = document.getElementById('api-key');
    const templateDropZone = document.getElementById('template-drop-zone');
    const templateFileInput = document.getElementById('template-file-input');
    const templateUploadContent = document.getElementById('template-upload-content');
    const templatePreviewContainer = document.getElementById('template-preview-container');
    const templatePdfName = document.getElementById('template-pdf-name');
    const templatePdfMeta = document.getElementById('template-pdf-meta');
    const templateFileInfo = document.getElementById('template-file-info');
    const clearTemplateBtn = document.getElementById('clear-template-file');
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
    const labelTextarea = document.getElementById('label-ingredients-edit');
    const labelBackdrop = document.getElementById('label-ingredients-backdrop');
    const modelInfo = document.getElementById('model-info');
    const providerName = document.getElementById('provider-name');
    const modelVersion = document.getElementById('model-version');

    // Allergen Extractor Elements (Redesigned)
    const allergenBrandInput = document.getElementById('allergen-brand');
    const allergenProductNameInput = document.getElementById('allergen-product-name');
    const allergenRinseOffInput = document.getElementById('allergen-rinse-off');
    const copyConcentrationsBtn = document.getElementById('copy-concentrations-btn');
    const allergenTableBody = document.getElementById('allergen-table-body');
    const allergenTableHeader = document.getElementById('allergen-table-header');
    const allergenSortSwitch = document.getElementById('allergen-sort-switch');
    const downloadAllergenPdfBtn = document.getElementById('download-allergen-pdf-btn');
    const allergenMaxDoseInfo = document.getElementById('allergen-max-dose-info');
    const declaredAllergensList = document.getElementById('declared-allergens-list');
    const declaredAllergensHeading = document.getElementById('declared-allergens-heading');

    // Allergen tab State
    let allergenBrand = '';
    let allergenProductName = '';
    let allergenRinseOff = false;
    let allergenSortAlphabeticalBelowOne = false;
    let perfumeComponents = [
        {
            id: 'A',
            title: 'COMPONENT A',
            fileName: '',
            dosePercent: 0,
            productCode: '',
            printingDate: '',
            extraIncis: [],
            concentrations: {},
            isLoading: false
        }
    ];



    window.setLanguage = function(lang) {
        currentLanguage = lang;
        localStorage.setItem('preferredLanguage', lang);
        document.documentElement.lang = lang;

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang][key]) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = translations[lang][key];
                } else {
                    el.textContent = translations[lang][key];
                }
            }
        });

        apiKeyInput.placeholder = translations[lang].api_key_placeholder;
        document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById(`lang-${lang}`).classList.add('active');

        // Re-run validation if results are visible
        if (!resultSection.classList.contains('hidden')) {
            const currentLabelText = labelTextarea ? labelTextarea.value : '';
            const updatedLabelItems = currentLabelText.split(',').map(s => s.trim()).filter(s => s.length > 0);
            if (updatedLabelItems.length > 0 && typeof window.runValidation === 'function') {
                window.runValidation(updatedLabelItems);
            }
        }

        // Re-run allergen compliance and render to update translations
        if (typeof calculateAllergenCompliance === 'function') {
            calculateAllergenCompliance();
        }
        if (typeof renderAllergenTable === 'function') {
            renderAllergenTable();
        }
    };

    // Initialize language
    setLanguage(currentLanguage);


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

        labelTextarea.addEventListener('input', (e) => {
            updateIngredientsBackdrop(e.target.value);
            const updatedLabelItems = e.target.value.split(',').map(s => s.trim()).filter(s => s.length > 0);
            runValidation(updatedLabelItems);
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


    window.runValidation = (currentLabelItems) => {
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
                    <h4>${translations[currentLanguage].template_col_header}</h4>
                    ${templateColHtml}
                </div>
                <div class="comparison-column" id="label-col">
                    <h4>${translations[currentLanguage].label_col_header}</h4>
                    ${labelNodes.map(l => `<div class="ing-item ${l.status}" id="${l.id}">${l.name}</div>`).join('')}
                </div>
            </div>
        </div>
        `;

        resultContent.innerHTML = mappingHtml;

        // Render Validation Result
        let isSuccess = missing.length === 0 && unnecessary.length === 0 && misordered.length === 0;

        validationStatus.className = 'validation-status ' + (isSuccess ? 'success' : 'error');
        const statusText = isSuccess ? translations[currentLanguage].validation_passed : translations[currentLanguage].validation_failed;
        const tookText = translations[currentLanguage].validation_took.replace('{time}', initialTimeTaken);
        validationStatus.innerHTML = statusText + `<div style="font-size: 0.85em; font-weight: normal; margin-top: 5px; opacity: 0.8;">${tookText}</div>`;

        if (!isSuccess) {
            let html = '';
                if (missing.length > 0) {
                    html += `
                        <div class="validation-category missing">
                            <h4>⚠️ ${translations[currentLanguage].missing_ingredients} (${missing.length})</h4>
                            <ul>${missing.map(m => `<li>${m}</li>`).join('')}</ul>
                        </div>
                    `;
                }
                if (unnecessary.length > 0) {
                    html += `
                        <div class="validation-category unnecessary">
                            <h4>⚠️ ${translations[currentLanguage].unnecessary_ingredients} (${unnecessary.length})</h4>
                            <ul>${unnecessary.map(m => `<li>${m}</li>`).join('')}</ul>
                        </div>
                    `;
                }
                if (misordered.length > 0) {
                    html += `
                        <div class="validation-category misordered">
                            <h4>⚠️ ${translations[currentLanguage].misordered_ingredients} (${misordered.length})</h4>
                            <ul>${misordered.map(m => `<li>${m}</li>`).join('')}</ul>
                        </div>
                    `;
                }
            validationResults.innerHTML = html;
        } else {
            validationResults.innerHTML = `<p style="color: var(--text-muted); padding: 1rem; text-align: center;">${translations[currentLanguage].match_properly}</p>`;
        }

        const downloadBtn = document.getElementById('download-pdf-btn');
        if (downloadBtn) {
            downloadBtn.style.display = 'flex';
            // Remove previous event listeners by cloning
            const newBtn = downloadBtn.cloneNode(true);
            downloadBtn.parentNode.replaceChild(newBtn, downloadBtn);
            newBtn.addEventListener('click', () => {
                const originalHTML = newBtn.innerHTML;
                newBtn.innerHTML = translations[currentLanguage].generating;
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

    // Load saved API key if exists
    const savedKey = localStorage.getItem('openRouterApiKey');
    if (savedKey) {
        apiKeyInput.value = savedKey;
        validateState();
    }

    // Save API key on change
    apiKeyInput.addEventListener('input', (e) => {
        localStorage.setItem('openRouterApiKey', e.target.value);
        validateState();
    });

    function updateModelDisplay(key) {
        if (!key) {
            modelInfo.classList.add('hidden');
            return;
        }

        let provider = '';
        let version = '';
        let providerClass = '';

        if (key.startsWith('AIza')) {
            provider = 'Gemini';
            version = 'Gemini 2.5 Flash';
            providerClass = 'provider-gemini';
        } else if (key.startsWith('sk-ant-')) {
            provider = 'Anthropic';
            version = 'Claude Haiku 4.5';
            providerClass = 'provider-anthropic';
        } else if (/^[a-zA-Z0-9]{32}$/.test(key)) {
            provider = 'Mistral';
            version = 'Mistral Small / OCR';
            providerClass = 'provider-mistral';
        } else if (key.startsWith('sk-or-v1-')) {
            provider = 'OpenRouter';
            version = 'Auto / Free';
            providerClass = 'provider-openrouter';
        } else if (key.startsWith('sk-')) {
            provider = 'OpenAI';
            version = 'GPT-4o Mini';
            providerClass = 'provider-openai';
        } else {
            modelInfo.classList.add('hidden');
            return;
        }

        providerName.textContent = provider;
        providerName.className = 'provider-badge ' + providerClass;
        modelVersion.textContent = version;
        modelInfo.classList.remove('hidden');
    }

    // ROI Selector State & Elements
    const roiModal = document.getElementById('roi-modal');
    const roiCanvas = document.getElementById('roi-canvas');
    const roiCtx = roiCanvas.getContext('2d');
    const roiSelectionBox = document.getElementById('roi-selection-box');
    const roiAcceptBtn = document.getElementById('roi-accept-btn');
    const roiFullImageBtn = document.getElementById('roi-full-image-btn');
    const roiCanvasWrapper = document.getElementById('roi-canvas-wrapper');

    let roiStartX, roiStartY, isDrawing = false;
    let roiSelectedArea = null;
    let roiScale = 1;
    let roiOriginalImg = new Image();

    function openROIModal(imageBase64) {
        roiOriginalImg.src = imageBase64;
        roiOriginalImg.onload = () => {
            // Calculate scale to fit in viewport but keep it large
            const maxWidth = window.innerWidth * 0.8;
            const maxHeight = window.innerHeight * 0.6;
            let width = roiOriginalImg.width;
            let height = roiOriginalImg.height;

            if (width > maxWidth) {
                height *= maxWidth / width;
                width = maxWidth;
            }
            if (height > maxHeight) {
                width *= maxHeight / height;
                height = maxHeight;
            }

            roiCanvas.width = width;
            roiCanvas.height = height;
            roiScale = roiOriginalImg.width / width;

            roiCtx.drawImage(roiOriginalImg, 0, 0, width, height);

            // Reset selection
            roiSelectedArea = null;
            roiSelectionBox.style.display = 'none';
            roiModal.classList.remove('hidden');
        };
    }

    roiCanvasWrapper.addEventListener('mousedown', (e) => {
        const rect = roiCanvas.getBoundingClientRect();
        roiStartX = e.clientX - rect.left;
        roiStartY = e.clientY - rect.top;
        isDrawing = true;

        roiSelectionBox.style.display = 'block';
        roiSelectionBox.style.left = `${roiStartX}px`;
        roiSelectionBox.style.top = `${roiStartY}px`;
        roiSelectionBox.style.width = '0px';
        roiSelectionBox.style.height = '0px';
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDrawing) return;

        const rect = roiCanvas.getBoundingClientRect();
        let currentX = Math.max(0, Math.min(e.clientX - rect.left, roiCanvas.width));
        let currentY = Math.max(0, Math.min(e.clientY - rect.top, roiCanvas.height));

        const left = Math.min(roiStartX, currentX);
        const top = Math.min(roiStartY, currentY);
        const width = Math.abs(roiStartX - currentX);
        const height = Math.abs(roiStartY - currentY);

        roiSelectionBox.style.left = `${left}px`;
        roiSelectionBox.style.top = `${top}px`;
        roiSelectionBox.style.width = `${width}px`;
        roiSelectionBox.style.height = `${height}px`;

        roiSelectedArea = { left, top, width, height };
    });

    window.addEventListener('mouseup', () => {
        isDrawing = false;
    });

    roiAcceptBtn.addEventListener('click', () => {
        if (!roiSelectedArea || roiSelectedArea.width < 10 || roiSelectedArea.height < 10) {
            // If no area selected, just use full image
            labelBase64 = originalLabelBase64;
        } else {
            // Crop the image
            const cropCanvas = document.createElement('canvas');
            const cropCtx = cropCanvas.getContext('2d');

            cropCanvas.width = roiSelectedArea.width * roiScale;
            cropCanvas.height = roiSelectedArea.height * roiScale;

            cropCtx.drawImage(
                roiOriginalImg,
                roiSelectedArea.left * roiScale,
                roiSelectedArea.top * roiScale,
                roiSelectedArea.width * roiScale,
                roiSelectedArea.height * roiScale,
                0, 0,
                cropCanvas.width,
                cropCanvas.height
            );

            labelBase64 = cropCanvas.toDataURL('image/jpeg', 0.9);
        }

        roiModal.classList.add('hidden');
        validateState();
    });

    roiFullImageBtn.addEventListener('click', () => {
        labelBase64 = originalLabelBase64;
        roiModal.classList.add('hidden');
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
            setProcessingUI(true, translations[currentLanguage].processing_template);
            if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
                throw new Error(translations[currentLanguage].error_pdf_only);
            }
            const { text, pageCount } = await parsePdfText(file);
            templatePdfText = text;

            // Check if text is sparse, if so we might need OCR later
            const isImageBased = text.trim().length < 150;
            if (isImageBased) {
                console.log("Template PDF is image-based, will use OCR for extraction.");
                window._templateImages = await renderPdfToImages(file);
            } else {
                window._templateImages = null;
            }

            templatePdfName.textContent = file.name;
            const plural = currentLanguage === 'es' ? (pageCount !== 1 ? 's' : '') : (pageCount !== 1 ? 's' : '');
            templatePdfMeta.textContent = translations[currentLanguage].pdf_meta
                .replace('{pageCount}', pageCount)
                .replace('{plural}', plural)
                .replace('{size}', (file.size / 1024).toFixed(0))
                .replace('{charCount}', text.length.toLocaleString()) + (isImageBased ? " (OCR Mode)" : "");
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
            setProcessingUI(true, translations[currentLanguage].processing_label);
            labelFileInfo.textContent = `${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`;
            let base64;
            if (file.type === 'application/pdf') {
                base64 = await renderPdfToImage(file);
            } else if (file.type.startsWith('image/')) {
                base64 = await readImageToBase64(file);
            } else throw new Error(translations[currentLanguage].error_unsupported_label);

            originalLabelBase64 = base64;
            labelImagePreview.src = base64;
            labelUploadContent.classList.add('hidden');
            labelPreviewContainer.classList.remove('hidden');

            // Open ROI modal for the user to select ingredients area
            openROIModal(base64);

            validateState();
        } catch (e) {
            alert(e.message);
            clearLabelBtn.click();
        } finally {
            setProcessingUI(false);
        }
    });

    // --- Redesigned Allergen Extractor Logic ---

    // Bind top panel inputs
    if (allergenBrandInput) {
        allergenBrandInput.addEventListener('input', (e) => {
            allergenBrand = e.target.value;
            calculateAllergenCompliance();
        });
    }
    if (allergenProductNameInput) {
        allergenProductNameInput.addEventListener('input', (e) => {
            allergenProductName = e.target.value;
            calculateAllergenCompliance();
        });
    }
    if (allergenRinseOffInput) {
        allergenRinseOffInput.addEventListener('change', (e) => {
            allergenRinseOff = e.target.checked;
            calculateAllergenCompliance();
        });
    }
    if (allergenSortSwitch) {
        allergenSortSwitch.addEventListener('change', (e) => {
            allergenSortAlphabeticalBelowOne = e.target.checked;
            calculateAllergenCompliance();
        });
    }
    if (downloadAllergenPdfBtn) {
        downloadAllergenPdfBtn.addEventListener('click', () => {
            generateAllergenPdfReport();
        });
    }

    // Render function
    function renderAllergenTable() {
        if (typeof allergens === 'undefined') return;

        // 1. Render Headers
        allergenTableHeader.innerHTML = '';

        // Sticky INCI header
        const thInci = document.createElement('th');
        thInci.className = 'sticky-col';
        thInci.textContent = 'INCI';
        allergenTableHeader.appendChild(thInci);

        // Component headers
        perfumeComponents.forEach((comp, idx) => {
            const thComp = document.createElement('th');

            // Build the card element
            const card = document.createElement('div');
            card.className = 'component-header-panel';

            const topRow = document.createElement('div');
            topRow.className = 'component-header-top';

            const titleSpan = document.createElement('span');
            titleSpan.className = 'component-title';
            titleSpan.textContent = comp.title;
            topRow.appendChild(titleSpan);

            const copyBtn = document.createElement('button');
            copyBtn.className = 'btn-copy-column';
            copyBtn.style.background = 'none';
            copyBtn.style.border = 'none';
            copyBtn.style.cursor = 'pointer';
            copyBtn.style.color = 'var(--text-muted)';
            copyBtn.style.padding = '0 4px';
            copyBtn.style.marginLeft = 'auto';
            copyBtn.title = currentLanguage === 'es' ? 'Copiar esta columna' : 'Copy this column';
            copyBtn.innerHTML = `
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
            `;
            copyBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                copyComponentColumn(idx, copyBtn);
            });
            topRow.appendChild(copyBtn);

            // Delete button (only for extra columns)
            if (idx > 0) {
                const delBtn = document.createElement('button');
                delBtn.className = 'btn-delete-column';
                delBtn.title = translations[currentLanguage].delete_column_tooltip || "Delete this component";
                delBtn.innerHTML = '×';
                delBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    deleteComponentColumn(idx);
                });
                topRow.appendChild(delBtn);
            }

            card.appendChild(topRow);

            // Upload zone
            const uploadZone = document.createElement('div');
            uploadZone.className = 'component-upload-zone';
            uploadZone.id = `upload-zone-${comp.id}`;

            if (comp.isLoading) {
                uploadZone.innerHTML = '<span class="spinner-wheel"></span>';
            } else if (comp.fileName) {
                const fileInfoDiv = document.createElement('div');
                fileInfoDiv.className = 'component-file-info';

                const nameSpan = document.createElement('span');
                nameSpan.className = 'component-filename';
                nameSpan.textContent = comp.fileName;
                nameSpan.title = comp.fileName;
                fileInfoDiv.appendChild(nameSpan);

                const reuploadBtn = document.createElement('button');
                reuploadBtn.className = 'component-reupload-btn';
                reuploadBtn.textContent = '🔄';
                reuploadBtn.title = currentLanguage === 'es' ? 'Volver a subir' : 'Re-upload';
                reuploadBtn.addEventListener('click', () => fileInput.click());
                fileInfoDiv.appendChild(reuploadBtn);

                uploadZone.appendChild(fileInfoDiv);
            } else {
                const uBtn = document.createElement('button');
                uBtn.className = 'btn btn-primary btn-sm component-upload-btn';
                uBtn.textContent = translations[currentLanguage].browse_files || 'Browse Files';
                uBtn.addEventListener('click', () => fileInput.click());
                uploadZone.appendChild(uBtn);
            }

            // Hidden file input for this specific component
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = '.pdf,application/pdf';
            fileInput.style.display = 'none';
            fileInput.addEventListener('change', async (e) => {
                if (e.target.files.length > 0) {
                    await processComponentPdf(e.target.files[0], idx);
                }
            });
            thComp.appendChild(fileInput);

            // Setup Drag and Drop
            uploadZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadZone.classList.add('drag-active');
            });
            uploadZone.addEventListener('dragleave', () => {
                uploadZone.classList.remove('drag-active');
            });
            uploadZone.addEventListener('drop', async (e) => {
                e.preventDefault();
                uploadZone.classList.remove('drag-active');
                if (e.dataTransfer.files.length > 0) {
                    const file = e.dataTransfer.files[0];
                    if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
                        await processComponentPdf(file, idx);
                    } else {
                        alert(translations[currentLanguage].error_pdf_only);
                    }
                }
            });

            card.appendChild(uploadZone);

            // Dose % Row
            const doseRow = document.createElement('div');
            doseRow.className = 'component-field-row';
            const doseLabel = document.createElement('label');
            doseLabel.textContent = translations[currentLanguage].dose_percent_label || 'Dose %';
            doseRow.appendChild(doseLabel);

            const doseWrapper = document.createElement('div');
            doseWrapper.className = 'component-dose-wrapper';
            const doseInput = document.createElement('input');
            doseInput.type = 'number';
            doseInput.value = comp.dosePercent;
            doseInput.min = '0';
            doseInput.max = '100';
            doseInput.step = 'any';
            doseInput.addEventListener('input', (e) => {
                comp.dosePercent = parseFloat(e.target.value) || 0;
                calculateAllergenCompliance();
            });
            doseWrapper.appendChild(doseInput);
            doseWrapper.appendChild(document.createTextNode('%'));
            doseRow.appendChild(doseWrapper);

            card.appendChild(doseRow);

            // Product Code Row
            const codeRow = document.createElement('div');
            codeRow.className = 'component-field-row';
            const codeLabel = document.createElement('label');
            codeLabel.textContent = translations[currentLanguage].product_code || 'Code';
            codeRow.appendChild(codeLabel);
            const codeInput = document.createElement('input');
            codeInput.type = 'text';
            codeInput.value = comp.productCode;
            codeInput.placeholder = '—';
            codeInput.addEventListener('input', (e) => {
                comp.productCode = e.target.value;
                calculateAllergenCompliance();
            });
            codeRow.appendChild(codeInput);

            card.appendChild(codeRow);

            // Printing Date Row
            const dateRow = document.createElement('div');
            dateRow.className = 'component-field-row';
            const dateLabel = document.createElement('label');
            dateLabel.textContent = translations[currentLanguage].printing_date || 'Date';
            dateRow.appendChild(dateLabel);
            const dateInput = document.createElement('input');
            dateInput.type = 'text';
            dateInput.value = comp.printingDate;
            dateInput.placeholder = '—';
            dateInput.addEventListener('input', (e) => {
                comp.printingDate = e.target.value;
                calculateAllergenCompliance();
            });
            dateRow.appendChild(dateInput);

            card.appendChild(dateRow);

            // Other INCI names found
            const extraIncisDiv = document.createElement('div');
            extraIncisDiv.className = 'component-extra-incis';
            const extraIncisLabel = document.createElement('span');
            extraIncisLabel.className = 'extra-incis-label';
            extraIncisLabel.textContent = translations[currentLanguage].extra_incis_title || 'Other INCIs';
            extraIncisDiv.appendChild(extraIncisLabel);

            const extraList = document.createElement('div');
            extraList.className = 'extra-incis-list';
            if (comp.extraIncis && comp.extraIncis.length > 0) {
                comp.extraIncis.forEach(item => {
                    const extraItem = document.createElement('div');
                    extraItem.textContent = `${item.inci || item.name} (${item.percentage}%)`;
                    extraList.appendChild(extraItem);
                });
            } else {
                extraList.innerHTML = '<div style="color: var(--text-muted); font-style: italic;">None</div>';
            }
            extraIncisDiv.appendChild(extraList);

            card.appendChild(extraIncisDiv);

            thComp.appendChild(card);
            allergenTableHeader.appendChild(thComp);
        });

        // Plus Column header
        const thAdd = document.createElement('th');
        thAdd.className = 'component-add-th';
        const addBtn = document.createElement('button');
        addBtn.className = 'btn-add-column';
        addBtn.textContent = '+';
        addBtn.title = currentLanguage === 'es' ? 'Añadir componente' : 'Add component';
        addBtn.addEventListener('click', addComponentColumn);
        thAdd.appendChild(addBtn);
        allergenTableHeader.appendChild(thAdd);

        // 2. Render Body Rows
        allergenTableBody.innerHTML = '';
        allergens.forEach((item, rowIdx) => {
            const row = document.createElement('tr');

            // INCI name (sticky col)
            const tdInci = document.createElement('td');
            tdInci.className = 'sticky-col';
            tdInci.textContent = item.INCI;
            row.appendChild(tdInci);

            // Concentrations for each component
            perfumeComponents.forEach((comp) => {
                const tdVal = document.createElement('td');
                tdVal.className = 'concentration-value';
                tdVal.setAttribute('contenteditable', 'true');

                const normInci = normalizeIngredient(item.INCI);
                const currentVal = comp.concentrations[normInci] !== undefined ? comp.concentrations[normInci] : 0;
                tdVal.textContent = currentVal;

                // Track edits on blur so we don't lose focus while typing
                tdVal.addEventListener('blur', (e) => {
                    const val = parseConcentration(e.target.textContent);
                    comp.concentrations[normInci] = val;
                    e.target.textContent = val;
                    calculateAllergenCompliance();
                });

                row.appendChild(tdVal);
            });

            // Add spacer cell at the end corresponding to the plus column
            const tdAddSpacer = document.createElement('td');
            row.appendChild(tdAddSpacer);

            allergenTableBody.appendChild(row);
        });

        // Run compliance calculations
        calculateAllergenCompliance();
    }

    function calculateAllergenCompliance() {
        if (typeof allergens === 'undefined') return;

        const threshold = allergenRinseOff ? 0.01 : 0.001;
        let totalPerfumeDose = 0;
        perfumeComponents.forEach(comp => {
            totalPerfumeDose += (comp.dosePercent || 0);
        });

        const productAllergens = [];

        allergens.forEach(item => {
            const normInci = normalizeIngredient(item.INCI);
            let productConc = 0;

            perfumeComponents.forEach(comp => {
                const compConc = comp.concentrations[normInci] !== undefined ? comp.concentrations[normInci] : 0;
                productConc += compConc * ((comp.dosePercent || 0) / 100);
            });

            if (productConc > threshold) {
                productAllergens.push({
                    inci: item.INCI,
                    concentration: productConc
                });
            }
        });

        // Sort high >= 1% and low < 1%
        const highConc = productAllergens.filter(a => a.concentration >= 1.0);
        const lowConc = productAllergens.filter(a => a.concentration < 1.0);

        highConc.sort((a, b) => b.concentration - a.concentration);

        if (allergenSortAlphabeticalBelowOne) {
            lowConc.sort((a, b) => a.inci.localeCompare(b.inci));
        } else {
            lowConc.sort((a, b) => b.concentration - a.concentration);
        }

        const declaredList = [...highConc, ...lowConc];

        if (declaredAllergensHeading) {
            declaredAllergensHeading.textContent = currentLanguage === 'es'
                ? `Alérgenos a Declarar en Etiqueta (Total: ${declaredList.length})`
                : `Allergens to Declare on Label (Total: ${declaredList.length})`;
        }

        if (declaredAllergensList) {
            declaredAllergensList.innerHTML = '';
            if (declaredList.length === 0) {
                const emptyMsg = document.createElement('div');
                emptyMsg.className = 'no-allergens-msg';
                emptyMsg.textContent = currentLanguage === 'es' ? 'No hay alérgenos que declarar' : 'No allergens to declare';
                declaredAllergensList.appendChild(emptyMsg);
            } else {
                declaredList.forEach(item => {
                    const itemDiv = document.createElement('div');
                    itemDiv.className = 'declared-allergen-item';

                    const nameSpan = document.createElement('span');
                    nameSpan.className = 'allergen-inci';
                    nameSpan.textContent = item.inci;

                    const badgeSpan = document.createElement('span');
                    const isHigh = item.concentration >= 1.0;
                    badgeSpan.className = `allergen-concentration-badge ${isHigh ? 'high' : 'low'}`;
                    badgeSpan.textContent = item.concentration.toFixed(4).replace(/\.?0+$/, '') + '%';

                    itemDiv.appendChild(nameSpan);
                    itemDiv.appendChild(badgeSpan);
                    declaredAllergensList.appendChild(itemDiv);
                });
            }
        }

        // Calculate max safe perfume dosage before any single allergen triggers labeling.
        let maxPerfumeDosage = null;
        if (totalPerfumeDose > 0) {
            let minLimit = Infinity;
            allergens.forEach(item => {
                const normInci = normalizeIngredient(item.INCI);
                let productConc = 0;
                perfumeComponents.forEach(comp => {
                    const compConc = comp.concentrations[normInci] !== undefined ? comp.concentrations[normInci] : 0;
                    productConc += compConc * ((comp.dosePercent || 0) / 100);
                });

                if (productConc > 0) {
                    const limit = (threshold * totalPerfumeDose) / productConc;
                    if (limit < minLimit) {
                        minLimit = limit;
                    }
                }
            });
            if (minLimit !== Infinity) {
                maxPerfumeDosage = minLimit;
            }
        }

        if (allergenMaxDoseInfo) {
            if (maxPerfumeDosage === null) {
                const text = currentLanguage === 'es'
                    ? 'Dosis máxima de perfume permitida en producto antes de que sea obligatorio declarar alérgenos: <strong>Sin límite</strong>'
                    : 'Maximum perfume dosage allowed in the product before any single allergen triggers labeling: <strong>No limit</strong>';
                allergenMaxDoseInfo.innerHTML = text;
            } else {
                const formattedDose = maxPerfumeDosage.toFixed(4).replace(/\.?0+$/, '') + '%';
                const text = currentLanguage === 'es'
                    ? `Dosis máxima de perfume permitida en producto antes de que sea obligatorio declarar alérgenos: <strong>${formattedDose}</strong>`
                    : `Maximum perfume dosage allowed in the product before any single allergen triggers labeling: <strong>${formattedDose}</strong>`;
                allergenMaxDoseInfo.innerHTML = text;
            }
        }
    }

    function generateAllergenPdfReport() {
        var jsPDFClass = (window.jspdf && window.jspdf.jsPDF) || window.jsPDF;
        if (!jsPDFClass) {
            alert(translations[currentLanguage].error_pdf_lib || "PDF library not loaded");
            return;
        }

        var doc = new jsPDFClass({ unit: 'mm', format: 'a4', orientation: 'portrait' });
        var pageW = doc.internal.pageSize.getWidth();
        var pageH = doc.internal.pageSize.getHeight();
        var margin = 15;
        var contentW = pageW - margin * 2;
        var y = margin;

        function checkPage(needed) {
            if (y + needed > pageH - margin) {
                doc.addPage();
                y = margin;
            }
        }

        // --- Document Title ---
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(18);
        doc.setTextColor(59, 130, 246); // Primary accent
        const mainTitle = currentLanguage === 'es' ? 'INFORME DE ALÉRGENOS' : 'ALLERGEN COMPLIANCE REPORT';
        doc.text(mainTitle, pageW / 2, y + 7, { align: 'center' });
        y += 12;

        // --- Subtitle (Generated Date) ---
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(100, 116, 139);
        const dateText = (currentLanguage === 'es' ? 'Generado el ' : 'Generated on ') + new Date().toLocaleString(currentLanguage === 'es' ? 'es-ES' : 'en-US');
        doc.text(dateText, pageW / 2, y, { align: 'center' });
        y += 8;

        // Separator line
        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.3);
        doc.line(margin, y, pageW - margin, y);
        y += 8;

        // --- Product / Brand Metadata ---
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(30, 41, 59);
        doc.text(currentLanguage === 'es' ? 'Datos del Producto' : 'Product Information', margin, y);
        y += 6;

        doc.setFontSize(9);
        // Brand
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(100, 116, 139);
        doc.text((currentLanguage === 'es' ? 'Marca:' : 'Brand:'), margin, y);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(30, 41, 59);
        doc.text(allergenBrand || '—', margin + 35, y);
        y += 6;

        // Product Name
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(100, 116, 139);
        doc.text((currentLanguage === 'es' ? 'Nombre del Producto:' : 'Product Name:'), margin, y);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(30, 41, 59);
        doc.text(allergenProductName || '—', margin + 35, y);
        y += 6;

        // Product Type
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(100, 116, 139);
        doc.text((currentLanguage === 'es' ? 'Tipo de Producto:' : 'Product Type:'), margin, y);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(30, 41, 59);
        const typeText = allergenRinseOff
            ? (currentLanguage === 'es' ? 'Con aclarado (Rinse-off)' : 'Rinse-off')
            : (currentLanguage === 'es' ? 'Sin aclarado (Leave-on)' : 'Leave-on');
        doc.text(typeText, margin + 35, y);
        y += 10;

        doc.setDrawColor(226, 232, 240);
        doc.line(margin, y, pageW - margin, y);
        y += 8;

        // --- Fragrance Components Table ---
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(30, 41, 59);
        doc.text(currentLanguage === 'es' ? 'Composición de la Fragancia' : 'Fragrance Components', margin, y);
        y += 6;

        // Table Header
        doc.setFillColor(248, 250, 252);
        doc.rect(margin, y, contentW, 7, 'F');
        doc.setDrawColor(226, 232, 240);
        doc.line(margin, y, pageW - margin, y);
        doc.line(margin, y + 7, pageW - margin, y + 7);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(100, 116, 139);

        doc.text(currentLanguage === 'es' ? 'Componente' : 'Component', margin + 2, y + 5);
        doc.text(currentLanguage === 'es' ? 'Código de Producto' : 'Product Code', margin + 45, y + 5);
        doc.text(currentLanguage === 'es' ? 'Fecha Impresión' : 'Printing Date', margin + 95, y + 5);
        doc.text(currentLanguage === 'es' ? 'Dosis en Producto' : 'Dose in Product', margin + 140, y + 5);

        y += 7;

        let totalDose = 0;
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(51, 65, 85);

        perfumeComponents.forEach(comp => {
            const hasFile = !!comp.fileName;
            let splitFn = [];
            let extraHeight = 0;
            if (hasFile) {
                doc.setFont('helvetica', 'italic');
                doc.setFontSize(7);
                splitFn = doc.splitTextToSize(comp.fileName, 40); // wrap to 40mm
                extraHeight = (splitFn.length - 1) * 3; // each extra line is 3mm
            }

            const rowHeight = hasFile ? (11 + extraHeight) : 7;
            checkPage(rowHeight + 5);
            totalDose += (comp.dosePercent || 0);

            if (hasFile) {
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(8.5);
                doc.setTextColor(51, 65, 85);
                doc.text(comp.title || '—', margin + 2, y + 4.5);

                doc.setFont('helvetica', 'italic');
                doc.setFontSize(7);
                doc.setTextColor(100, 116, 139);
                doc.text(splitFn, margin + 2, y + 8.5);
            } else {
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(8.5);
                doc.setTextColor(51, 65, 85);
                doc.text(comp.title || '—', margin + 2, y + 5);
            }

            // Restore font/color for the other columns
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8.5);
            doc.setTextColor(51, 65, 85);

            const otherY = y + (hasFile ? (6 + extraHeight / 2) : 5);
            doc.text(comp.productCode || '—', margin + 45, otherY);
            doc.text(comp.printingDate || '—', margin + 95, otherY);
            doc.text((comp.dosePercent || 0).toFixed(4).replace(/\.?0+$/, '') + '%', margin + 140, otherY);

            y += rowHeight;
            doc.line(margin, y, pageW - margin, y);
        });

        // Add Total Row
        checkPage(10);
        doc.setFillColor(248, 250, 252);
        doc.rect(margin, y, contentW, 7, 'F');
        doc.setFont('helvetica', 'bold');
        doc.text(currentLanguage === 'es' ? 'DOSIS TOTAL DE PERFUME' : 'TOTAL PERFUME DOSAGE', margin + 2, y + 5);
        doc.text(totalDose.toFixed(4).replace(/\.?0+$/, '') + '%', margin + 140, y + 5);
        y += 7;
        doc.line(margin, y, pageW - margin, y);
        y += 10;

        // --- Compliance Summary ---
        checkPage(30);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(30, 41, 59);
        doc.text(currentLanguage === 'es' ? 'Resumen de Cumplimiento' : 'Compliance Summary', margin, y);
        y += 6;

        const threshold = allergenRinseOff ? 0.01 : 0.001;

        doc.setFillColor(248, 250, 252);
        doc.rect(margin, y, contentW, 20, 'F');
        doc.setDrawColor(226, 232, 240);
        doc.rect(margin, y, contentW, 20, 'D');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(100, 116, 139);
        doc.text(currentLanguage === 'es' ? 'Límite de declaración aplicado:' : 'Declaration limit applied:', margin + 4, y + 6);
        doc.text(currentLanguage === 'es' ? 'Dosis máxima de perfume sin etiquetado de alérgenos:' : 'Maximum dosage of perfume without allergen labelling:', margin + 4, y + 14);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(30, 41, 59);
        doc.text(threshold + '%', margin + 52, y + 6);

        // Max safe dose calculations
        let maxPerfumeDosage = null;
        if (totalDose > 0) {
            let minLimit = Infinity;
            allergens.forEach(item => {
                const normInci = normalizeIngredient(item.INCI);
                let productConc = 0;
                perfumeComponents.forEach(comp => {
                    const compConc = comp.concentrations[normInci] !== undefined ? comp.concentrations[normInci] : 0;
                    productConc += compConc * ((comp.dosePercent || 0) / 100);
                });

                if (productConc > 0) {
                    const limit = (threshold * totalDose) / productConc;
                    if (limit < minLimit) {
                        minLimit = limit;
                    }
                }
            });
            if (minLimit !== Infinity) {
                maxPerfumeDosage = minLimit;
            }
        }

        const maxDoseFormatted = maxPerfumeDosage === null
            ? (currentLanguage === 'es' ? 'Sin límite' : 'No limit')
            : maxPerfumeDosage.toFixed(4).replace(/\.?0+$/, '') + '%';

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(59, 130, 246); // Primary accent
        doc.text(maxDoseFormatted, margin + 100, y + 14);
        y += 26;

        // --- Declared Allergens Table ---
        checkPage(20);

        const productAllergens = [];
        allergens.forEach(item => {
            const normInci = normalizeIngredient(item.INCI);
            let productConc = 0;
            perfumeComponents.forEach(comp => {
                const compConc = comp.concentrations[normInci] !== undefined ? comp.concentrations[normInci] : 0;
                productConc += compConc * ((comp.dosePercent || 0) / 100);
            });
            if (productConc > threshold) {
                productAllergens.push({
                    inci: item.INCI,
                    concentration: productConc
                });
            }
        });

        const highConc = productAllergens.filter(a => a.concentration >= 1.0);
        const lowConc = productAllergens.filter(a => a.concentration < 1.0);
        highConc.sort((a, b) => b.concentration - a.concentration);
        if (allergenSortAlphabeticalBelowOne) {
            lowConc.sort((a, b) => a.inci.localeCompare(b.inci));
        } else {
            lowConc.sort((a, b) => b.concentration - a.concentration);
        }
        const declaredList = [...highConc, ...lowConc];

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(30, 41, 59);
        const titleText = currentLanguage === 'es'
            ? `Alérgenos a Declarar en Etiqueta (Total: ${declaredList.length})`
            : `Allergens to Declare on Label (Total: ${declaredList.length})`;
        doc.text(titleText, margin, y);
        y += 6;

        if (declaredList.length === 0) {
            doc.setFillColor(240, 253, 244); // light green bg
            doc.setDrawColor(187, 247, 208); // light green border
            doc.rect(margin, y, contentW, 10, 'FD');
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(9);
            doc.setTextColor(22, 101, 52); // green text
            doc.text(currentLanguage === 'es' ? 'No hay alérgenos que declarar en la etiqueta.' : 'No allergens to declare on the label.', margin + 4, y + 6.5);
            y += 15;
        } else {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9.5);
            doc.setTextColor(51, 65, 85);

            const allergensString = declaredList.map(item => item.inci).join(', ');
            const splitAllergens = doc.splitTextToSize(allergensString, contentW - 10);

            const lineHeight = 5;
            const neededHeight = splitAllergens.length * lineHeight + 8; // add padding

            checkPage(neededHeight);

            // Draw a subtle box around the list
            doc.setFillColor(248, 250, 252);
            doc.setDrawColor(226, 232, 240);
            doc.rect(margin, y, contentW, neededHeight, 'FD');

            doc.text(splitAllergens, margin + 5, y + 6);
            y += neededHeight + 5;
        }

        const filename = (allergenProductName || 'allergen').toLowerCase().replace(/[^a-z0-9]/g, '-') + '-analysis-report.pdf';
        doc.save(filename);
    }

    // Helper functions
    function addComponentColumn() {
        const nextId = String.fromCharCode(65 + perfumeComponents.length); // A, B, C...
        perfumeComponents.push({
            id: nextId,
            title: `COMPONENT ${nextId}`,
            fileName: '',
            dosePercent: 0,
            productCode: '',
            printingDate: '',
            extraIncis: [],
            concentrations: {},
            isLoading: false
        });
        renderAllergenTable();
    }

    function deleteComponentColumn(idx) {
        if (idx === 0) return; // Cannot delete first column
        perfumeComponents.splice(idx, 1);

        // Re-index titles (COMPONENT A, B, C...)
        perfumeComponents.forEach((comp, i) => {
            const id = String.fromCharCode(65 + i);
            comp.id = id;
            comp.title = `COMPONENT ${id}`;
        });

        renderAllergenTable();
    }

    async function processComponentPdf(file, componentIndex) {
        const apiKey = apiKeyInput.value.trim();
        if (!apiKey) {
            alert(translations[currentLanguage].api_key_label || "Please enter an API Key first.");
            return;
        }

        const comp = perfumeComponents[componentIndex];
        comp.isLoading = true;
        comp.fileName = file.name;
        renderAllergenTable();

        try {
            const { text } = await parsePdfText(file);
            const inciList = (typeof allergens !== 'undefined') ? allergens.map(a => a.INCI).join(', ') : '';
            const prompt = translations[currentLanguage].allergen_prompt.replace('{inci_list}', inciList);

            let resultText;
            if (text.trim().length > 150) {
                resultText = await fetchAiTextExtraction(apiKey, text, prompt);
            } else {
                const images = await renderPdfToImages(file);
                resultText = await fetchAiExtraction(apiKey, images, prompt);
            }

            resultText = resultText.replace(/\*/g, '');
            const result = extractJsonSafely(resultText);

            console.log(`AI Result for Component ${comp.id}:`, result);

            comp.productCode = result.product_code || '';
            const rawDate = result.printing_date || '';
            comp.printingDate = rawDate.replace(/\./g, '-');

            // Store concentrations
            comp.concentrations = {};
            if (result.allergens && Array.isArray(result.allergens)) {
                result.allergens.forEach(a => {
                    const name = a.inci || a.name || "";
                    const normInci = normalizeIngredient(name);
                    if (normInci) {
                        const p = parseConcentration(a.percentage);
                        comp.concentrations[normInci] = p;
                    }
                });
            }

            // Store extra INCIs
            comp.extraIncis = [];
            if (result.extra_incis && Array.isArray(result.extra_incis)) {
                comp.extraIncis = result.extra_incis.filter(a => {
                    const p = parseConcentration(a.percentage);
                    return p > 0;
                }).map(a => {
                    return {
                        inci: a.inci || a.name || '',
                        percentage: parseConcentration(a.percentage)
                    };
                });
            }

        } catch (e) {
            console.error("AI Error:", e);
            alert("Error processing PDF: " + e.message);
        } finally {
            comp.isLoading = false;
            renderAllergenTable();
        }
    }

    function copyComponentColumn(idx, buttonEl) {
        const comp = perfumeComponents[idx];
        const identifier = `${comp.productCode}_${comp.printingDate}`;
        const values = allergens.map(item => {
            const normInci = normalizeIngredient(item.INCI);
            const val = comp.concentrations[normInci] !== undefined ? comp.concentrations[normInci] : 0;
            return String(val).replace(/\./g, ',');
        });
        const clipboardText = [identifier, ...values].join('\t');

        navigator.clipboard.writeText(clipboardText).then(() => {
            const tooltip = buttonEl.querySelector('svg');
            const originalColor = buttonEl.style.color;
            buttonEl.style.color = 'var(--success)';
            setTimeout(() => {
                buttonEl.style.color = originalColor;
            }, 1500);
        }).catch(err => {
            console.error('Failed to copy: ', err);
            alert("Failed to copy to clipboard");
        });
    }

    // Call dynamic render on start
    renderAllergenTable();

    if (copyConcentrationsBtn) {
        copyConcentrationsBtn.addEventListener('click', () => {
            // Copy all columns as a tab-separated spreadsheet format
            const headerRow = ['INCI', ...perfumeComponents.map(c => `${c.title} (${c.productCode || '—'} - ${c.printingDate || '—'})`)];
            const rows = allergens.map(item => {
                const normInci = normalizeIngredient(item.INCI);
                const values = perfumeComponents.map(c => {
                    const val = c.concentrations[normInci] !== undefined ? c.concentrations[normInci] : 0;
                    return String(val).replace(/\./g, ',');
                });
                return [item.INCI, ...values];
            });

            const clipboardText = [headerRow, ...rows].map(r => r.join('\t')).join('\n');

            navigator.clipboard.writeText(clipboardText).then(() => {
                const originalText = copyConcentrationsBtn.querySelector('[data-i18n]').textContent;
                const successText = translations[currentLanguage].concentrations_copied || "Copied!";
                const span = copyConcentrationsBtn.querySelector('[data-i18n]');

                span.textContent = successText;
                copyConcentrationsBtn.classList.add('success');

                setTimeout(() => {
                    span.textContent = originalText;
                    copyConcentrationsBtn.classList.remove('success');
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy: ', err);
                alert("Failed to copy to clipboard");
            });
        });
    }


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
        originalLabelBase64 = null;
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

    async function renderPdfToImage(file, maxPages = 10) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const pageCount = Math.min(pdf.numPages, maxPages);

        if (pageCount === 1) {
            const page = await pdf.getPage(1);
            const viewport = page.getViewport({ scale: 2.0 });
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            await page.render({ canvasContext: ctx, viewport: viewport }).promise;
            return canvas.toDataURL('image/jpeg', 0.8);
        } else {
            // Render multiple pages and stitch them vertically
            const pageData = [];
            let totalHeight = 0;
            let maxWidth = 0;

            for (let i = 1; i <= pageCount; i++) {
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale: 1.5 }); // Slightly lower scale for multi-page to avoid memory issues
                pageData.push({ page, viewport });
                totalHeight += viewport.height;
                maxWidth = Math.max(maxWidth, viewport.width);
            }

            const canvas = document.createElement('canvas');
            canvas.width = maxWidth;
            canvas.height = totalHeight;
            const ctx = canvas.getContext('2d');

            let currentY = 0;
            for (const item of pageData) {
                const pageCanvas = document.createElement('canvas');
                pageCanvas.width = item.viewport.width;
                pageCanvas.height = item.viewport.height;
                const pageCtx = pageCanvas.getContext('2d');
                await item.page.render({ canvasContext: pageCtx, viewport: item.viewport }).promise;

                ctx.drawImage(pageCanvas, (maxWidth - item.viewport.width) / 2, currentY);
                currentY += item.viewport.height;
            }
            return canvas.toDataURL('image/jpeg', 0.7);
        }
    }

    async function renderPdfToImages(file, maxPages = 10) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const pageCount = Math.min(pdf.numPages, maxPages);
        const images = [];

        for (let i = 1; i <= pageCount; i++) {
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale: 2.0 });
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            await page.render({ canvasContext: ctx, viewport: viewport }).promise;
            images.push(canvas.toDataURL('image/jpeg', 0.8));
        }
        return images;
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
        const key = apiKeyInput.value.trim();
        const hasKey = key.length > 0;
        extractBtn.disabled = !(hasKey && templatePdfText && labelBase64);
        updateModelDisplay(key);
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
        // Remove non-alphanumeric characters and lowercase for better matching
        return str.toLowerCase().replace(/[^a-z0-9]/g, '').trim();
    }

    function parseConcentration(val) {
        if (val === undefined || val === null) return 0;
        if (typeof val === 'number') return val;

        let s = String(val).trim();
        if (!s) return 0;

        // Replace all commas with dots for parsing (global replacement)
        s = s.replace(/,/g, '.');

        // Check for ranges like "0.01 - 0.05", "0.01 to 0.05", "0.01-0.05", "0.01/0.05"
        // Also matches "0.05 max" or similar if we wanted, but let's focus on ranges
        const rangeMatch = s.match(/([\d.]+)\s*[-–—/to]+\s*([\d.]+)/i);
        if (rangeMatch) {
            const v1 = parseFloat(rangeMatch[1]);
            const v2 = parseFloat(rangeMatch[2]);
            if (!isNaN(v1) && !isNaN(v2)) {
                return Math.max(v1, v2);
            }
        }

        const p = parseFloat(s);
        return isNaN(p) ? 0 : p;
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

    async function fetchAiExtraction(apiKey, imageBase64OrArray, prompt, maxRetries = 3) {
        const images = Array.isArray(imageBase64OrArray) ? imageBase64OrArray : [imageBase64OrArray];
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
            aiModel = 'gpt-4o-mini';
        }

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                if (isMistralFormat) {
                    // Mistral OCR processes the entire document. If it's a list of images, we'll combine them for Mistral
                    // since its OCR endpoint usually expects a single document/image.
                    let targetImage = images[0];
                    if (images.length > 1) {
                        console.log("Stitching images for Mistral OCR...");
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        const loadedImages = await Promise.all(images.map(src => {
                            return new Promise(resolve => {
                                const img = new Image();
                                img.onload = () => resolve(img);
                                img.src = src;
                            });
                        }));

                        canvas.width = Math.max(...loadedImages.map(img => img.width));
                        canvas.height = loadedImages.reduce((sum, img) => sum + img.height, 0);
                        let currentY = 0;
                        loadedImages.forEach(img => {
                            ctx.drawImage(img, (canvas.width - img.width) / 2, currentY);
                            currentY += img.height;
                        });
                        targetImage = canvas.toDataURL('image/jpeg', 0.7);
                    }

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
                                document_url: targetImage
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
                let headers = { 'Content-Type': 'application/json' };

                if (isGeminiFormat) {
                    const parts = [{ text: prompt }];
                    images.forEach(img => {
                        const base64Data = img.split(',')[1];
                        const mimeType = img.split(';')[0].split(':')[1];
                        parts.push({
                            inline_data: {
                                mime_type: mimeType || 'image/jpeg',
                                data: base64Data
                            }
                        });
                    });

                    payload = {
                        contents: [{ parts }],
                        generationConfig: { responseMimeType: "application/json" }
                    };
                } else if (isAnthropicFormat) {
                    headers['x-api-key'] = apiKey;
                    headers['anthropic-version'] = '2023-06-01';
                    headers['anthropic-dangerous-direct-browser-access'] = 'true';

                    const content = [];
                    images.forEach(img => {
                        const base64Data = img.split(',')[1];
                        const mimeType = img.split(';')[0].split(':')[1];
                        content.push({
                            type: "image",
                            source: {
                                type: "base64",
                                media_type: mimeType || 'image/jpeg',
                                data: base64Data
                            }
                        });
                    });
                    content.push({ type: "text", text: prompt });

                    payload = {
                        model: aiModel,
                        max_tokens: 4096,
                        messages: [{ role: "user", content }]
                    };
                } else {
                    headers['Authorization'] = `Bearer ${apiKey}`;
                    headers['HTTP-Referer'] = window.location.href;
                    headers['X-Title'] = 'Ingredient Extractor';

                    const content = [{ type: "text", text: prompt }];
                    images.forEach(img => {
                        content.push({ type: "image_url", image_url: { url: img } });
                    });

                    payload = {
                        model: aiModel,
                        max_tokens: 4096,
                        messages: [{ role: "user", content }]
                    };

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

        setProcessingUI(true, translations[currentLanguage].ai_processing);
        resultSection.classList.add('hidden');
        document.getElementById('download-pdf-btn').style.display = 'none';
        validationStatus.innerHTML = '';
        validationResults.innerHTML = '';
        resultContent.textContent = '';

        try {
            const templatePrompt = translations[currentLanguage].template_prompt;
            const labelPrompt = translations[currentLanguage].label_prompt;

            let templateResponseText;
            if (templatePdfText.trim().length > 150) {
                templateResponseText = await fetchAiTextExtraction(apiKey, templatePdfText, templatePrompt);
            } else {
                console.log("Template is image-based, using Vision/OCR...");
                // Note: file is not directly available here, so we'd need to have pre-rendered or pass it.
                // However, since we're in the click handler and we only have templatePdfText,
                // we should have rendered it during upload.
                // Let's assume for now we use the text-based one OR we should have stored images.
                // To be robust, let's look for where we handle template upload.
                // Actually, I'll update the upload logic to store images if needed.
                if (window._templateImages) {
                    templateResponseText = await fetchAiExtraction(apiKey, window._templateImages, templatePrompt);
                } else {
                    // Fallback to text if images weren't captured (shouldn't happen with updated upload logic)
                    templateResponseText = await fetchAiTextExtraction(apiKey, templatePdfText, templatePrompt);
                }
            }

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

            templateMeta = {
                brand:   templateJson.brand   || '',
                project: templateJson.project || '',
                formula: templateJson.formula || '',
                test:    templateJson.test    || ''
            };

            templateItems = templateJson.ingredients.map(i => ({
                ...i,
                name: i.name.replace(/\*/g, '').trim()
            }));

            const labelItems = labelJson.ingredients.map(name => name.replace(/\*/g, '').trim());

            labelTextarea.value = labelItems.join(', ');
            updateIngredientsBackdrop(labelTextarea.value);

            initialTimeTaken = ((performance.now() - startTime) / 1000).toFixed(2);

            runValidation(labelItems);

            resultSection.classList.remove('hidden');
            resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

        } catch (error) {
            validationStatus.className = 'validation-status error';
            validationStatus.textContent = translations[currentLanguage].system_error.replace('{error}', error.message);
            validationResults.innerHTML = `<p style="color: var(--text-muted); text-align: center; padding: 1rem;">${translations[currentLanguage].verify_ai_data}</p>`;
            resultSection.classList.remove('hidden');
            console.error(error);
        } finally {
            setProcessingUI(false);
        }
    });

    function generatePdfReport(templateNodes, labelNodes, isSuccess, missing, unnecessary, misordered, meta, labelIngredientsText) {
        // Use jsPDF directly — no html2canvas / DOM capture needed, fully reliable
        var jsPDFClass = (window.jspdf && window.jspdf.jsPDF) || window.jsPDF;
        if (!jsPDFClass) { alert(translations[currentLanguage].error_pdf_lib); return Promise.resolve(); }

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
        doc.text(translations[currentLanguage].pdf_report_title, pageW / 2, y + 7, { align: 'center' });
        y += 12;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(100, 116, 139);
        const dateStr = translations[currentLanguage].pdf_generated_on + ' ' + new Date().toLocaleString(currentLanguage === 'es' ? 'es-ES' : 'en-US');
        doc.text(dateStr, pageW / 2, y, { align: 'center' });
        y += 7;

        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.3);
        doc.line(margin, y, pageW - margin, y);
        y += 7;

        // --- Metadata fields ---
        var metaFields = [
            { label: translations[currentLanguage].pdf_brand,    value: meta.brand },
            { label: translations[currentLanguage].pdf_project,  value: meta.project },
            { label: translations[currentLanguage].pdf_formula,  value: meta.formula },
            { label: translations[currentLanguage].pdf_test,     value: meta.test }
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
        if (originalLabelBase64 && labelImagePreview && labelImagePreview.naturalWidth > 0) {
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(12);
            doc.setTextColor(30, 41, 59);
            doc.text(translations[currentLanguage].roi_instructions ? translations[currentLanguage].pdf_label_img : "Product Label Image", margin, y);
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
            if (originalLabelBase64.startsWith('data:image/png')) imgFormat = 'PNG';
            else if (originalLabelBase64.startsWith('data:image/webp')) imgFormat = 'WEBP';

            try {
                doc.addImage(originalLabelBase64, imgFormat, margin + (contentW - imgW) / 2, y, imgW, imgH);
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
        doc.text(translations[currentLanguage].pdf_ingredients_found, margin, y);
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
        doc.text(translations[currentLanguage].pdf_ingredients_template, margin, y);
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
        doc.text(translations[currentLanguage].pdf_mapping_diagram, pageW / 2, y + 6, { align: 'center' });
        y += 12;

        var diagRowH = 5.2; // Compact row height
        var diagBoxH = 4.2;
        var colW = 65;
        var tColX = margin + 12;
        var lColX = pageW - margin - colW;

        // Headers for columns
        doc.setFontSize(9);
        doc.setTextColor(100, 116, 139);
        doc.text(translations[currentLanguage].template_col_header.toUpperCase(), tColX + colW/2, y, { align: 'center' });
        doc.text(translations[currentLanguage].label_col_header.toUpperCase(), lColX + colW/2, y, { align: 'center' });

        doc.setFontSize(6.5);
        doc.text(translations[currentLanguage].pdf_concentration, tColX - 6, y - 1.5, { align: 'center' });
        doc.text(translations[currentLanguage].pdf_range, tColX - 6, y + 1.5, { align: 'center' });

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
        doc.text(translations[currentLanguage].pdf_validation_results, margin, y);
        y += 7;

        if (isSuccess) {
            checkPage(12);
            doc.setFillColor(220, 252, 231);
            doc.setDrawColor(134, 239, 172);
            doc.roundedRect(margin, y, contentW, 10, 2, 2, 'FD');
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(10);
            doc.setTextColor(22, 101, 52);
            doc.text(translations[currentLanguage].pdf_success_msg, margin + 3, y + 6.5);
            y += 14;
        } else {
            checkPage(12);
            doc.setFillColor(254, 226, 226);
            doc.setDrawColor(252, 165, 165);
            doc.roundedRect(margin, y, contentW, 10, 2, 2, 'FD');
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(10);
            doc.setTextColor(153, 27, 27);
            doc.text(translations[currentLanguage].pdf_fail_msg, margin + 3, y + 6.5);
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

            renderList(translations[currentLanguage].missing_ingredients, missing, 234, 88, 12);
            renderList(translations[currentLanguage].unnecessary_ingredients, unnecessary, 244, 63, 94);
            renderList(translations[currentLanguage].misordered_ingredients, misordered, 59, 130, 246);
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

    // Browser Translation Detection
    const initTranslationDetection = () => {
        const target = document.documentElement;
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes') {
                    const { attributeName } = mutation;
                    const classList = target.classList;

                    // Check for Google Translate classes or lang attribute changes
                    const isGoogleTranslated = classList.contains('translated-ltr') || classList.contains('translated-rtl');
                    const isLangChanged = attributeName === 'lang' && target.getAttribute('lang') !== currentLanguage;
                    const isEdgeTranslated = target.hasAttribute('_msttexthash') || target.hasAttribute('_msthash');

                    if (isGoogleTranslated || isLangChanged || isEdgeTranslated) {
                        console.warn('Automatic translation detected. This may interfere with literal ingredient extraction.');
                        // We could show a UI warning here if needed
                    }
                }
            });
        });

        observer.observe(target, { attributes: true });
    };
    initTranslationDetection();

    switchTab('home');
});
