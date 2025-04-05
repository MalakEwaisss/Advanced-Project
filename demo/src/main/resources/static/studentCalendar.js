document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const calendarDays = document.getElementById("calendar-days");
  const miniCalendarDays = document.getElementById("mini-calendar-days");
  const currentMonthYear = document.getElementById("current-month-year");
  const miniMonthYear = document.getElementById("mini-month-year");
  const prevMonthBtn = document.getElementById("prev-month-btn");
  const nextMonthBtn = document.getElementById("next-month-btn");
  const miniPrevMonthBtn = document.getElementById("mini-prev-month");
  const miniNextMonthBtn = document.getElementById("mini-next-month");
  const todayBtn = document.getElementById("today-btn");
  const newEventBtn = document.getElementById("new-event-btn");
  const eventModal = document.getElementById("event-modal");
  const eventDetailsModal = document.getElementById("event-details-modal");
  const closeModalBtn = document.querySelector(".close-modal");
  const closeDetailsModalBtn = document.getElementById("close-details-modal");
  const cancelEventBtn = document.getElementById("cancel-event");
  const eventForm = document.getElementById("event-form");
  const eventsList = document.getElementById("events-list");
  const eventDateInput = document.getElementById("event-date");
  const colorOptions = document.querySelectorAll(".color-option");
  const eventColorInput = document.getElementById("event-color");
  const tabButtons = document.querySelectorAll(".tab-btn");
  const editEventBtn = document.getElementById("edit-event");
  const deleteEventBtn = document.getElementById("delete-event");
  const addTaskBtn = document.getElementById("add-task-btn");
  const taskModal = document.getElementById("task-modal");
  const taskForm = document.getElementById("task-form");
  const taskDateInput = document.getElementById("task-date");
  const closeTaskModalBtn = document.getElementById("close-task-modal");
  const cancelTaskBtn = document.getElementById("cancel-task");

  // State
  let currentDate = new Date();
  let selectedDate = new Date();
  let events = [];
  let selectedColor = "blue";
  let currentEventId = null;

  function loadTasksFromLocalStorage() {
    const localTasks = localStorage.getItem("tasks");
    if (localTasks) {
        events = JSON.parse(localTasks);
    } else {
        events = [];
    }
    renderCalendar(currentDate);
    renderMiniCalendar(currentDate);
    updateEventsList();
  }

  // Initialize
  initCalendar();

  function initCalendar() {
    renderCalendar(currentDate);
    renderMiniCalendar(currentDate);
    loadEventsFromBackend();
    loadTasksFromLocalStorage();

    // Event Listeners
    prevMonthBtn.addEventListener("click", () => {
      currentDate.setMonth(currentDate.getMonth() - 1);
      renderCalendar(currentDate);
      renderMiniCalendar(currentDate);
    });

    nextMonthBtn.addEventListener("click", () => {
      currentDate.setMonth(currentDate.getMonth() + 1);
      renderCalendar(currentDate);
      renderMiniCalendar(currentDate);
    });

    miniPrevMonthBtn.addEventListener("click", () => {
      currentDate.setMonth(currentDate.getMonth() - 1);
      renderCalendar(currentDate);
      renderMiniCalendar(currentDate);
    });

    miniNextMonthBtn.addEventListener("click", () => {
      currentDate.setMonth(currentDate.getMonth() + 1);
      renderCalendar(currentDate);
      renderMiniCalendar(currentDate);
    });

    todayBtn.addEventListener("click", () => {
      currentDate = new Date();
      selectedDate = new Date();
      renderCalendar(currentDate);
      renderMiniCalendar(currentDate);
      updateEventsList();
    });

    newEventBtn.addEventListener("click", () => {
      openEventModal();
    });

    addTaskBtn.addEventListener("click", () => {
      openTaskModal();
    });

    closeModalBtn.addEventListener("click", () => {
      closeEventModal();
    });

    closeDetailsModalBtn.addEventListener("click", () => {
      closeEventDetailsModal();
    });

    cancelEventBtn.addEventListener("click", () => {
      closeEventModal();
    });

    eventForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      await saveEventToBackend();
    });

    taskForm.addEventListener("submit", (e) => {
      e.preventDefault();
      saveTaskLocally();
    });

    colorOptions.forEach((option) => {
      option.addEventListener("click", () => {
        colorOptions.forEach((opt) => opt.classList.remove("selected"));
        option.classList.add("selected");
        selectedColor = option.getAttribute("data-color");
        eventColorInput.value = selectedColor;
      });
    });

    tabButtons.forEach((button) => {
      button.addEventListener("click", () => {
        tabButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");
        const tabType = button.getAttribute("data-tab");
        if (tabType === "upcoming") {
          document.querySelector(".events-content h3").textContent = "Upcoming Events";
          document.querySelector(".events-subtitle").textContent = "Your schedule for the next few days";
        } else {
          document.querySelector(".events-content h3").textContent = "Tasks";
          document.querySelector(".events-subtitle").textContent = "Your pending tasks";
        }
        updateEventsList();
      });
    });

    editEventBtn.addEventListener("click", () => {
      const event = events.find((e) => e.id === currentEventId);
      if (event) {
        closeEventDetailsModal();
        if (event.type === "task") {
          openTaskModal(event);
        } else {
          openEventModal(event);
        }
      }
    });

    deleteEventBtn.addEventListener("click", async () => {
      if (currentEventId) {
        const event = events.find(e => e.id === currentEventId);
        if (event && event.type === "task") {
          await deleteTaskFromLocal();
        } else {
          await deleteEventFromBackend();
        }
      }
    });

    closeTaskModalBtn.addEventListener("click", () => {
      closeTaskModal();
    });

    cancelTaskBtn.addEventListener("click", () => {
      closeTaskModal();
    });
  }

  // Backend API Functions
  async function loadEventsFromBackend() {
    try {
      const response = await fetch("http://localhost:8085/events/all");
      if (response.ok) {
        events = await response.json();
        localStorage.setItem("events", JSON.stringify(events));
        renderCalendar(currentDate);
        renderMiniCalendar(currentDate);
        updateEventsList();
      } else {
        console.error("Failed to load events");
      }
    } catch (error) {
      console.error("Error loading events:", error);
      const localEvents = localStorage.getItem("events");
      if (localEvents) {
        events = JSON.parse(localEvents);
        renderCalendar(currentDate);
        renderMiniCalendar(currentDate);
        updateEventsList();
      }
    }
  }

  async function saveEventToBackend() {
    const eventData = {
      title: document.getElementById("event-title").value,
      date: document.getElementById("event-date").value,
      time: document.getElementById("event-time").value,
      description: document.getElementById("event-description").value,
      color: eventColorInput.value
    };

    try {
      let url = "http://localhost:8085/events/add";
      let method = "POST";

      if (currentEventId) {
        url = `http://localhost:8085/events/update/${currentEventId}`;
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
        await loadEventsFromBackend();
        closeEventModal();
      } else {
        alert("Failed to save event");
      }
    } catch (error) {
      console.error("Error saving event:", error);
      alert("Error saving event");
    }
  }

  async function deleteEventFromBackend() {
    try {
      const response = await fetch(`http://localhost:8085/events/delete/${currentEventId}`, {
        method: "DELETE"
      });

      if (response.ok) {
        await loadEventsFromBackend();
        closeEventDetailsModal();
      } else {
        alert("Failed to delete event");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Error deleting event");
    }
  }

  // Calendar Rendering Functions
  function renderCalendar(date) {
    const year = date.getFullYear();
    const month = date.getMonth();

    currentMonthYear.textContent = `${getMonthName(month)} ${year}`;
    calendarDays.innerHTML = "";

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const firstDayIndex = firstDay.getDay();
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    const daysInMonth = lastDay.getDate();
    const lastDayIndex = lastDay.getDay();
    const nextDays = 6 - lastDayIndex;

    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const day = prevMonthLastDay - i;
      const dayDate = new Date(year, month - 1, day);
      addDayToCalendar(dayDate, true);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const dayDate = new Date(year, month, i);
      addDayToCalendar(dayDate);
    }

    for (let i = 1; i <= nextDays; i++) {
      const dayDate = new Date(year, month + 1, i);
      addDayToCalendar(dayDate, true);
    }
  }

  function renderMiniCalendar(date) {
    const year = date.getFullYear();
    const month = date.getMonth();

    miniMonthYear.textContent = `${getMonthName(month)} ${year}`;
    miniCalendarDays.innerHTML = "";

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const firstDayIndex = firstDay.getDay();
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    const daysInMonth = lastDay.getDate();
    const lastDayIndex = lastDay.getDay();
    const nextDays = 6 - lastDayIndex;

    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const day = prevMonthLastDay - i;
      const dayDate = new Date(year, month - 1, day);
      addDayToMiniCalendar(dayDate, true);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const dayDate = new Date(year, month, i);
      addDayToMiniCalendar(dayDate);
    }

    for (let i = 1; i <= nextDays; i++) {
      const dayDate = new Date(year, month + 1, i);
      addDayToMiniCalendar(dayDate, true);
    }
  }

  function addDayToCalendar(date, isOtherMonth = false) {
    const day = document.createElement("div");
    day.classList.add("day");

    if (isOtherMonth) {
      day.classList.add("other-month");
    }

    const today = new Date();
    if (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    ) {
      day.classList.add("today");
    }

    if (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    ) {
      day.classList.add("selected");
    }

    const dayNumber = document.createElement("div");
    dayNumber.classList.add("day-number");
    dayNumber.textContent = date.getDate();
    day.appendChild(dayNumber);

    const dayEvents = events.filter((event) => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });

    dayEvents.forEach((event) => {
      const eventElement = document.createElement("div");
      if (event.type === "task") {
        eventElement.classList.add("event", "task", event.priority);
        eventElement.textContent = `${event.title} (${getPriorityText(event.priority)})`;
      } else {
        eventElement.classList.add("event", event.color);
        eventElement.textContent = event.title;
      }
      day.appendChild(eventElement);

      eventElement.addEventListener("click", (e) => {
        e.stopPropagation();
        openEventDetailsModal(event);
      });
    });

    day.addEventListener("click", () => {
      document.querySelectorAll(".day").forEach((d) => d.classList.remove("selected"));
      document.querySelectorAll(".mini-day").forEach((d) => d.classList.remove("selected"));
      day.classList.add("selected");

      selectedDate = new Date(date);
      updateEventsList();
      renderMiniCalendar(currentDate);
    });

    calendarDays.appendChild(day);
  }

  function addDayToMiniCalendar(date, isOtherMonth = false) {
    const day = document.createElement("div");
    day.classList.add("mini-day");
    day.textContent = date.getDate();

    if (isOtherMonth) {
      day.classList.add("other-month");
    }

    const today = new Date();
    if (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    ) {
      day.classList.add("today");
    }

    if (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    ) {
      day.classList.add("selected");
    }

    const hasEvents = events.some((event) => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });

    if (hasEvents) {
      day.classList.add("has-events");
    }

    day.addEventListener("click", () => {
      document.querySelectorAll(".day").forEach((d) => d.classList.remove("selected"));
      document.querySelectorAll(".mini-day").forEach((d) => d.classList.remove("selected"));
      day.classList.add("selected");

      selectedDate = new Date(date);
      currentDate = new Date(date.getFullYear(), date.getMonth(), 1);

      renderCalendar(currentDate);
      updateEventsList();
    });

    miniCalendarDays.appendChild(day);
  }

  function updateEventsList() {
    eventsList.innerHTML = "";

    const activeTab = document.querySelector(".tab-btn.active").getAttribute("data-tab");

    let filteredEvents = [];
    if (activeTab === "upcoming") {
      filteredEvents = events.filter((event) => {
        const eventDate = new Date(event.date);
        return (
          eventDate.getDate() === selectedDate.getDate() &&
          eventDate.getMonth() === selectedDate.getMonth() &&
          eventDate.getFullYear() === selectedDate.getFullYear()
        );
      });
    } else {
      filteredEvents = events.filter((event) => event.type === "task");
    }

    if (filteredEvents.length === 0) {
      const noEvents = document.createElement("p");
      noEvents.textContent = activeTab === "upcoming" ? "No events scheduled for this day" : "No pending tasks";
      noEvents.style.color = "var(--text-secondary)";
      noEvents.style.textAlign = "center";
      noEvents.style.padding = "1rem 0";
      eventsList.appendChild(noEvents);
      return;
    }

    filteredEvents.sort((a, b) => {
      return new Date(a.date) - new Date(b.date) || a.time.localeCompare(b.time);
    });

    filteredEvents.forEach((event) => {
      const eventItem = document.createElement("div");
      eventItem.classList.add("event-item");

      const eventItemHeader = document.createElement("div");
      eventItemHeader.classList.add("event-item-header");

      const eventDate = document.createElement("div");
      eventDate.classList.add("event-date");
      eventDate.textContent = formatDate(new Date(event.date));

      eventItemHeader.appendChild(eventDate);
      eventItem.appendChild(eventItemHeader);

      const eventTitle = document.createElement("div");
      eventTitle.classList.add("event-title");

      const eventBadge = document.createElement("span");
      if (event.type === "task") {
        eventBadge.classList.add("event-badge", "task", event.priority);
      } else {
        eventBadge.classList.add("event-badge");
        eventBadge.style.backgroundColor = getColorValue(event.color);
      }

      eventTitle.appendChild(eventBadge);
      eventTitle.appendChild(document.createTextNode(event.title));
      eventItem.appendChild(eventTitle);

      if (event.type === "task") {
        const eventPriority = document.createElement("div");
        eventPriority.classList.add("event-priority", event.priority);
        eventPriority.textContent = getPriorityText(event.priority);
        eventItem.appendChild(eventPriority);
      } else {
        const eventTime = document.createElement("div");
        eventTime.classList.add("event-time");
        eventTime.textContent = formatTime(event.time);
        eventItem.appendChild(eventTime);
      }

      eventItem.addEventListener("click", () => {
        openEventDetailsModal(event);
      });

      eventsList.appendChild(eventItem);
    });
  }

  function openEventModal(event = null) {
    eventModal.classList.add("active");

    if (event) {
      document.querySelector(".modal-header h3").textContent = "Edit Event";
      document.getElementById("event-title").value = event.title;
      document.getElementById("event-date").value = event.date.split('T')[0];
      document.getElementById("event-time").value = event.time;
      document.getElementById("event-description").value = event.description || "";
      document.getElementById("event-color").value = event.color;

      colorOptions.forEach((option) => {
        option.classList.remove("selected");
        if (option.getAttribute("data-color") === event.color) {
          option.classList.add("selected");
        }
      });

      currentEventId = event.id;
    } else {
      document.querySelector(".modal-header h3").textContent = "Add New Event";
      eventForm.reset();
      currentEventId = null;

      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const day = String(selectedDate.getDate()).padStart(2, "0");
      eventDateInput.value = `${year}-${month}-${day}`;

      colorOptions.forEach((option) => {
        option.classList.remove("selected");
        if (option.getAttribute("data-color") === "blue") {
          option.classList.add("selected");
        }
      });
      eventColorInput.value = "blue";
    }
  }

  function openTaskModal(task = null) {
    taskModal.classList.add("active");

    if (task) {
      document.querySelector("#task-modal .modal-header h3").textContent = "Edit Task";
      document.getElementById("task-title").value = task.title;
      document.getElementById("task-date").value = task.date;
      document.getElementById("task-priority").value = task.priority || "medium";
      document.getElementById("task-description").value = task.description || "";
      currentEventId = task.id;
    } else {
      document.querySelector("#task-modal .modal-header h3").textContent = "Add New Task";
      taskForm.reset();
      currentEventId = null;

      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const day = String(selectedDate.getDate()).padStart(2, "0");
      taskDateInput.value = `${year}-${month}-${day}`;
      document.getElementById("task-priority").value = "medium";
    }
  }

  function closeEventModal() {
    eventModal.classList.remove("active");
    eventForm.reset();
    currentEventId = null;
  }

  function closeTaskModal() {
    taskModal.classList.remove("active");
    taskForm.reset();
    currentEventId = null;
  }

  function openEventDetailsModal(event) {
    eventDetailsModal.classList.add("active");

    document.getElementById("detail-event-title").textContent = event.title;
    document.getElementById("detail-event-date").textContent = formatDate(new Date(event.date));
    
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

    document.getElementById("detail-event-description").textContent = event.description || "No description provided";
    currentEventId = event.id;
  }

  function closeEventDetailsModal() {
    eventDetailsModal.classList.remove("active");
    currentEventId = null;
  }

  function saveTaskLocally() {
    const taskData = {
      id: currentEventId || "task_" + Date.now(),
      title: document.getElementById("task-title").value,
      date: document.getElementById("task-date").value,
      time: "09:00",
      description: document.getElementById("task-description").value,
      priority: document.getElementById("task-priority").value || "medium",
      type: "task",
      color: "blue"
    };

    if (currentEventId) {
      const taskIndex = events.findIndex(e => e.id === currentEventId);
      if (taskIndex !== -1) {
        events[taskIndex] = taskData;
      }
    } else {
      events.push(taskData);
    }

    localStorage.setItem("tasks", JSON.stringify(events));
    renderCalendar(currentDate);
    renderMiniCalendar(currentDate);
    updateEventsList();
    closeTaskModal();
  }

  async function deleteTaskFromLocal() {
    if (currentEventId) {
      events = events.filter(task => task.id !== currentEventId);
      localStorage.setItem("tasks", JSON.stringify(events));
      renderCalendar(currentDate);
      renderMiniCalendar(currentDate);
      updateEventsList();
      closeEventDetailsModal();
    }
  }

  // Helper Functions
  function getMonthName(month) {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return months[month];
  }

  function formatDate(date) {
    const options = { weekday: "long", month: "long", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  }

  function formatTime(timeString) {
    const [hours, minutes] = timeString.split(":");
    const hour = Number.parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  }

  function getColorValue(color) {
    const colorMap = {
      blue: "var(--event-blue)",
      purple: "var(--event-purple)",
      pink: "var(--event-pink)",
      green: "var(--event-green)",
      orange: "var(--event-orange)",
    };
    return colorMap[color] || colorMap.blue;
  }

  function getPriorityText(priority) {
    const priorityMap = {
      low: "Low Priority",
      medium: "Medium Priority",
      high: "High Priority",
    };
    return priorityMap[priority] || "Medium Priority";
  }
});