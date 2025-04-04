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
    const eventModal = document.getElementById("event-modal")
    const taskModal = document.getElementById("task-modal")
    const eventDetailsModal = document.getElementById("event-details-modal")
    const closeModalBtn = document.querySelector(".close-modal")
    const closeDetailsModalBtn = document.getElementById("close-details-modal")
    const closeTaskModalBtn = document.getElementById("close-task-modal")
    const cancelEventBtn = document.getElementById("cancel-event")
    const cancelTaskBtn = document.getElementById("cancel-task")
    const eventForm = document.getElementById("event-form")
    const taskForm = document.getElementById("task-form")
    const eventsList = document.getElementById("events-list")
    const eventDateInput = document.getElementById("event-date")
    const taskDateInput = document.getElementById("task-date")
    const colorOptions = document.querySelectorAll(".color-option")
    const eventColorInput = document.getElementById("event-color")
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
  
    // Initialize
    initCalendar()
  
    function initCalendar() {
      // Load departments and events from localStorage or create defaults
      loadEvents()
  
      renderCalendar(currentDate)
      renderMiniCalendar(currentDate)
      updateEventsList()
  
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
  
      closeModalBtn.addEventListener("click", () => {
        closeEventModal()
      })
  
      closeDetailsModalBtn.addEventListener("click", () => {
        closeEventDetailsModal()
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
  
      eventForm.addEventListener("submit", (e) => {
        e.preventDefault()
        saveEvent()
      })
  
      taskForm.addEventListener("submit", (e) => {
        e.preventDefault()
        saveTask()
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
  
    // Event Functions
    function loadEvents() {
      const storedEvents = localStorage.getItem("events")
      if (storedEvents) {
        events = JSON.parse(storedEvents)
      } else {
        // Create sample events if none exist
        const today = new Date()
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)
  
        events = [
          {
            id: "event1",
            title: "Marketing Meeting",
            date: formatDateForInput(today),
            time: "10:00",
            description: "Weekly marketing team sync",
            color: "blue",
            type: "event",
          },
          {
            id: "event2",
            title: "Code Review",
            date: formatDateForInput(today),
            time: "14:00",
            description: "Review pull requests",
            color: "green",
            type: "event",
          },
          {
            id: "task1",
            title: "Update Documentation",
            date: formatDateForInput(tomorrow),
            time: "09:00",
            description: "Update API documentation",
            priority: "medium",
            type: "task",
          },
        ]
        saveEventsToStorage()
      }
    }
  
    function saveEventsToStorage() {
      localStorage.setItem("events", JSON.stringify(events))
    }
  
    function saveEvent() {
      const eventTitle = document.getElementById("event-title").value
      const eventDate = document.getElementById("event-date").value
      const eventTime = document.getElementById("event-time").value
      const eventDescription = document.getElementById("event-description").value
      const eventColor = document.getElementById("event-color").value
  
      if (!eventTitle || !eventDate || !eventTime ) return
  
      if (currentEventId) {
        // Update existing event
        const eventIndex = events.findIndex((e) => e.id === currentEventId)
        if (eventIndex !== -1) {
          events[eventIndex] = {
            ...events[eventIndex],
            title: eventTitle,
            date: eventDate,
            time: eventTime,
            description: eventDescription,
            color: eventColor,
            type: "event",
          }
        }
      } else {
        // Create new event
        const newEvent = {
          id: "event" + Date.now(),
          title: eventTitle,
          date: eventDate,
          time: eventTime,
          description: eventDescription,
          color: eventColor,
          type: "event",
        }
        events.push(newEvent)
      }
  
      saveEventsToStorage()
      renderCalendar(currentDate)
      renderMiniCalendar(currentDate)
      updateEventsList()
      closeEventModal()
    }
  
    function saveTask() {
      const taskTitle = document.getElementById("task-title").value
      const taskDate = document.getElementById("task-date").value
      const taskPriority = document.getElementById("task-priority").value
      const taskDescription = document.getElementById("task-description").value
  
      if (!taskTitle || !taskDate) return
  
      if (currentEventId) {
        // Update existing task
        const eventIndex = events.findIndex((e) => e.id === currentEventId)
        if (eventIndex !== -1) {
          events[eventIndex] = {
            ...events[eventIndex],
            title: taskTitle,
            date: taskDate,
            time: "09:00", // Default time for tasks
            description: taskDescription,
            priority: taskPriority,
            type: "task",
          }
        }
      } else {
        // Create new task
        const newTask = {
          id: "task" + Date.now(),
          title: taskTitle,
          date: taskDate,
          time: "09:00", // Default time for tasks
          description: taskDescription,
          priority: taskPriority,
          type: "task",
        }
        events.push(newTask)
      }
  
      saveEventsToStorage()
      renderCalendar(currentDate)
      renderMiniCalendar(currentDate)
      updateEventsList()
      closeTaskModal()
    }
  
    function deleteEvent(eventId) {
      events = events.filter((event) => event.id !== eventId)
      saveEventsToStorage()
      renderCalendar(currentDate)
      renderMiniCalendar(currentDate)
      updateEventsList()
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
  
        eventItem.addEventListener("click", () => {
          openEventDetailsModal(event)
        })
  
        eventsList.appendChild(eventItem)
      })
    }
  
    function openEventModal(event = null) {
      eventModal.classList.add("active")
  
      if (event) {
        // Edit mode
        document.querySelector("#event-modal .modal-header h3").textContent = "Edit Event"
        document.getElementById("event-title").value = event.title
        document.getElementById("event-date").value = event.date
        document.getElementById("event-time").value = event.time
        document.getElementById("event-description").value = event.description || ""
        document.getElementById("event-color").value = event.color
  
        document.querySelectorAll("#event-modal .color-option").forEach((option) => {
          option.classList.remove("selected")
          if (option.getAttribute("data-color") === event.color) {
            option.classList.add("selected")
          }
        })
  
        currentEventId = event.id
      } else {
        // Add mode
        document.querySelector("#event-modal .modal-header h3").textContent = "Add New Event"
        eventForm.reset()
        currentEventId = null
  
        // Set default date to selected date
        eventDateInput.value = formatDateForInput(selectedDate)
  
        // Set default color
        document.querySelectorAll("#event-modal .color-option").forEach((option) => {
          option.classList.remove("selected")
          if (option.getAttribute("data-color") === "blue") {
            option.classList.add("selected")
          }
        })
        eventColorInput.value = "blue"
  
        // Set first department as default if available
        if (departments.length > 0 && eventDepartmentSelect.options.length > 0) {
          eventDepartmentSelect.value = eventDepartmentSelect.options[0].value
        }
      }
    }
  
    function openTaskModal(task = null) {
      taskModal.classList.add("active")
  
      if (task) {
        // Edit mode
        document.querySelector("#task-modal .modal-header h3").textContent = "Edit Task"
        document.getElementById("task-title").value = task.title
        document.getElementById("task-date").value = task.date
        document.getElementById("task-priority").value = task.priority
        document.getElementById("task-description").value = task.description || ""
  
        currentEventId = task.id
      } else {
        // Add mode
        document.querySelector("#task-modal .modal-header h3").textContent = "Add New Task"
        taskForm.reset()
        currentEventId = null
  
        // Set default date to selected date
        taskDateInput.value = formatDateForInput(selectedDate)
  
        // Set medium priority as default
        document.getElementById("task-priority").value = "medium"
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
      eventDetailsModal.classList.add("active")
  
     
      document.getElementById("detail-event-title").textContent = event.title
      document.getElementById("detail-event-date").textContent = formatDate(new Date(event.date))
=      document.getElementById("detail-event-description").textContent = event.description || "No description provided"
  
      // Show/hide elements based on event type
      if (event.type === "task") {
        document.getElementById("detail-event-time").parentElement.style.display = "none"
        document.getElementById("detail-event-type").textContent = "Task"
        document.getElementById("detail-task-priority-container").style.display = "flex"
        document.getElementById("detail-task-priority").textContent = getPriorityText(event.priority)
        document.getElementById("detail-task-priority").className = event.priority
      } else {
        document.getElementById("detail-event-time").parentElement.style.display = "flex"
        document.getElementById("detail-event-time").textContent = formatTime(event.time)
        document.getElementById("detail-event-type").textContent = "Event"
        document.getElementById("detail-task-priority-container").style.display = "none"
      }
  
      currentEventId = event.id
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
  
  