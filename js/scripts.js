!function(){pdfjsLib.GlobalWorkerOptions.workerSrc="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";let t=new Set,n=null;document.getElementById("addSkill").addEventListener("click",()=>{let n=document.getElementById("skillInput"),e=n.value.trim().toLowerCase();e&&!t.has(e)&&(t.add(e),l(),n.value="")}),document.getElementById("jobForm").addEventListener("submit",e=>{e.preventDefault(),n={company:document.getElementById("company").value,description:document.getElementById("description").value,skills:Array.from(t)},alert("Llamado guardado exitosamente")}),document.getElementById("cvForm").addEventListener("submit",async e=>{if(e.preventDefault(),!n)return void alert("Por favor, primero cree un llamado");let l=document.getElementById("cvFile").files,r=[];for(let e of l){let{text:l,hasImages:i}=await async function(t){let n=await t.arrayBuffer(),e=await pdfjsLib.getDocument({data:n}).promise,l="";let r=!1;for(let t=1;t<=e.numPages;t++){let n=await e.getPage(t),i=await n.getTextContent();l+=i.items.map(t=>t.str).join(" ");let a=await n.getOperatorList();for(let t=0;t<a.fnArray.length;t++)if(a.fnArray[t]===pdfjsLib.OPS.paintJpegXObject||a.fnArray[t]===pdfjsLib.OPS.paintImageXObject){r=!0;break}}return{text:l,hasImages:r}}(e),a=function(t,n){t=t.toLowerCase();let e=n.filter(n=>t.includes(n.toLowerCase()));return e.length/n.length*100}(l,n.skills);r.push({name:e.name,percentage:a,hasPhoto:i})}!function(t){let n=document.getElementById("results");n.innerHTML="",t.forEach((t,e)=>{let l=document.createElement("div");l.className="col-md-4 mb-4",l.innerHTML=`
    <div class="card h-100">
        <div class="card-body text-center">
            <h5 class="card-title">${t.name}</h5>
            <div class="position-relative mb-3" style="height: 200px;">
                <canvas id="chart${e}"></canvas>
                <div class="position-absolute top-0 end-0">
                    <span class="badge ${t.hasPhoto?"bg-success":"bg-secondary"}" 
                          title="${t.hasPhoto?"Contiene imagen":"No contiene imagen"}">
                        <i class="fas ${t.hasPhoto?"fa-camera":"fa-camera-slash"}"></i>
                    </span>
                </div>
            </div>
            <p class="card-text">
                <strong>Coincidencia: ${t.percentage.toFixed(1)}%</strong>
            </p>
        </div>
    </div>`,n.appendChild(l),setTimeout(()=>{let n=document.getElementById(`chart${e}`).getContext("2d");new Chart(n,{type:"doughnut",data:{labels:["Coincidencia","No coincide"],datasets:[{data:[t.percentage,100-t.percentage],backgroundColor:["#28a745","#e9ecef"],borderWidth:0}]},options:{responsive:!0,maintainAspectRatio:!1,cutout:"70%",plugins:{legend:{display:!1},tooltip:{callbacks:{label:function(t){return`${t.label}: ${t.raw.toFixed(1)}%`}}}}}})},0)})}(r.sort((t,n)=>n.percentage-t.percentage).slice(0,5))});let l=()=>{let n=document.getElementById("skillsList");n.innerHTML="",t.forEach(t=>{let e=document.createElement("span");e.className="badge bg-primary d-flex align-items-center",e.innerHTML=`${t}<i class="fas fa-times ms-2 cursor-pointer" onclick="removeSkill('${t}')"></i>`,n.appendChild(e)})};window.removeSkill=n=>{t.delete(n),l()}}();