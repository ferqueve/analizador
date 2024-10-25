async function processCVs() {
    elements.resultsDiv.innerHTML = `
        <div class="col-12 text-center py-4">
            <div class="spinner-border text-primary mb-3"></div>
            <p>Analizando ${window.selectedFiles.size} archivo${window.selectedFiles.size !== 1 ? 's' : ''}...</p>
        </div>
    `;

    try {
        const cvResults = [];
        let processed = 0;

        for (const file of window.selectedFiles) {
            try {
                const result = await analyzePDF(file);
                const matchPercentage = analyzeCV(result.text, window.currentJob.skills);
                cvResults.push({
                    name: file.name,
                    percentage: matchPercentage,
                    hasPhoto: result.hasImages
                });
                
                processed++;
                updateProgress(processed, window.selectedFiles.size);
            } catch (error) {
                console.error(`Error al analizar ${file.name}:`, error);
            }
        }

        // Mostrar los 5 mejores resultados
        displayResults(cvResults.sort((a, b) => b.percentage - a.percentage).slice(0, 5));
        
        // Limpiar archivos después del análisis
        cleanupAfterAnalysis();
        
    } catch (error) {
        console.error('Error en el análisis:', error);
        showAnalysisError();
    }
}

async function analyzePDF(file) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let text = '';
    let hasImages = false;

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        
        // Extraer texto
        const textContent = await page.getTextContent();
        text += textContent.items.map(item => item.str).join(' ');

        // Buscar imágenes
        const operatorList = await page.getOperatorList();
        for (let j = 0; j < operatorList.fnArray.length; j++) {
            if (operatorList.fnArray[j] === pdfjsLib.OPS.paintJpegXObject ||
                operatorList.fnArray[j] === pdfjsLib.OPS.paintImageXObject) {
                hasImages = true;
                break;
            }
        }
    }

    return { text, hasImages };
}

function analyzeCV(text, requiredSkills) {
    text = text.toLowerCase();
    const matchedSkills = requiredSkills.filter(skill => text.includes(skill.toLowerCase()));
    return (matchedSkills.length / requiredSkills.length) * 100;
}

function updateProgress(current, total) {
    const percentage = Math.round((current / total) * 100);
    elements.resultsDiv.innerHTML = `
        <div class="col-12 text-center py-4">
            <div class="progress mb-3" style="height: 20px;">
                <div class="progress-bar progress-bar-striped progress-bar-animated" 
                     role="progressbar" 
                     style="width: ${percentage}%">
                    ${percentage}%
                </div>
            </div>
            <p>Procesando archivo ${current} de ${total}...</p>
        </div>
    `;
}

function cleanupAfterAnalysis() {
    window.selectedFiles.clear();
    elements.fileInput.value = '';
    updateFileList();
    showFilesPreview();
}

function showAnalysisError() {
    elements.resultsDiv.innerHTML = `
        <div class="col-12">
            <div class="alert alert-danger">
                Error al analizar los archivos. Por favor, intente nuevamente.
            </div>
        </div>
    `;
}
