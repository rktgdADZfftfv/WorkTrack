let workers = JSON.parse(localStorage.getItem("workers")) || [];

let currentWorker = null;

let chart = null;

/* ---------- SAVE DATA ---------- */

function save() {
localStorage.setItem("workers", JSON.stringify(workers));
}

/* ---------- ADD WORKER ---------- */

function addWorker(){

let name = document.getElementById("name").value;
let address = document.getElementById("address").value;
let date = document.getElementById("date").value;
let salary = Number(document.getElementById("salary").value);

if(!name || !address || !salary){

alert("Please fill all fields");
return;

}

let worker = {

name:name,
address:address,
date:date,
salary:salary,
attendance:{}

};

workers.push(worker);

save();

showWorkers();

clearInputs();

}

/* ---------- CLEAR INPUT ---------- */

function clearInputs(){

document.getElementById("name").value="";
document.getElementById("address").value="";
document.getElementById("date").value="";
document.getElementById("salary").value="";

}

/* ---------- SHOW WORKERS ---------- */

function showWorkers(){

let list = document.getElementById("workerList");

list.innerHTML="";

workers.forEach((w,i)=>{

let div = document.createElement("div");

div.className="worker";

div.innerHTML=`

<b>${w.name}</b><br>

Address: ${w.address}<br>

Salary: ₹${w.salary}/day<br><br>

<button onclick="openCalendar(${i})">Attendance</button>

<button onclick="editWorker(${i})">Edit</button>

<button onclick="deleteWorker(${i})">Delete</button>

<button onclick="downloadReport(${i})">Download</button>

`;

list.appendChild(div);

});

updateTotalSalary();

}

/* ---------- EDIT WORKER ---------- */

function editWorker(i){

let w = workers[i];

document.getElementById("name").value=w.name;
document.getElementById("address").value=w.address;
document.getElementById("date").value=w.date;
document.getElementById("salary").value=w.salary;

deleteWorker(i);

}

/* ---------- DELETE WORKER ---------- */

function deleteWorker(i){

workers.splice(i,1);

save();

showWorkers();

}

/* ---------- SEARCH ---------- */

function searchWorker(){

let text = document.getElementById("search").value.toLowerCase();

let list = document.getElementById("workerList");

list.innerHTML="";

workers.forEach((w,i)=>{

if(w.name.toLowerCase().includes(text)){

let div=document.createElement("div");

div.className="worker";

div.innerHTML=`

<b>${w.name}</b><br>

Address: ${w.address}<br>

Salary: ₹${w.salary}/day<br><br>

<button onclick="openCalendar(${i})">Attendance</button>

<button onclick="editWorker(${i})">Edit</button>

<button onclick="deleteWorker(${i})">Delete</button>

<button onclick="downloadReport(${i})">Download</button>

`;

list.appendChild(div);

}

});

}

/* ---------- OPEN CALENDAR ---------- */

function openCalendar(index) {

    currentWorker = index;
    let worker = workers[index];

    let today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth();
    let days = new Date(year, month + 1, 0).getDate();

    // Update Attendance Label with username
    let calTitle = document.getElementById("calendarTitle");
    calTitle.innerText = `📅 Attendance (${worker.name})`;

    let cal = document.getElementById("calendar");
    cal.innerHTML = "";

    for (let d = 1; d <= days; d++) {
        let div = document.createElement("div");
        div.className = "day";
        div.innerText = d;

        if (worker.attendance[d]) div.classList.add("present");

        div.onclick = () => toggleAttendance(d, div);

        cal.appendChild(div);
    }

    // Update Chart Label with username
    let chartTitle = document.getElementById("chartTitle");
    chartTitle.innerText = `📊 Salary Graph (${worker.name})`;

    updateGraph();
}

/* ---------- TOGGLE ATTENDANCE ---------- */

function toggleAttendance(day,element){

let worker = workers[currentWorker];

if(worker.attendance[day]){

delete worker.attendance[day];

element.classList.remove("present");

}

else{

worker.attendance[day]=true;

element.classList.add("present");

}

save();

updateGraph();

updateTotalSalary();

}

/* ---------- GRAPH ---------- */

function updateGraph() {
    let worker = workers[currentWorker];
    let daysWorked = Object.keys(worker.attendance).length;
    let totalSalary = daysWorked * worker.salary;

    let ctx = document.getElementById("chart");

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {  // <--- बस assign करो, let नहीं
        type: 'bar',
        data: {
            labels: ['Salary'],
            datasets: [{
                label: 'Monthly Salary',
                data: [totalSalary],
                backgroundColor: '#cdd8d1',
                borderRadius: 5,
                barThickness: 20
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
            },
            scales: {
                x: { grid: { display: false } },
                y: { beginAtZero: true }
            }
        }
    });

}
/* ---------- TOTAL SALARY ---------- */

function updateTotalSalary(){

let total = 0;

workers.forEach(w=>{

let days = Object.keys(w.attendance).length;

total += days * w.salary;

});

document.getElementById("totalSalary").innerText="₹"+total;

}

/* ---------- DOWNLOAD REPORT ---------- */

function downloadReport(index) {

    const { jsPDF } = window.jspdf;

    let worker = workers[index];

    let daysWorked = Object.keys(worker.attendance).length;

    let totalSalary = daysWorked * worker.salary;

    let today = new Date();

    let month = today.toLocaleString("default", { month: "long" });
    let year = today.getFullYear();

    let pdf = new jsPDF();

    let y = 10;

    pdf.setFontSize(16);
    pdf.text("Worker Salary Report", 10, y);

    y += 10;

    pdf.setFontSize(12);

    pdf.text(`Name: ${worker.name}`, 10, y);
    y += 8;

    pdf.text(`Address: ${worker.address}`, 10, y);
    y += 8;

    pdf.text(`Month: ${month} ${year}`, 10, y);
    y += 8;

    pdf.text(`Daily Salary: Rs. ${worker.salary}`, 10, y);
    y += 8;

    pdf.text(`Days Worked: ${daysWorked}`, 10, y);
    y += 8;

    pdf.text(`Total Salary: Rs. ${totalSalary}`, 10, y);

    y += 12;

    pdf.text("Attendance:", 10, y);

    y += 8;

    /* Attendance List */

    let attendanceDays = Object.keys(worker.attendance);

    if (attendanceDays.length === 0) {

        pdf.text("No attendance recorded", 10, y);

    } else {

        attendanceDays.forEach(day => {

            pdf.text(`Day ${day} : Present`, 10, y);

            y += 6;

        });

    }

    pdf.save(worker.name + "_salary_report.pdf");

}
/* ---------- DOWNLOAD ALL REPORT ---------- */

function downloadAll(){

const { jsPDF } = window.jspdf;

let pdf = new jsPDF();

workers.forEach((w,i)=>{

let days = Object.keys(w.attendance).length;

let salary = days * w.salary;

pdf.text(`${w.name} | Days:${days} | Salary: Rs. ${salary}`,10,10+(i*10));

});

pdf.save("all_workers_report.pdf");

}

/* ---------- AUTO MONTH RESET ---------- */

function checkMonth(){

let month = new Date().getMonth();

let saved = localStorage.getItem("month");

if(saved != month){

workers.forEach(w=>{

w.attendance={};

});

localStorage.setItem("month",month);

save();

}

}

/* ---------- START ---------- */

checkMonth();

showWorkers();