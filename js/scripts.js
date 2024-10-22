     // Inicializar PDF.js
     pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

     let skills = new Set();
     let currentJob = null;

     // Manejo de aptitudes
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

     // Función para convertir el archivo PDF a texto y analizar imágenes
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

     // Análisis de CVs
     document.getElementById('cvForm').addEventListener('submit', async (e) => {
         e.preventDefault();
         
         if (!currentJob) {
             alert('Por favor, primero cree un llamado');
             return;
         }

         const loadingOverlay = document.getElementById('loadingOverlay');
         loadingOverlay.classList.remove('d-none');

         const files = document.getElementById('cvFile').files;
         const cvResults = [];

         try {
             for (let file of files) {
                 const { text, hasImages } = await analyzePDF(file);
                 const matchPercentage = analyzeCV(text, currentJob.skills);
                 cvResults.push({
                     name: file.name,
                     percentage: matchPercentage,
                     hasPhoto: hasImages
                 });
             }

             // Ordenar y mostrar los 5 mejores resultados
             displayResults(cvResults.sort((a, b) => b.percentage - a.percentage).slice(0, 5));
         } catch (error) {
             console.error('Error al analizar PDFs:', error);
             alert('Error al analizar los archivos PDF');
         } finally {
             loadingOverlay.classList.add('d-none');
         }
     });

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
             
             const canvas = document.createElement('canvas');
             canvas.id = `chart${index}`;

             col.innerHTML = `
                 <div class="card h-100">
                     <div class="card-body text-center">
                         <h5 class="card-title">${result.name}</h5>
                         <div class="position-relative mb-3">
                             <canvas id="chart${index}"></canvas>
                             <div class="position-absolute top-0 end-0">
                                 <span class="badge ${result.hasPhoto ? 'bg-success' : 'bg-secondary'}" 
                                       title="${result.hasPhoto ? 'Contiene imagen' : 'No contiene imagen'}">
                                     <i class="fas ${result.hasPhoto ? 'fa-camera' : 'fa-camera-slash'}"></i>
                                 </span>
                             </div>
                         </div>
                         <p class="card-text">
                             Coincidencia: ${result.percentage.toFixed(1)}%
                         </p>
                     </div>
                 </div>
             `;

             resultsDiv.appendChild(col);

             // Crear gráfico de anillo
             new Chart(canvas, {
                 type: 'doughnut',
                 data: {
                     labels: ['Coincidencia', 'No coincide'],
                     datasets: [{
                         data: [result.percentage, 100 - result.percentage],
                         backgroundColor: ['#28a745', '#e9ecef']
                     }]
                 },
                 options: {
                     cutout: '70%',
                     plugins: {
                         legend: {
                             display: false
                         }
                     }
                 }
             });
         });
     }