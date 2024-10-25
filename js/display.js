function displayResults(results) {
    elements.resultsDiv.innerHTML = '';

    // Cabecera de resultados
    appendResultsHeader(results.length);

    // Mostrar cada resultado
    results.forEach((result, index) => {
        const col = document.createElement('div');
        col.className = 'col-md-4 mb-4';
        
        const rankingInfo = getRankingStyle(index);
        col.innerHTML = createResultCard(result, rankingInfo, index);
        elements.resultsDiv.appendChild(col);

        // Crear gráfico
        setTimeout(() => createResultChart(result, index), 0);
    });
}

function appendResultsHeader(resultCount) {
    const headerDiv = document.createElement('div');
    headerDiv.className = 'col-12 mb-4';
    headerDiv.innerHTML = `
        <div class="alert alert-info">
            <h5 class="alert-heading mb-0">
                <i class="fas fa-trophy me-2"></i>
                Top ${resultCount} Mejores Coincidencias 
                (de ${window.selectedFiles.size} currículums analizados)
            </h5>
        </div>
    `;
    elements.resultsDiv.appendChild(headerDiv);
}

function getRankingStyle(index) {
    const styles = [
        { style: 'bg-warning text-dark', icon: '🥇' },
        { style: 'bg-light text-dark', icon: '🥈' },
        { style: 'bg-copper text-dark', icon: '🥉' },
        { style: 'bg-light text-muted', icon: `#${index + 1}` },
        { style: 'bg-light text-muted', icon: `#${index + 1}` }
    ];
    return styles[index] || styles[3];
}

function createResultCard(result, rankingInfo, index) {
    return `
        <div class="card h-100 position-relative">
            <div class="position-absolute top-0 start-0 p-2">
                <span class="badge ${rankingInfo.style}">
                    ${rankingInfo.icon} Puesto ${index + 1}
                </span>
            </div>
            <div class="card-body text-center">
                <h5 class="card-title text-truncate" title="${result.name}">
                    ${result.name}
                </h5>
                <div class="position-relative mb-3" style="height: 200px;">
                    <canvas id="chart${index}"></canvas>
                    <div class="position-absolute top-0 end-0">
                        <span class="badge ${result.hasPhoto ? 'bg-success' : 'bg-secondary'}" 
                              title="${result.hasPhoto ? 'Contiene imagen' : 'No contiene imagen'}">
                            <i class="fas ${result.hasPhoto ? 'fa-camera' : 'fa-camera-slash'}"></i>
                        </span>
                    </div>
                </div>
                <div class="card-text">
                    <div class="h4 mb-0 ${getMatchColor(result.percentage)}">
                        ${result.percentage.toFixed(1)}%
                    </div>
                    <small class="text-muted">coincidencia</small>
                </div>
            </div>
        </div>
    `;
}

function createResultChart(result, index) {
    const ctx = document.getElementById(`chart${index}`).getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Coincidencia', 'No coincide'],
            datasets: [{
                data: [result.percentage, 100 - result.percentage],
                backgroundColor: [getChartColor(result.percentage), '#e9ecef'],
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
}

function getMatchColor(percentage) {
    if (percentage >= 90) return 'text-success';
    if (percentage >= 70) return 'text-primary';
    if (percentage >= 50) return 'text-warning';
    return 'text-danger';
}

function getChartColor(percentage) {
    if (percentage >= 90) return '#28a745';
    if (percentage >= 70) return '#0d6efd';
    if (percentage >= 50) return '#ffc107';
    return '#dc3545';
}

// Funciones de UI auxiliares
function updateFileList() {
    elements.fileCounter.textContent = window.selectedFiles.size;
    elements.analyzeBtn.disabled = window.selectedFiles.size === 0;
}

function showFilesPreview() {
    let fileList = document.getElementById('fileList');
    if (!fileList) {
        fileList = document.createElement('div');
        fileList.id = 'fileList';
        fileList.className = 'mt-3';
        elements.dropZone.insertAdjacentElement('afterend', fileList);
    }

    fileList.innerHTML = window.selectedFiles.size > 0 ? 
        '<h6 class="mb-2">Archivos seleccionados:</h6>' : '';
    
    window.selectedFiles.forEach(file => {
        fileList.appendChild(createFileItem(file));
    });
}

function createFileItem(file) {
    const fileItem = document.createElement('div');
    fileItem.className = 'alert alert-secondary d-flex justify-content-between align-items-center mb-2';
    fileItem.innerHTML = `
        <div>
            <i class="fas fa-file-pdf text-danger me-2"></i>
            ${file.name}
        </div>
        <button type="button" class="btn-close" 
            onclick="removeFile('${file.name}')" 
            aria-label="Eliminar archivo"></button>
    `;
    return fileItem;
}
