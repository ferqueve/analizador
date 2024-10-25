function initializeEventHandlers() {
    // Event listeners para drag & drop
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        elements.dropZone.addEventListener(eventName, preventDefaults);
        document.body.addEventListener(eventName, preventDefaults);
    });

    // Efectos visuales para drag & drop
    elements.dropZone.addEventListener('dragenter', () => elements.dropZone.classList.add('dragover'));
    elements.dropZone.addEventListener('dragover', () => elements.dropZone.classList.add('dragover'));
    elements.dropZone.addEventListener('dragleave', () => elements.dropZone.classList.remove('dragover'));
    elements.dropZone.addEventListener('drop', handleDrop);

    // Click en dropZone
    elements.dropZone.addEventListener('click', () => elements.fileInput.click());

    // Cambio en input file
    elements.fileInput.addEventListener('change', handleFileSelect);

    // Manejo de skills
    const addSkillButton = document.getElementById('addSkill');
    const skillInput = document.getElementById('skillInput');
    
    if (addSkillButton && skillInput) {
        addSkillButton.addEventListener('click', handleAddSkill);
        
        // Agregar aptitud al presionar Enter
        skillInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleAddSkill();
            }
        });
    }

    // Submit del formulario de llamado
    if (elements.jobForm) {
        elements.jobForm.addEventListener('submit', handleJobSubmit);
    }

    // Botón de analizar CVs
    const analyzeButton = document.getElementById('analyzeBtn');
    if (analyzeButton) {
        analyzeButton.addEventListener('click', handleCVSubmit);
    }
}

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function handleDrop(e) {
    elements.dropZone.classList.remove('dragover');
    const files = Array.from(e.dataTransfer.files).filter(file => file.type === 'application/pdf');
    if (files.length > 0) {
        handleFiles(files);
    }
}

function handleFileSelect(e) {
    const files = Array.from(e.target.files).filter(file => file.type === 'application/pdf');
    if (files.length > 0) {
        handleFiles(files);
    }
}

function handleFiles(files) {
    files.forEach(file => window.selectedFiles.add(file));
    updateFileList();
    showFilesPreview();
}

function handleAddSkill() {
    const skillInput = document.getElementById('skillInput');
    const skill = skillInput.value.trim().toLowerCase();
    if (skill && !window.skills.has(skill)) {
        window.skills.add(skill);
        updateSkillsList();
        skillInput.value = '';
    }
}

function handleJobSubmit(e) {
    e.preventDefault();
    
    const company = document.getElementById('company').value.trim();
    const description = document.getElementById('description').value.trim();
    
    if (!company || !description || window.skills.size === 0) {
        alert('Por favor complete todos los campos y agregue al menos una aptitud.');
        return;
    }
    
    window.currentJob = {
        company: company,
        description: description,
        skills: Array.from(window.skills),
        createdAt: new Date().toLocaleString()
    };

    // Deshabilitar campos
    disableJobFields();
    showJobStatus();
}

function handleCVSubmit(e) {
    if (e) e.preventDefault();
    
    if (!window.currentJob) {
        alert('Por favor, primero cree un llamado');
        return;
    }

    if (window.selectedFiles.size === 0) {
        alert('Por favor, seleccione al menos un archivo PDF');
        return;
    }

    processCVs();
}