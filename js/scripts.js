// Configuración de PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

let skills = new Set();
let currentJob = null;
let selectedFiles = new Set();

// Elementos del DOM
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('cvFile');
const fileCounter = document.getElementById('fileCounter');
const analyzeBtn = document.getElementById('analyzeBtn');

// Hacer que el dropZone active el input file al hacer clic
dropZone.addEventListener('click', () => fileInput.click());

// Configurar zona de drop
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    
    const files = Array.from(e.dataTransfer.files).filter(file => file.type === 'application/pdf');
    handleFiles(files);
});

// Manejar selección de archivos tradicional
fileInput.addEventListener('change', (e) => {
    const files = Array.from(e.target.files).filter(file => file.type === 'application/pdf');
    handleFiles(files);
});
// Manipular archivos
function handleFiles(files) {
    if (files.length === 0) {
        alert('Por favor, selecciona archivos PDF');
        return;
    }

    // Limpiar archivos anteriores
    selectedFiles.clear();

    // Agregar nuevos archivos al Set y al input
    files.forEach(file => selectedFiles.add(file));
    
    // Crear un nuevo FileList a partir de los archivos seleccionados
    const dataTransfer = new DataTransfer();
    selectedFiles.forEach(file => {
        dataTransfer.items.add(file);
    });
    
    // Actualizar el input file con los archivos seleccionados
    fileInput.files = dataTransfer.files;
    
    // Actualizar contador y estado del botón
    updateFileList();
    
    // Mostrar feedback
    showFilesPreview();
}

function updateFileList() {
    const fileCount = selectedFiles.size;
    fileCounter.textContent = fileCount;
    analyzeBtn.disabled = fileCount === 0;

    // Actualizar texto del dropZone
    const dropZoneText = document.querySelector('#dropZoneText p.mb-0');
    if (fileCount > 0) {
        dropZoneText.innerHTML = `
            <strong>${fileCount} archivo${fileCount !== 1 ? 's' : ''} seleccionado${fileCount !== 1 ? 's' : ''}</strong>
            <br>
            <small class="text-muted">Haz clic en Analizar para procesar los archivos</small>
        `;
    } else {
        dropZoneText.textContent = 'Arrastra los PDFs aquí o haz clic para seleccionar';
    }
}

// Función para remover archivos
window.removeFile = function(fileName) {
    selectedFiles = new Set(Array.from(selectedFiles).filter(file => file.name !== fileName));
    
    // Actualizar el input file
    const dataTransfer = new DataTransfer();
    selectedFiles.forEach(file => {
        dataTransfer.items.add(file);
    });
    fileInput.files = dataTransfer.files;
    
    updateFileList();
    showFilesPreview();
}

// Análisis de CVs
document.getElementById('cvForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!currentJob) {
        alert('Por favor, primero cree un llamado');
        return;
    }

    if (selectedFiles.size === 0) {
        alert('Por favor, seleccione al menos un archivo PDF');
        return;
    }

    // Mostrar loading
    resultsDiv.innerHTML = `
        <div class="col-12 text-center py-4">
            <div class="spinner-border text-primary mb-3"></div>
            <p>Analizando ${selectedFiles.size} archivo${selectedFiles.size !== 1 ? 's' : ''}...</p>
        </div>
    `;

    try {
        const cvResults = [];
        let processed = 0;

        // Convertir Set a Array para iterar
        const filesArray = Array.from(selectedFiles);

        for (const file of filesArray) {
            try {
                console.log('Procesando archivo:', file.name); // Debug log
                const result = await analyzePDF(file);
                const matchPercentage = analyzeCV(result.text, currentJob.skills);
                cvResults.push({
                    name: file.name,
                    percentage: matchPercentage,
                    hasPhoto: result.hasImages
                });
                
                // Actualizar progreso
                processed++;
                updateProgress(processed, filesArray.length);
            } catch (error) {
                console.error(`Error al analizar ${file.name}:`, error);
            }
        }

        // Mostrar los 5 mejores resultados
        displayResults(cvResults.sort((a, b) => b.percentage - a.percentage).slice(0, 5));
        
        // Limpiar archivos después del análisis exitoso
        selectedFiles.clear();
        fileInput.value = ''; // Limpiar el input file
        updateFileList();
        showFilesPreview();
        
    } catch (error) {
        console.error('Error en el análisis:', error);
        resultsDiv.innerHTML = `
            <div class="col-12">
                <div class="alert alert-danger">
                    Error al analizar los archivos. Por favor, intente nuevamente.
                </div>
            </div>
        `;
    }
});
//---

