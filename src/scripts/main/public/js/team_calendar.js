document.addEventListener('DOMContentLoaded', function() {
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    let notes = JSON.parse(localStorage.getItem('tasks')) || {};
  
    function displayCalendar(month, year) {
        let firstDay = new Date(year, month, 1);
        let daysInMonth = new Date(year, month + 1, 0).getDate();
        let startingDay = firstDay.getDay();
        let calendarBody = document.getElementById("calendarBody");
        calendarBody.innerHTML = '';
    
        const monthNames = ["January", "February", "March", "April", "May", "June",
                            "July", "August", "September", "October", "November", "December"];
        document.getElementById("current_month").textContent = `${monthNames[month]} ${year}`;
    
        // Get all tasks and create a set of dates that have tasks
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const taskDates = new Set(tasks.map(task => task.date));
    
        let date = 1;
        for (let i = 0; i < 6; i++) {
            let row = document.createElement("tr");
            for (let j = 0; j < 7; j++) {
                let cell = document.createElement("td");
                if (i === 0 && j < startingDay) {
                    row.appendChild(cell);
                } else if (date > daysInMonth) {
                    row.appendChild(cell);
                } else {
                    let fullDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
                    cell.textContent = date;
                    cell.dataset.date = fullDate;
                    cell.onclick = () => displayTasks(cell.dataset.date);
    
                    // Check if the date has tasks and highlight if it does
                    if (taskDates.has(fullDate)) {
                        cell.style.fontWeight = "bold";
                        cell.style.color = "#FF0000";
                    }
    
                    row.appendChild(cell);
                    date++;
                }
            }
            calendarBody.appendChild(row);
        }
    }
    

    function displayTasks(date) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const filteredTasks = tasks.filter(task => task.date === date);
        const taskContentContainer = document.getElementById('task-content'); // Get the task content container
        taskContentContainer.innerHTML = ''; // Clear existing content in the task container
    
        if (filteredTasks.length === 0) {
            taskContentContainer.innerHTML = `
                <img src="../icons/calendar-icon.svg" alt="No Schedule Icon" class="icon">
                <p class="message">No Schedule Today</p>
            `;
        } else {
            filteredTasks.forEach(task => {
                const checkedAttribute = task.completed ? 'checked' : '';
                const textDecoration = task.completed ? 'text-decoration: line-through;' : '';
                const taskHtml = `
                    <div class="overlap" data-task-id="${task.id}">
                        <label class="group">
                            <input type="checkbox" class="rectangle-checkbox" ${checkedAttribute} onchange="updateTaskCompletion(${task.id}, this.checked)">
                            <div class="text-wrapper" style="${textDecoration}">${task.text}</div>
                        </label>
                    </div>`;
                taskContentContainer.innerHTML += taskHtml; // Append the task HTML to the content container
            });
        }
    }
    
    
    function updateTaskCompletion(taskId, isCompleted) {
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        const taskIndex = tasks.findIndex(t => t.id === taskId);
        if (taskIndex !== -1) {
            tasks[taskIndex].completed = isCompleted;
            tasks[taskIndex].completedDate = isCompleted ? new Date().toISOString() : null;
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
    }
    
    
    
    
    displayCalendar(currentMonth, currentYear);

    document.getElementById("prev_month").addEventListener("click", function() {
        if (currentMonth === 0) {
            currentMonth = 11;
            currentYear--;
        } else {
            currentMonth--;
        }
        displayCalendar(currentMonth, currentYear);
    });

    document.getElementById("next_month").addEventListener("click", function() {
        if (currentMonth === 11) {
            currentMonth = 0;
            currentYear++;
        } else {
            currentMonth++;
        }
        displayCalendar(currentMonth, currentYear);
    });
});

function loadPopupContent() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("popupContent").innerHTML = this.responseText;
        } else if (this.readyState == 4) {
            console.error("Error loading page: " + this.statusText);
        }
    };
    xhttp.open("GET", "addEvent.html", true);
    xhttp.send();
}

document.getElementById("openModal").addEventListener("click", function() {
    loadPopupContent();
    document.getElementById("pageModal").style.display = "block";
});

document.getElementById("closeModal").addEventListener("click", function() {
    document.getElementById("pageModal").style.display = "none";
    document.getElementById("popupContent").innerHTML = "";
});
