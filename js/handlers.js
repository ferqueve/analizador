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
    document.getElementById('addSkill').addEventListener('click', handleAddSkill);

    // Submit del formulario de llamado
    elements.jobForm.addEventListener('submit', handleJobSubmit);

    // Submit del formulario de CV
    document.getElementById('cvForm').addEventListener('submit', handleCVSubmit);
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
    const skill = elements.skillInput.value.trim().toLowerCase();
    if (skill && !window.skills.has(skill)) {
        window.skills.add(skill);
        updateSkillsList();
        elements.skillInput.value = '';
    }
}

function handleJobSubmit(e) {
    e.preventDefault();
    
    window.currentJob = {
        company: document.getElementById('company').value,
        description: document.getElementById('description').value,
        skills: Array.from(window.skills),
        createdAt: new Date().toLocaleString()
    };

    // Deshabilitar campos
    disableJobFields();
    showJobStatus();
}

function handleCVSubmit(e) {
    e.preventDefault();
    
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