// Manejo de skills
document.getElementById('addSkill').addEventListener('click', () => {
    const skillInput = document.getElementById('skillInput');
    const skill = skillInput.value.trim().toLowerCase();
    
    if (skill && !skills.has(skill)) {
        skills.add(skill);
        updateSkillsList();
        skillInput.value = '';
    }
});

function updateSkillsList() {
    const skillsList = document.getElementById('skillsList');
    skillsList.innerHTML = '';
    
    skills.forEach(skill => {
        const badge = document.createElement('span');
        badge.className = 'badge bg-primary d-flex align-items-center';
        badge.innerHTML = `
            ${skill}
            <i class="fas fa-times ms-2 cursor-pointer" onclick="removeSkill('${skill}')"></i>
        `;
        skillsList.appendChild(badge);
    });
}

function removeSkill(skill) {
    skills.delete(skill);
    updateSkillsList();
}

// Manejo del formulario de llamado
document.getElementById('jobForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    currentJob = {
        company: document.getElementById('company').value,
        description: document.getElementById('description').value,
        skills: Array.from(skills)
    };

    alert('Llamado guardado exitosamente');
});

// Análisis de CVs
document.getElementById('cvForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!currentJob) {
        alert('Por favor, primero cree un llamado');
        return;
    }

    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'text-center my-3';
    loadingDiv.innerHTML = `
        <div class="spinner-border text-primary" role="status"></div>
        <p class="mt-2">Analizando currículums...</p>
    `;
    document.getElementById('results').innerHTML = '';
    document.getElementById('results').appendChild(loadingDiv);

    try {
        const cvResults = [];
        for (const file of selectedFiles) {
            try {
                const result = await analyzePDF(file);
                const matchPercentage = analyzeCV(result.text, currentJob.skills);
                cvResults.push({
                    name: file.name,
                    percentage: matchPercentage,
                    hasPhoto: result.hasImages
                });
            } catch (error) {
                console.error(`Error al analizar ${file.name}:`, error);
            }
        }

        // Mostrar los 5 mejores resultados
        displayResults(cvResults.sort((a, b) => b.percentage - a.percentage).slice(0, 5));
    } catch (error) {
        console.error('Error en el análisis:', error);
        document.getElementById('results').innerHTML = `
            <div class="alert alert-danger">
                Error al analizar los archivos. Por favor, intente nuevamente.
            </div>
        `;
    }
});

async function analyzePDF(file) {
    try {
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
    } catch (error) {
        throw new Error(`Error al analizar PDF ${file.name}: ${error.message}`);
    }
}

function analyzeCV(text, requiredSkills) {
    text = text.toLowerCase();
    const matchedSkills = requiredSkills.filter(skill => text.includes(skill.toLowerCase()));
    return (matchedSkills.length / requiredSkills.length) * 100;
}

function displayResults(results) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    results.forEach((result, index) => {
        const col = document.createElement('div');
        col.className = 'col-md-4 mb-4';
        
        col.innerHTML = `
            <div class="card h-100">
                <div class="card-body text-center">
                    <h5 class="card-title">${result.name}</h5>
                    <div class="position-relative mb-3" style="height: 200px;">
                        <canvas id="chart${index}"></canvas>
                        <div class="position-absolute top-0 end-0">
                            <span class="badge ${result.hasPhoto ? 'bg-success' : 'bg-secondary'}" 
                                  title="${result.hasPhoto ? 'Contiene imagen' : 'No contiene imagen'}">
                                <i class="fas ${result.hasPhoto ? 'fa-camera' : 'fa-camera-slash'}"></i>
                            </span>
                        </div>
                    </div>
                    <p class="card-text">
                        <strong>Coincidencia: ${result.percentage.toFixed(1)}%</strong>
                    </p>
                </div>
            </div>
        `;

        resultsDiv.appendChild(col);

        // Crear gráfico después de que el elemento esté en el DOM
        setTimeout(() => {
            const ctx = document.getElementById(`chart${index}`).getContext('2d');
            new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Coincidencia', 'No coincide'],
                    datasets: [{
                        data: [result.percentage, 100 - result.percentage],
                        backgroundColor: ['#28a745', '#e9ecef'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '70%',
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return `${context.label}: ${context.raw.toFixed(1)}%`;
                                }
                            }
                        }
                    }
                }
            });
        }, 0);
    });
}