document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const calendarDays = document.getElementById("calendar-days")
  const miniCalendarDays = document.getElementById("mini-calendar-days")
  const currentMonthYear = document.getElementById("current-month-year")
  const miniMonthYear = document.getElementById("mini-month-year")
  const prevMonthBtn = document.getElementById("prev-month-btn")
  const nextMonthBtn = document.getElementById("next-month-btn")
  const miniPrevMonthBtn = document.getElementById("mini-prev-month")
  const miniNextMonthBtn = document.getElementById("mini-next-month")
  const todayBtn = document.getElementById("today-btn")
  const newEventBtn = document.getElementById("new-event-btn")
  const addTaskBtn = document.getElementById("add-task-btn")
  const addDepartmentBtn = document.getElementById("add-department-btn")
  const sortDepartmentsBtn = document.getElementById("sort-departments-btn")
  const eventModal = document.getElementById("event-modal")
  const taskModal = document.getElementById("task-modal")
  const eventDetailsModal = document.getElementById("event-details-modal")
  const departmentModal = document.getElementById("department-modal")
  const closeModalBtn = document.querySelector(".close-modal")
  const closeDetailsModalBtn = document.getElementById("close-details-modal")
  const closeDepartmentModalBtn = document.getElementById("close-department-modal")
  const closeTaskModalBtn = document.getElementById("close-task-modal")
  const cancelEventBtn = document.getElementById("cancel-event")
  const cancelTaskBtn = document.getElementById("cancel-task")
  const cancelDepartmentBtn = document.getElementById("cancel-department")
  const eventForm = document.getElementById("event-form")
  const taskForm = document.getElementById("task-form")
  const departmentForm = document.getElementById("department-form")
  const eventsList = document.getElementById("events-list")
  const eventDateInput = document.getElementById("event-date")
  const taskDateInput = document.getElementById("task-date")
  const eventDepartmentSelect = document.getElementById("event-department")
  const taskDepartmentSelect = document.getElementById("task-department")
  const departmentTabs = document.getElementById("department-tabs")
  const colorOptions = document.querySelectorAll(".color-option")
  const eventColorInput = document.getElementById("event-color")
  const departmentColorInput = document.getElementById("department-color")
  const tabButtons = document.querySelectorAll(".tab-btn")
  const editEventBtn = document.getElementById("edit-event")
  const deleteEventBtn = document.getElementById("delete-event")

  // State
  let currentDate = new Date()
  let selectedDate = new Date()
  let events = []
  let departments = []
  let selectedColor = "blue"
  let currentEventId = null
  let activeDepartmentId = "all" // "all" means show all departments
  let departmentIdToDelete = null;

  // Initialize
  initCalendar()

  async function initCalendar() {
    // Confirm delete modal logic
    document.getElementById("confirm-delete").addEventListener("click", () => {
      // Implementation needed
    });

    document.getElementById("cancel-confirm").addEventListener("click", () => {
      departmentIdToDelete = null;
      document.getElementById("confirm-modal").style.display = "none";
    });

    document.getElementById("close-confirm-modal").addEventListener("click", () => {
      departmentIdToDelete = null;
      document.getElementById("confirm-modal").style.display = "none";
    });

    // Set minimum date on inputs to prevent selecting past dates
    const today = new Date().toISOString().split('T')[0];
    eventDateInput.setAttribute('min', today);
    taskDateInput.setAttribute('min', today);

    // Load departments and events from localStorage or create defaults
    await loadDepartments()
    await loadEvents()
    await loadTasks()

    renderCalendar(currentDate)
    renderMiniCalendar(currentDate)
    renderDepartmentTabs()
    updateEventsList()
    populateDepartmentSelect()

    // Event Listeners
    prevMonthBtn.addEventListener("click", () => {
      currentDate.setMonth(currentDate.getMonth() - 1)
      renderCalendar(currentDate)
      renderMiniCalendar(currentDate)
    })

    nextMonthBtn.addEventListener("click", () => {
      currentDate.setMonth(currentDate.getMonth() + 1)
      renderCalendar(currentDate)
      renderMiniCalendar(currentDate)
    })

    miniPrevMonthBtn.addEventListener("click", () => {
      currentDate.setMonth(currentDate.getMonth() - 1)
      renderCalendar(currentDate)
      renderMiniCalendar(currentDate)
    })

    miniNextMonthBtn.addEventListener("click", () => {
      currentDate.setMonth(currentDate.getMonth() + 1)
      renderCalendar(currentDate)
      renderMiniCalendar(currentDate)
    })

    todayBtn.addEventListener("click", () => {
      currentDate = new Date()
      selectedDate = new Date()
      renderCalendar(currentDate)
      renderMiniCalendar(currentDate)
      updateEventsList()
    })

    newEventBtn.addEventListener("click", () => {
      openEventModal()
    })

    addTaskBtn.addEventListener("click", () => {
      openTaskModal()
    })

    addDepartmentBtn.addEventListener("click", () => {
      openDepartmentModal()
    })

    sortDepartmentsBtn.addEventListener("click", () => {
      sortDepartments()
    })

    closeModalBtn.addEventListener("click", () => {
      closeEventModal()
    })

    closeDetailsModalBtn.addEventListener("click", () => {
      closeEventDetailsModal()
    })

    closeDepartmentModalBtn.addEventListener("click", () => {
      closeDepartmentModal()
    })

    closeTaskModalBtn.addEventListener("click", () => {
      closeTaskModal()
    })

    cancelEventBtn.addEventListener("click", () => {
      closeEventModal()
    })

    cancelTaskBtn.addEventListener("click", () => {
      closeTaskModal()
    })

    cancelDepartmentBtn.addEventListener("click", () => {
      closeDepartmentModal()
    })

    eventForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      const dateInput = document.getElementById("event-date");
      const timeInput = document.getElementById("event-time");
      
      if (isPastDate(dateInput.value, !!currentEventId)) {
        alert("Please select a date that is today or in the future.");
        dateInput.focus();
        return;
      }
      
      // Check if the selected time is in the past for today's date
      if (!currentEventId && dateInput.value === formatDateForInput(new Date()) && isPastTime(dateInput.value, timeInput.value)) {
        alert("Please select a time that is in the future for today's events.");
        timeInput.focus();
        return;
      }
      
      await saveEvent();
    });

    taskForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const dateInput = document.getElementById("task-date");
      if (isPastDate(dateInput.value, !!currentEventId)) {
        alert("Please select a date that is today or in the future.");
        dateInput.focus();
        return;
      }

      try {
        const taskTitle = document.getElementById("task-title").value;
        const taskDate = document.getElementById("task-date").value;
        const taskPriority = document.getElementById("task-priority").value;
        const taskDescription = document.getElementById("task-description").value;
        const departmentId = document.getElementById("task-department").value;

        if (!taskTitle || !taskDate || !departmentId) {
          alert("Please fill in all required fields");
          return;
        }

        const taskData = {
          title: taskTitle,
          date: taskDate,
          priority: taskPriority || "medium",
          description: taskDescription,
          department: { id: parseInt(departmentId) }
        };

        let response;
        if (currentEventId) {
          // Update existing task
          response = await fetch(`http://localhost:8080/api/tasks/${currentEventId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskData)
          });
        } else {
          // Create new task
          response = await fetch('http://localhost:8080/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskData)
          });
        }

        if (!response.ok) {
          throw new Error(`Failed to ${currentEventId ? 'update' : 'create'} task`);
        }

        const savedTask = await response.json();
        
        // Update local state
        const taskEvent = {
          id: savedTask.id,
          title: savedTask.title,
          date: savedTask.date,
          time: "09:00",
          description: savedTask.description,
          priority: savedTask.priority,
          departmentId: savedTask.department.id.toString(),
          department: savedTask.department.name,
          type: "task"
        };

        const index = events.findIndex(e => e.id === savedTask.id && e.type === "task");
        if (index !== -1) {
          events[index] = taskEvent;
        } else {
          events.push(taskEvent);
        }

        saveEventsToStorage();
        renderCalendar(currentDate);
        updateEventsList();
        closeTaskModal();
      } catch (error) {
        console.error("Error saving task:", error);
        alert(`Failed to ${currentEventId ? 'update' : 'create'} task. Please try again.`);
      }
    });

    departmentForm.addEventListener("submit", (e) => {
      e.preventDefault()
      saveDepartment()
    })

    // Color options for event modal
    document.querySelectorAll("#event-modal .color-option").forEach((option) => {
      option.addEventListener("click", () => {
        document.querySelectorAll("#event-modal .color-option").forEach((opt) => opt.classList.remove("selected"))
        option.classList.add("selected")
        selectedColor = option.getAttribute("data-color")
        eventColorInput.value = selectedColor
      })
    })

    // Color options for department modal
    document.querySelectorAll("#department-modal .color-option").forEach((option) => {
      option.addEventListener("click", () => {
        document.querySelectorAll("#department-modal .color-option").forEach((opt) => opt.classList.remove("selected"))
        option.classList.add("selected")
        selectedColor = option.getAttribute("data-color")
        departmentColorInput.value = selectedColor
      })
    })

    tabButtons.forEach((button) => {
      button.addEventListener("click", () => {
        tabButtons.forEach((btn) => btn.classList.remove("active"))
        button.classList.add("active")
        const tabType = button.getAttribute("data-tab")
        if (tabType === "upcoming") {
          document.querySelector(".events-content h3").textContent = "Upcoming Events"
          document.querySelector(".events-subtitle").textContent = "Your schedule for the next few days"
        } else {
          document.querySelector(".events-content h3").textContent = "Tasks"
          document.querySelector(".events-subtitle").textContent = "Your pending tasks"
        }
        updateEventsList()
      })
    })

    editEventBtn.addEventListener("click", () => {
      const event = events.find((e) => e.id === currentEventId)
      if (event) {
        closeEventDetailsModal()
        if (event.type === "task") {
          openTaskModal(event)
        } else {
          openEventModal(event)
        }
      }
    })

    deleteEventBtn.addEventListener("click", () => {
      if (currentEventId) {
        deleteEvent(currentEventId)
        closeEventDetailsModal()
      }
    })
  }

  // Helper function to check if date is in the past
  function isPastDate(dateString, isEditing = false) {
    if (isEditing) return false; // Allow past dates when editing existing items
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const inputDate = new Date(dateString);
    return inputDate < today;
  }

  // Helper function to check if time is in the past
  function isPastTime(dateString, timeString) {
    const now = new Date();
    const selectedDateTime = new Date(dateString + 'T' + timeString);
    return selectedDateTime < now;
  }

  // Department Functions
  async function loadDepartments() {
    try {
      const response = await fetch('http://localhost:8080/api/departments');
      if (response.ok) {
        const loadedDepartments = await response.json();
        
        // Ensure all department IDs are strings for consistent comparison
        departments = loadedDepartments.map(dept => ({
          ...dept,
          id: dept.id.toString() // Convert all IDs to strings for consistency
        }));
        
        console.log("Loaded departments from server:", departments);
        
        // Save to localStorage as backup
        saveDepartmentsToStorage();
        
        // Update UI
        renderDepartmentTabs();
        populateDepartmentSelect();
      } else {
        console.error("Failed to fetch departments");
        // Fallback to localStorage if available
        const storedDepartments = localStorage.getItem("departments");
        if (storedDepartments) {
          departments = JSON.parse(storedDepartments);
          console.log("Using departments from localStorage:", departments);
          populateDepartmentSelect();
        }
      }
    } catch (error) {
      console.error("Error loading departments:", error);
      // Fallback to localStorage if available
      const storedDepartments = localStorage.getItem("departments");
      if (storedDepartments) {
        departments = JSON.parse(storedDepartments);
        console.log("Using departments from localStorage (after error):", departments);
        populateDepartmentSelect();
      }
    }
  }

  function saveDepartmentsToStorage() {
    localStorage.setItem("departments", JSON.stringify(departments))
  }

  function renderDepartmentTabs() {
    departmentTabs.innerHTML = "";

    // Add "All Departments" tab
    const allTab = document.createElement("button");
    allTab.classList.add("department-tab");
    if (activeDepartmentId === "all") {
        allTab.classList.add("active");
    }
    allTab.textContent = "All Departments";
    allTab.setAttribute("data-id", "all");
    allTab.addEventListener("click", () => {
        setActiveDepartment("all");
    });
    departmentTabs.appendChild(allTab);

    // Add department tabs
    departments.forEach((dept) => {
        const tab = document.createElement("button");
        tab.classList.add("department-tab");
        if (dept.id === activeDepartmentId) {
            tab.classList.add("active");
        }

        const colorDot = document.createElement("span");
        colorDot.classList.add("department-color");
        colorDot.style.backgroundColor = getColorValue(dept.color);

        // Department Name
        const deptName = document.createElement("span");
        deptName.classList.add("department-name");
        deptName.textContent = dept.name;

        // Delete Button (Trash Icon)
        const deleteBtn = document.createElement("i");
        deleteBtn.classList.add("department-delete", "fas", "fa-trash-alt");
        deleteBtn.title = "Remove department";
        deleteBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            showDeleteConfirmation(dept.id, dept.name);
        });

        // Create a container for the name and delete button
        const contentContainer = document.createElement("span");
        contentContainer.classList.add("department-content");
        contentContainer.appendChild(deptName);
        contentContainer.appendChild(deleteBtn);

        tab.appendChild(colorDot);
        tab.appendChild(contentContainer);

        tab.setAttribute("data-id", dept.id);
        tab.addEventListener("click", () => {
            setActiveDepartment(dept.id);
        });

        departmentTabs.appendChild(tab);
    });
  }
  
  async function deleteDepartment(departmentId) {
    try {
        const response = await fetch(`http://localhost:8080/api/departments/${departmentId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            // Remove department from local state
            departments = departments.filter(dept => dept.id !== departmentId);
            
            // Remove department's events from local state
            events = events.filter(event => event.departmentId !== departmentId);
            
            // Update UI
            saveDepartmentsToStorage();
            saveEventsToStorage();
            renderDepartmentTabs();
            renderCalendar(currentDate);
            updateEventsList();
            
            // If the deleted department was active, switch to "All Departments"
            if (activeDepartmentId === departmentId) {
                setActiveDepartment("all");
            }
            
            // Close the confirmation modal
            document.getElementById("confirm-modal").style.display = "none";
            
            alert("Department deleted successfully");
        } else {
            throw new Error("Failed to delete department");
        }
    } catch (error) {
        console.error("Error deleting department:", error);
        alert("Failed to delete department. Please try again.");
    }
  }

  function showDeleteConfirmation(departmentId, departmentName) {
    const confirmModal = document.getElementById("confirm-modal");
    const confirmMessage = document.getElementById("confirm-message");
    
    confirmMessage.textContent = `Are you sure you want to delete the "${departmentName}" department? This will also delete all associated events and tasks.`;
    confirmModal.style.display = "block";
    
    // Set up the confirm delete button
    const confirmDeleteBtn = document.getElementById("confirm-delete");
    confirmDeleteBtn.onclick = () => {
        deleteDepartment(departmentId);
    };
    
    // Set up the cancel button
    const cancelBtn = document.getElementById("cancel-confirm");
    cancelBtn.onclick = () => {
        confirmModal.style.display = "none";
    };
    
    // Set up the close button
    const closeBtn = document.getElementById("close-confirm-modal");
    closeBtn.onclick = () => {
        confirmModal.style.display = "none";
    };
  }

  async function setActiveDepartment(departmentId) {
    activeDepartmentId = departmentId;
    renderDepartmentTabs();
    
    try {
        let tasks;
        if (departmentId === "all") {
            // Fetch all tasks
            const response = await fetch('http://localhost:8080/api/tasks');
            if (!response.ok) {
                throw new Error('Failed to fetch tasks');
            }
            tasks = await response.json();
        } else {
            // Convert departmentId to number for the API call
            const numericDepartmentId = parseInt(departmentId);
            // Fetch tasks for specific department
            const response = await fetch(`http://localhost:8080/api/tasks/department/${numericDepartmentId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch department tasks');
            }
            tasks = await response.json();
        }
        
        // Convert tasks to events format
        const taskEvents = tasks.map(task => ({
            id: task.id,
            title: task.title,
            date: task.date,
            time: "09:00",
            description: task.description,
            priority: task.priority,
            departmentId: task.department.id.toString(),
            department: task.department.name,
            type: "task"
        }));
        
        // Replace existing tasks in the events array
        events = events.filter(event => event.type !== "task");
        events.push(...taskEvents);
        
        // Update UI
        renderCalendar(currentDate);
        updateEventsList();
        
    } catch (error) {
        console.error("Error loading tasks:", error);
        alert("Failed to load tasks. Please try again.");
    }
  }

  function populateDepartmentSelect() {
    eventDepartmentSelect.innerHTML = "";
    taskDepartmentSelect.innerHTML = "";
  
    // Add a default option
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Select Department";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    eventDepartmentSelect.appendChild(defaultOption);
    
    // Clone for task select if needed
    const taskDefaultOption = defaultOption.cloneNode(true);
    taskDepartmentSelect.appendChild(taskDefaultOption);
  
    // Add departments from your array
    departments.forEach((dept) => {
      const option = document.createElement("option");
      option.value = dept.id.toString(); // Ensure ID is a string
      option.textContent = dept.name;
      option.dataset.color = dept.color; // Store color as data attribute
      eventDepartmentSelect.appendChild(option);
  
      // Clone for task select if needed
      const taskOption = option.cloneNode(true);
      taskDepartmentSelect.appendChild(taskOption);
    });
    
    // Log the populated departments for debugging
    console.log("Populated departments:", departments.map(d => ({ id: d.id, name: d.name })));
    console.log("Department select options:", Array.from(eventDepartmentSelect.options).map(o => ({ value: o.value, text: o.text })));
  }

  function openDepartmentModal() {
    departmentModal.classList.add("active")
    document.getElementById("department-name").value = ""
    document.getElementById("department-color").value = "blue"

    document.querySelectorAll("#department-modal .color-option").forEach((option) => {
      option.classList.remove("selected")
      if (option.getAttribute("data-color") === "blue") {
        option.classList.add("selected")
      }
    })
  }

  function closeDepartmentModal() {
    departmentModal.classList.remove("active")
  }

  async function saveDepartment() {
      const departmentName = document.getElementById("department-name").value;
      const departmentColor = document.getElementById("department-color").value;
  
      if (!departmentName) return;
  
      try {
          const response = await fetch('http://localhost:8080/api/departments', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                  name: departmentName,
                  color: departmentColor
              })
          });
  
          if (response.ok) {
              const newDepartment = await response.json();
              // Add to local departments array
              departments.push({
                  ...newDepartment,
                  id: newDepartment.id.toString()
              });
              saveDepartmentsToStorage();
              renderDepartmentTabs();
              populateDepartmentSelect();
              closeDepartmentModal();
          } else {
              alert("Failed to save department");
          }
      } catch (error) {
          console.error("Error saving department:", error);
          alert("An error occurred while saving the department");
      }
  }

  function sortDepartments() {
    departments.sort((a, b) => a.name.localeCompare(b.name))
    saveDepartmentsToStorage()
    renderDepartmentTabs()
  }

  // Event Functions
  async function loadEvents() {
    try {
      const response = await fetch('http://localhost:8080/api/events');
      if (response.ok) {
        const apiEvents = await response.json();
        
        // Convert API events to your calendar's event format
        events = apiEvents.map(event => ({
          id: event.id,
          title: event.title,
          date: event.date,
          time: event.time,
          description: event.description,
          color: event.color,
          departmentId: event.department ? event.department.id.toString() : "",
          department: event.department ? event.department.name : "Unknown",
          type: "event"
        }));
        
        // Save to localStorage as backup
        saveEventsToStorage();
        
        console.log("Events loaded from API:", events);
        
        // Update the UI
        renderCalendar(currentDate);
        updateEventsList();
      } else {
        throw new Error("Failed to fetch events");
      }
    } catch (error) {
      console.error("Error loading events:", error);
      // Fallback to localStorage if API fails
      const storedEvents = localStorage.getItem("events");
      if (storedEvents) {
        events = JSON.parse(storedEvents);
      } else {
        events = []; // Ensure we have an empty array if no data exists
      }
      
      // Update the UI even if we fall back to localStorage
      renderCalendar(currentDate);
      updateEventsList();
    }
  }

  function saveEventsToStorage() {
    localStorage.setItem("events", JSON.stringify(events))
  }

  async function saveEvent() {
    const eventTitle = document.getElementById("event-title").value;
    const eventDate = document.getElementById("event-date").value;
    const eventTime = document.getElementById("event-time").value;
    const eventDescription = document.getElementById("event-description").value;
    const eventColor = document.getElementById("event-color").value;
    const departmentId = document.getElementById("event-department").value;
    
    if (!eventTitle || !eventDate || !eventTime || !departmentId) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const department = departments.find(d => d.id.toString() === departmentId);
      const departmentName = department ? department.name : "Unknown Department";

      const eventData = {
        title: eventTitle,
        date: eventDate,
        time: eventTime,
        description: eventDescription,
        color: eventColor,
        department: departmentName,
        departmentId: departmentId
      };

      let url = "http://localhost:8080/api/events";
      let method = "POST";

      if (currentEventId) {
        url = `http://localhost:8080/api/events/${currentEventId}`;
        method = "PUT";
        eventData.id = currentEventId;
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData)
      });

      if (response.ok) {
        const savedEvent = await response.json();
        
        // Update local events array
        if (currentEventId) {
          const index = events.findIndex(e => e.id === currentEventId);
          if (index !== -1) {
            events[index] = {
              id: savedEvent.id,
              title: savedEvent.title,
              date: savedEvent.date,
              time: savedEvent.time,
              description: savedEvent.description,
              color: savedEvent.color,
              departmentId: departmentId,
              department: departmentName,
              type: "event"
            };
          }
        } else {
          events.push({
            id: savedEvent.id,
            title: savedEvent.title,
            date: savedEvent.date,
            time: savedEvent.time,
            description: savedEvent.description,
            color: savedEvent.color,
            departmentId: departmentId,
            department: departmentName,
            type: "event"
          });
        }

        saveEventsToStorage();
        renderCalendar(currentDate);
        updateEventsList();
        closeEventModal();
      } else {
        alert("Failed to save event");
      }
    } catch (error) {
      console.error("Error saving event:", error);
      alert("An error occurred while saving the event");
    }
  }

  async function loadTasks() {
    try {
        const response = await fetch('http://localhost:8080/api/tasks');
        if (response.ok) {
            const tasks = await response.json();
            // Convert tasks to events format
            const taskEvents = tasks.map(task => ({
                id: task.id,
                title: task.title,
                date: task.date,
                time: "09:00",
                description: task.description,
                priority: task.priority,
                departmentId: task.department.id.toString(),
                department: task.department.name,
                type: "task"
            }));
            // Replace existing tasks in the events array
            events = events.filter(event => event.type !== "task");
            events.push(...taskEvents);
            saveEventsToStorage();
            renderCalendar(currentDate);
            updateEventsList();
        }
    } catch (error) {
        console.error("Error loading tasks:", error);
    }
  }

  // Calendar Rendering Functions
  function renderCalendar(date) {
    const year = date.getFullYear()
    const month = date.getMonth()

    // Update header
    currentMonthYear.textContent = `${getMonthName(month)} ${year}`

    // Clear previous days
    calendarDays.innerHTML = ""

    // Get first day of month and last day of month
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)

    // Get days from previous month
    const firstDayIndex = firstDay.getDay()
    const prevMonthLastDay = new Date(year, month, 0).getDate()

    // Get days in current month
    const daysInMonth = lastDay.getDate()

    // Get days from next month
    const lastDayIndex = lastDay.getDay()
    const nextDays = 6 - lastDayIndex

    // Previous month days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const day = prevMonthLastDay - i
      const dayDate = new Date(year, month - 1, day)
      addDayToCalendar(dayDate, true)
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const dayDate = new Date(year, month, i)
      addDayToCalendar(dayDate)
    }

    // Next month days
    for (let i = 1; i <= nextDays; i++) {
      const dayDate = new Date(year, month + 1, i)
      addDayToCalendar(dayDate, true)
    }
  }

  function renderMiniCalendar(date) {
    const year = date.getFullYear()
    const month = date.getMonth()

    // Update header
    miniMonthYear.textContent = `${getMonthName(month)} ${year}`

    // Clear previous days
    miniCalendarDays.innerHTML = ""

    // Get first day of month and last day of month
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)

    // Get days from previous month
    const firstDayIndex = firstDay.getDay()
    const prevMonthLastDay = new Date(year, month, 0).getDate()

    // Get days in current month
    const daysInMonth = lastDay.getDate()

    // Get days from next month
    const lastDayIndex = lastDay.getDay()
    const nextDays = 6 - lastDayIndex

    // Previous month days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const day = prevMonthLastDay - i
      const dayDate = new Date(year, month - 1, day)
      addDayToMiniCalendar(dayDate, true)
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const dayDate = new Date(year, month, i)
      addDayToMiniCalendar(dayDate)
    }

    // Next month days
    for (let i = 1; i <= nextDays; i++) {
      const dayDate = new Date(year, month + 1, i)
      addDayToMiniCalendar(dayDate, true)
    }
  }

  function addDayToCalendar(date, isOtherMonth = false) {
    const day = document.createElement("div")
    day.classList.add("day")

    if (isOtherMonth) {
      day.classList.add("other-month")
    }

    // Check if day is today
    const today = new Date()
    if (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    ) {
      day.classList.add("today")
    }

    // Check if day is selected
    if (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    ) {
      day.classList.add("selected")
    }

    // Add day number
    const dayNumber = document.createElement("div")
    dayNumber.classList.add("day-number")
    dayNumber.textContent = date.getDate()
    day.appendChild(dayNumber)

    // Add events for this day
    const formattedDate = formatDateForInput(date)
    let dayEvents = events.filter((event) => event.date === formattedDate)

    // Filter by department if a specific department is selected
    if (activeDepartmentId !== "all") {
      dayEvents = dayEvents.filter((event) => event.departmentId === activeDepartmentId)
    }

    dayEvents.forEach((event) => {
      const eventElement = document.createElement("div")

      if (event.type === "task") {
        eventElement.classList.add("event", "task", event.priority)
      } else {
        eventElement.classList.add("event", event.color)
      }

      // Get department name
      const department = departments.find((d) => d.id === event.departmentId)
      const departmentName = department ? department.name : "Unknown"

      eventElement.textContent = event.title

      if (event.type === "task") {
        eventElement.title = `[Task] ${event.title} (${departmentName}) - ${getPriorityText(event.priority)}`
      } else {
        eventElement.title = `${event.title} (${departmentName}) - ${formatTime(event.time)}`
      }

      day.appendChild(eventElement)

      eventElement.addEventListener("click", (e) => {
        e.stopPropagation()
        openEventDetailsModal(event)
      })
    })

    // Add click event
    day.addEventListener("click", () => {
      document.querySelectorAll(".day").forEach((d) => d.classList.remove("selected"))
      document.querySelectorAll(".mini-day").forEach((d) => d.classList.remove("selected"))
      day.classList.add("selected")

      selectedDate = new Date(date)
      updateEventsList()

      // Update mini calendar
      renderMiniCalendar(currentDate)
    })

    calendarDays.appendChild(day)
  }

  function addDayToMiniCalendar(date, isOtherMonth = false) {
    const day = document.createElement("div")
    day.classList.add("mini-day")
    day.textContent = date.getDate()

    if (isOtherMonth) {
      day.classList.add("other-month")
    }

    // Check if day is today
    const today = new Date()
    if (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    ) {
      day.classList.add("today")
    }

    // Check if day is selected
    if (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    ) {
      day.classList.add("selected")
    }

    // Check if day has events
    const formattedDate = formatDateForInput(date)
    let hasEvents = false

    if (activeDepartmentId === "all") {
      hasEvents = events.some((event) => event.date === formattedDate)
    } else {
      hasEvents = events.some((event) => event.date === formattedDate && event.departmentId === activeDepartmentId)
    }

    if (hasEvents) {
      day.classList.add("has-events")
    }

    // Add click event
    day.addEventListener("click", () => {
      document.querySelectorAll(".day").forEach((d) => d.classList.remove("selected"))
      document.querySelectorAll(".mini-day").forEach((d) => d.classList.remove("selected"))
      day.classList.add("selected")

      selectedDate = new Date(date)
      currentDate = new Date(date.getFullYear(), date.getMonth(), 1)

      renderCalendar(currentDate)
      updateEventsList()
    })

    miniCalendarDays.appendChild(day)
  }

  function updateEventsList() {
    eventsList.innerHTML = ""

    const activeTab = document.querySelector(".tab-btn.active").getAttribute("data-tab")
    const formattedSelectedDate = formatDateForInput(selectedDate)

    let filteredEvents = []
    if (activeTab === "upcoming") {
      // Get events for the selected date
      filteredEvents = events.filter((event) => event.date === formattedSelectedDate)

      // Filter by department if a specific department is selected
      if (activeDepartmentId !== "all") {
        filteredEvents = filteredEvents.filter((event) => event.departmentId === activeDepartmentId)
      }
    } else {
      // Get tasks only
      filteredEvents = events.filter((event) => event.type === "task")

      // Filter by department if a specific department is selected
      if (activeDepartmentId !== "all") {
        filteredEvents = filteredEvents.filter((event) => event.departmentId === activeDepartmentId)
      }
    }

    if (filteredEvents.length === 0) {
      const noEvents = document.createElement("p")
      noEvents.textContent = activeTab === "upcoming" ? "No events scheduled for this day" : "No tasks found"
      noEvents.style.color = "var(--text-secondary)"
      noEvents.style.textAlign = "center"
      noEvents.style.padding = "1rem 0"
      eventsList.appendChild(noEvents)
      return
    }

    // Sort events by time or priority
    filteredEvents.sort((a, b) => {
      if (a.date !== b.date) {
        return a.date.localeCompare(b.date)
      }
      if (a.type === "task" && b.type === "task") {
        // Sort tasks by priority (high, medium, low)
        const priorityOrder = { high: 0, medium: 1, low: 2 }
        return priorityOrder[a.priority] - priorityOrder[b.priority]
      }
      return a.time.localeCompare(b.time)
    })

    filteredEvents.forEach((event) => {
      const eventItem = document.createElement("div")

      if (event.type === "task") {
        eventItem.classList.add("event-item", "task", event.priority)
      } else {
        eventItem.classList.add("event-item")
      }

      const eventItemHeader = document.createElement("div")
      eventItemHeader.classList.add("event-item-header")

      const eventDate = document.createElement("div")
      eventDate.classList.add("event-date")
      eventDate.textContent = formatDate(new Date(event.date))

      eventItemHeader.appendChild(eventDate)
      eventItem.appendChild(eventItemHeader)

      const eventTitle = document.createElement("div")
      eventTitle.classList.add("event-title")

      const eventBadge = document.createElement("span")
      eventBadge.classList.add("event-badge")

      if (event.type === "task") {
        const priorityColors = {
          low: "var(--priority-low)",
          medium: "var(--priority-medium)",
          high: "var(--priority-high)",
        }
        eventBadge.style.backgroundColor = priorityColors[event.priority]
      } else {
        eventBadge.style.backgroundColor = getColorValue(event.color)
      }

      eventTitle.appendChild(eventBadge)
      eventTitle.appendChild(document.createTextNode(event.title))
      eventItem.appendChild(eventTitle)

      // Add event type
      const eventType = document.createElement("div")
      eventType.classList.add("event-type")
      eventType.textContent = event.type === "task" ? "Task" : "Event"
      eventItem.appendChild(eventType)

      if (event.type === "task") {
        // Add priority for tasks
        const eventPriority = document.createElement("div")
        eventPriority.classList.add("event-priority", event.priority)
        eventPriority.textContent = getPriorityText(event.priority)
        eventItem.appendChild(eventPriority)
      } else {
        // Add time for events
        const eventTime = document.createElement("div")
        eventTime.classList.add("event-time")
        eventTime.textContent = formatTime(event.time)
        eventItem.appendChild(eventTime)
      }

      // Add department info
      const department = departments.find((d) => d.id === event.departmentId)
      if (department) {
        const eventDepartment = document.createElement("div")
        eventDepartment.classList.add("event-department")
        eventDepartment.textContent = `Department: ${department.name}`
        eventItem.appendChild(eventDepartment)
      }

      eventItem.addEventListener("click", () => {
        openEventDetailsModal(event)
      })

      eventsList.appendChild(eventItem)
    })
  }

  function openEventModal(event = null) {
    eventModal.classList.add("active");

    if (event) {
      // Edit mode
      document.querySelector("#event-modal .modal-header h3").textContent = "Edit Event";
      document.getElementById("event-title").value = event.title;
      document.getElementById("event-date").value = event.date;
      document.getElementById("event-time").value = event.time;
      document.getElementById("event-description").value = event.description || "";
      document.getElementById("event-department").value = event.departmentId;
      document.getElementById("event-color").value = event.color;

      // Set selected color
      document.querySelectorAll("#event-modal .color-option").forEach((option) => {
        option.classList.remove("selected");
        if (option.getAttribute("data-color") === event.color) {
          option.classList.add("selected");
        }
      });

      currentEventId = event.id;
    } else {
      // Add mode
      document.querySelector("#event-modal .modal-header h3").textContent = "Add New Event";
      eventForm.reset();
      currentEventId = null;

      // Set default date to selected date
      document.getElementById("event-date").value = formatDateForInput(selectedDate);
      
      // Set default time to current time rounded up to next hour
      const now = new Date();
      const nextHour = new Date(now);
      nextHour.setHours(now.getHours() + 1, 0, 0, 0);
      document.getElementById("event-time").value = nextHour.toTimeString().slice(0, 5);

      // Set default color to blue
      document.querySelectorAll("#event-modal .color-option").forEach((option) => {
        option.classList.remove("selected");
        if (option.getAttribute("data-color") === "blue") {
          option.classList.add("selected");
        }
      });
      document.getElementById("event-color").value = "blue";

      // Set department if one is active
      if (activeDepartmentId !== "all") {
        document.getElementById("event-department").value = activeDepartmentId;
      }
    }
  }

  function openTaskModal(task = null) {
    taskModal.classList.add("active");
    
    if (task) {
        // Edit mode
        document.querySelector("#task-modal .modal-header h3").textContent = "Edit Task";
        document.getElementById("task-title").value = task.title;
        document.getElementById("task-date").value = task.date;
        document.getElementById("task-priority").value = task.priority || "medium";
        document.getElementById("task-description").value = task.description || "";
        document.getElementById("task-department").value = task.departmentId;
        document.getElementById("task-submit-btn").textContent = "Save Changes";
        
        // Set the current event ID for editing
        currentEventId = task.id;
    } else {
        // Add mode
        document.querySelector("#task-modal .modal-header h3").textContent = "Add New Task";
        document.getElementById("task-submit-btn").textContent = "Add Task";
        currentEventId = null;

        // Set default date to selected date
        document.getElementById("task-date").value = formatDateForInput(selectedDate);

        // Set default priority
        document.getElementById("task-priority").value = "medium";

        // Set department if one is active
        if (activeDepartmentId !== "all") {
            document.getElementById("task-department").value = activeDepartmentId;
        }
    }
  }

  function closeEventModal() {
    eventModal.classList.remove("active")
    eventForm.reset()
    currentEventId = null
  }

  function closeTaskModal() {
    taskModal.classList.remove("active")
    taskForm.reset()
    currentEventId = null
  }

  function openEventDetailsModal(event) {
    eventDetailsModal.classList.add("active");
    currentEventId = event.id;

    document.getElementById("detail-event-title").textContent = event.title;
    document.getElementById("detail-event-date").textContent = formatDate(new Date(event.date));
    document.getElementById("detail-event-department").textContent = event.department || "Unknown Department";
    document.getElementById("detail-event-description").textContent = event.description || "No description provided";

    // Show/hide elements based on event type
    if (event.type === "task") {
        document.getElementById("detail-event-time").parentElement.style.display = "none";
        document.getElementById("detail-event-type").textContent = "Task";
        document.getElementById("detail-task-priority-container").style.display = "flex";
        document.getElementById("detail-task-priority").textContent = getPriorityText(event.priority);
        document.getElementById("detail-task-priority").className = event.priority;
    } else {
        document.getElementById("detail-event-time").parentElement.style.display = "flex";
        document.getElementById("detail-event-time").textContent = formatTime(event.time);
        document.getElementById("detail-event-type").textContent = "Event";
        document.getElementById("detail-task-priority-container").style.display = "none";
    }

    // Set up edit button
    editEventBtn.onclick = () => {
        closeEventDetailsModal();
        if (event.type === "task") {
            openTaskModal(event);
        } else {
            openEventModal(event);
        }
    };

    // Set up delete button
    deleteEventBtn.onclick = async () => {
        if (confirm(`Are you sure you want to delete this ${event.type}?`)) {
            try {
                const response = await fetch(`http://localhost:8080/api/${event.type === "task" ? "tasks" : "events"}/${event.id}`, {
                    method: "DELETE"
                });

                if (response.ok) {
                    events = events.filter(e => e.id !== event.id);
                    saveEventsToStorage();
                    renderCalendar(currentDate);
                    updateEventsList();
                    closeEventDetailsModal();
                } else {
                    throw new Error("Failed to delete event");
                }
            } catch (error) {
                console.error("Error deleting event:", error);
                alert("Failed to delete event. Please try again.");
            }
        }
    };
  }

  function closeEventDetailsModal() {
    eventDetailsModal.classList.remove("active")
    currentEventId = null
  }

  // Helper Functions
  function getMonthName(month) {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]
    return months[month]
  }

  function formatDate(date) {
    const options = { weekday: "long", month: "long", day: "numeric" }
    return date.toLocaleDateString("en-US", options)
  }

  function formatDateForInput(date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  function formatTime(timeString) {
    const [hours, minutes] = timeString.split(":")
    const hour = Number.parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const hour12 = hour % 12 || 12
    return `${hour12}:${minutes} ${ampm}`
  }

  function getColorValue(color) {
    const colorMap = {
      blue: "var(--event-blue)",
      purple: "var(--event-purple)",
      pink: "var(--event-pink)",
      green: "var(--event-green)",
      orange: "var(--event-orange)",
    }
    return colorMap[color] || colorMap.blue
  }

  function getPriorityText(priority) {
    const priorityMap = {
      low: "Low Priority",
      medium: "Medium Priority",
      high: "High Priority",
    }
    return priorityMap[priority] || "Medium Priority"
  }
})

