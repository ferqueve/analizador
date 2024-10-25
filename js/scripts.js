// Configuración de PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

// Variables globales
window.skills = new Set();
window.currentJob = null;
window.selectedFiles = new Set();

// Elementos del DOM principales
window.elements = {
    dropZone: document.getElementById('dropZone'),
    fileInput: document.getElementById('cvFile'),
    fileCounter: document.getElementById('fileCounter'),
    analyzeBtn: document.getElementById('analyzeBtn'),
    resultsDiv: document.getElementById('results'),
    jobForm: document.getElementById('jobForm'),
    skillInput: document.getElementById('skillInput'),
    skillsList: document.getElementById('skillsList')
};

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar el botón de nuevo llamado
    initNewJobButton();
    
    // Inicializar manejadores de eventos
    initializeEventHandlers();
    
    // Inicializar estilos dinámicos
    initializeStyles();
});

function initNewJobButton() {
    const newJobBtn = document.createElement('button');
    newJobBtn.type = 'button';
    newJobBtn.className = 'btn btn-outline-secondary me-2';
    newJobBtn.innerHTML = '<i class="fas fa-plus me-2"></i>Nuevo Llamado';
    newJobBtn.onclick = resetJobForm;
    elements.jobForm.querySelector('button[type="submit"]').insertAdjacentElement('beforebegin', newJobBtn);
}

function resetJobForm() {
    // Limpiar los campos del formulario
    document.getElementById('company').value = '';
    document.getElementById('description').value = '';
    
    // Limpiar las aptitudes
    window.skills.clear();
    updateSkillsList();
    
    // Resetear el trabajo actual
    window.currentJob = null;
    
    // Habilitar todos los campos
    document.getElementById('company').disabled = false;
    document.getElementById('description').disabled = false;
    document.getElementById('skillInput').disabled = false;
    document.getElementById('addSkill').disabled = false;
    
    // Limpiar cualquier mensaje de estado del trabajo
    const jobStatus = document.getElementById('jobStatus');
    if (jobStatus) {
        jobStatus.remove();
    }
    
    // Habilitar el botón de guardar
    const saveButton = elements.jobForm.querySelector('button[type="submit"]');
    if (saveButton) {
        saveButton.disabled = false;
    }
}

function updateSkillsList() {
    if (!elements.skillsList) return;
    
    elements.skillsList.innerHTML = '';
    window.skills.forEach(skill => {
        const badge = document.createElement('div');
        badge.className = 'badge bg-primary me-2 mb-2 p-2';
        badge.innerHTML = `
            ${skill}
            <button type="button" class="btn-close btn-close-white ms-2" 
                    onclick="removeSkill('${skill}')" 
                    aria-label="Eliminar aptitud"></button>
        `;
        elements.skillsList.appendChild(badge);
    });
    
    // Actualizar el contador de aptitudes
    const skillCount = document.querySelector('.skill-count');
    if (skillCount) {
        skillCount.textContent = window.skills.size;
    }
}

function initializeStyles() {
    // Agregar estilos para medallas y animaciones
    if (!document.getElementById('customStyles')) {
        const style = document.createElement('style');
        style.id = 'customStyles';
        style.textContent = `
            .bg-copper {
                background-color: #cd7f32;
            }
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            #results .col-md-4 {
                animation: fadeInUp 0.5s ease forwards;
                opacity: 0;
            }
            #results .col-md-4:nth-child(2) { animation-delay: 0.1s; }
            #results .col-md-4:nth-child(3) { animation-delay: 0.2s; }
            #results .col-md-4:nth-child(4) { animation-delay: 0.3s; }
            #results .col-md-4:nth-child(5) { animation-delay: 0.4s; }
        `;
        document.head.appendChild(style);
    }
}

// Funciones globales
window.removeSkill = function(skill) {
    window.skills.delete(skill);
    updateSkillsList();
};

window.removeFile = function(fileName) {
    window.selectedFiles = new Set(
        Array.from(window.selectedFiles).filter(file => file.name !== fileName)
    );
    updateFileList();
    showFilesPreview();
};

// Funciones auxiliares UI que podrían ser llamadas desde otros archivos
function disableJobFields() {
    document.getElementById('company').disabled = true;
    document.getElementById('description').disabled = true;
    document.getElementById('skillInput').disabled = true;
    document.getElementById('addSkill').disabled = true;
    elements.jobForm.querySelector('button[type="submit"]').disabled = true;
}

function showJobStatus() {
    const statusDiv = document.createElement('div');
    statusDiv.id = 'jobStatus';
    statusDiv.className = 'alert alert-success mt-3';
    statusDiv.innerHTML = `
        <h5 class="alert-heading">¡Llamado creado con éxito!</h5>
        <p class="mb-0">Puede proceder a subir y analizar los currículums.</p>
    `;
    elements.jobForm.appendChild(statusDiv);
}