document.addEventListener('DOMContentLoaded', function() {
  // Get reference to confirm modal elements
  const confirmModal = document.getElementById('confirm-modal');
  const confirmMessage = document.getElementById('confirm-message');
  const confirmDeleteBtn = document.getElementById('confirm-delete');
  const cancelConfirmBtn = document.getElementById('cancel-confirm');
  const closeConfirmModalBtn = document.getElementById('close-confirm-modal');
  
  let departmentToDelete = null;

  // Set up listeners for the confirmation modal
  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener('click', function() {
      if (departmentToDelete) {
        deleteDepartment(departmentToDelete);
      }
    });
  }

  if (cancelConfirmBtn) {
    cancelConfirmBtn.addEventListener('click', closeConfirmModal);
  }

  if (closeConfirmModalBtn) {
    closeConfirmModalBtn.addEventListener('click', closeConfirmModal);
  }
  
  // Connect to your existing delete buttons
  // This uses event delegation to capture clicks on all delete buttons
  document.addEventListener('click', function(e) {
    // Find if a delete button was clicked (adjust the selector if necessary)
    if (e.target && (e.target.classList.contains('delete-department-btn') || 
                     e.target.closest('.delete-department-btn'))) {
      e.preventDefault();
      e.stopPropagation(); // Prevent tab selection
      
      // Find the department tab element
      const tab = e.target.closest('.department-tab');
      if (!tab) return;
      
      // Get department ID and name
      const departmentId = tab.getAttribute('data-department-id');
      const departmentName = tab.querySelector('.tab-name')?.textContent.trim() || 
                           tab.textContent.trim();
      
      // Show delete confirmation
      showDeleteConfirmation(departmentId, departmentName);
    }
  });

  // Function to show delete confirmation modal
  function showDeleteConfirmation(departmentId, departmentName) {
    departmentToDelete = departmentId;
    confirmMessage.textContent = `Are you sure you want to delete the "${departmentName}" department? This will also delete all associated events and tasks.`;
    confirmModal.style.display = 'flex';
  }

  // Function to close the confirmation modal
  function closeConfirmModal() {
    confirmModal.style.display = 'none';
    departmentToDelete = null;
  }

  // Function to delete department
  async function deleteDepartment(departmentId) {
    try {
        const response = await fetch(`http://localhost:8080/api/departments/${departmentId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            // Remove department from local state
            departments = departments.filter(dept => dept.id !== departmentId);
            
            // Remove department's events from local state
            events = events.filter(event => event.departmentId !== departmentId);
            
            // Update UI
            saveDepartmentsToStorage();
            saveEventsToStorage();
            renderDepartmentTabs();
            renderCalendar(currentDate);
            updateEventsList();
            
            // If the deleted department was active, switch to "All Departments"
            if (activeDepartmentId === departmentId) {
                setActiveDepartment("all");
            }
            
            // Close the confirmation modal
            document.getElementById("confirm-modal").style.display = "none";
            
            alert("Department deleted successfully");
        } else {
            throw new Error("Failed to delete department");
        }
    } catch (error) {
        console.error("Error deleting department:", error);
        alert("Failed to delete department. Please try again.");
    }
  }
});

// Function to populate department dropdown
function populateDepartmentDropdowns() {
fetch('/api/departments')
    .then(response => response.json())
    .then(departments => {
        // For event form
        const eventDepartmentSelect = document.getElementById('event-department');
        eventDepartmentSelect.innerHTML = '';
        
        // For task form if it exists
        const taskDepartmentSelect = document.getElementById('task-department');
        if (taskDepartmentSelect) {
            taskDepartmentSelect.innerHTML = '';
        }
        
        departments.forEach(department => {
            // For event form
            const option = document.createElement('option');
            option.value = department.id;  // Use ID as the value
            option.textContent = department.name;
            option.dataset.color = department.color;
            eventDepartmentSelect.appendChild(option);
            
            // For task form if it exists
            if (taskDepartmentSelect) {
                const taskOption = document.createElement('option');
                taskOption.value = department.id;  // Use ID as the value
                taskOption.textContent = department.name;
                taskOption.dataset.color = department.color;
                taskDepartmentSelect.appendChild(taskOption);
            }
        });
    })
    .catch(error => {
        console.error('Error loading departments:', error);
    });
}

// Function to show event details
function showEventDetails(event) {
// Populate event details modal
document.getElementById('detail-event-title').textContent = event.title;

// Format the date
const dateObj = new Date(event.date);
const formattedDate = dateObj.toLocaleDateString('en-US', { 
    weekday: 'long',
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
});
document.getElementById('detail-event-date').textContent = formattedDate;

// Format the time
document.getElementById('detail-event-time').textContent = formatTime(event.time);

// Set department name
const departmentName = event.department ? event.department.name : 'No Department';
document.getElementById('detail-event-department').textContent = departmentName;

// Set description
document.getElementById('detail-event-description').textContent = 
    event.description ? event.description : 'No description provided.';

// Set the event ID on the delete button for reference
document.getElementById('delete-event').dataset.eventId = event.id;

// Open the modal
openModal('event-details-modal');
}

// Delete event handler
document.getElementById('delete-event').addEventListener('click', function() {
const eventId = this.dataset.eventId;

fetch(`/api/events/${eventId}`, {
    method: 'DELETE'
})
.then(response => {
    if (!response.ok) {
        throw new Error('Failed to delete event');
    }
    
    // Close the modal
    closeModal('event-details-modal');
    
    // Refresh events
    loadEvents();
    
    // Show success notificationF
    showNotification('Event deleted successfully', 'success');
})
.catch(error => {
    console.error('Error:', error);
    showNotification('Failed to delete event', 'error');
});
});