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

  // State
  let currentDate = new Date();
  let selectedDate = new Date();
  let events = [];
  let selectedColor = "blue";
  let currentEventId = null;

  // Initialize
  initCalendar();

  function initCalendar() {
      renderCalendar(currentDate);
      renderMiniCalendar(currentDate);
      loadEventsFromBackend();

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
              openEventModal(event);
          }
      });

      deleteEventBtn.addEventListener("click", async () => {
          if (currentEventId) {
              await deleteEventFromBackend();
          }
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
          // Fallback to localStorage if API fails
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

      // Update header
      currentMonthYear.textContent = `${getMonthName(month)} ${year}`;

      // Clear previous days
      calendarDays.innerHTML = "";

      // Get first day of month and last day of month
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);

      // Get days from previous month
      const firstDayIndex = firstDay.getDay();
      const prevMonthLastDay = new Date(year, month, 0).getDate();

      // Get days in current month
      const daysInMonth = lastDay.getDate();

      // Get days from next month
      const lastDayIndex = lastDay.getDay();
      const nextDays = 6 - lastDayIndex;

      // Previous month days
      for (let i = firstDayIndex - 1; i >= 0; i--) {
          const day = prevMonthLastDay - i;
          const dayDate = new Date(year, month - 1, day);
          addDayToCalendar(dayDate, true);
      }

      // Current month days
      for (let i = 1; i <= daysInMonth; i++) {
          const dayDate = new Date(year, month, i);
          addDayToCalendar(dayDate);
      }

      // Next month days
      for (let i = 1; i <= nextDays; i++) {
          const dayDate = new Date(year, month + 1, i);
          addDayToCalendar(dayDate, true);
      }
  }

  function renderMiniCalendar(date) {
      const year = date.getFullYear();
      const month = date.getMonth();

      // Update header
      miniMonthYear.textContent = `${getMonthName(month)} ${year}`;

      // Clear previous days
      miniCalendarDays.innerHTML = "";

      // Get first day of month and last day of month
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);

      // Get days from previous month
      const firstDayIndex = firstDay.getDay();
      const prevMonthLastDay = new Date(year, month, 0).getDate();

      // Get days in current month
      const daysInMonth = lastDay.getDate();

      // Get days from next month
      const lastDayIndex = lastDay.getDay();
      const nextDays = 6 - lastDayIndex;

      // Previous month days
      for (let i = firstDayIndex - 1; i >= 0; i--) {
          const day = prevMonthLastDay - i;
          const dayDate = new Date(year, month - 1, day);
          addDayToMiniCalendar(dayDate, true);
      }

      // Current month days
      for (let i = 1; i <= daysInMonth; i++) {
          const dayDate = new Date(year, month, i);
          addDayToMiniCalendar(dayDate);
      }

      // Next month days
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

      // Check if day is today
      const today = new Date();
      if (
          date.getDate() === today.getDate() &&
          date.getMonth() === today.getMonth() &&
          date.getFullYear() === today.getFullYear()
      ) {
          day.classList.add("today");
      }

      // Check if day is selected
      if (
          date.getDate() === selectedDate.getDate() &&
          date.getMonth() === selectedDate.getMonth() &&
          date.getFullYear() === selectedDate.getFullYear()
      ) {
          day.classList.add("selected");
      }

      // Add day number
      const dayNumber = document.createElement("div");
      dayNumber.classList.add("day-number");
      dayNumber.textContent = date.getDate();
      day.appendChild(dayNumber);

      // Add events for this day
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
          eventElement.classList.add("event", event.color);
          eventElement.textContent = event.title;
          day.appendChild(eventElement);

          eventElement.addEventListener("click", (e) => {
              e.stopPropagation();
              openEventDetailsModal(event);
          });
      });

      // Add click event
      day.addEventListener("click", () => {
          document.querySelectorAll(".day").forEach((d) => d.classList.remove("selected"));
          document.querySelectorAll(".mini-day").forEach((d) => d.classList.remove("selected"));
          day.classList.add("selected");

          selectedDate = new Date(date);
          updateEventsList();

          // Update mini calendar
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

      // Check if day is today
      const today = new Date();
      if (
          date.getDate() === today.getDate() &&
          date.getMonth() === today.getMonth() &&
          date.getFullYear() === today.getFullYear()
      ) {
          day.classList.add("today");
      }

      // Check if day is selected
      if (
          date.getDate() === selectedDate.getDate() &&
          date.getMonth() === selectedDate.getMonth() &&
          date.getFullYear() === selectedDate.getFullYear()
      ) {
          day.classList.add("selected");
      }

      // Check if day has events
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

      // Add click event
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
          // Get events for the selected date
          filteredEvents = events.filter((event) => {
              const eventDate = new Date(event.date);
              return (
                  eventDate.getDate() === selectedDate.getDate() &&
                  eventDate.getMonth() === selectedDate.getMonth() &&
                  eventDate.getFullYear() === selectedDate.getFullYear()
              );
          });
      } else {
          // Get tasks (could be filtered differently)
          filteredEvents = events.filter((event) => {
              const eventDate = new Date(event.date);
              const today = new Date();
              return eventDate >= today;
          });
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

      // Sort events by time
      filteredEvents.sort((a, b) => {
          return a.time.localeCompare(b.time);
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
          eventBadge.classList.add("event-badge");
          eventBadge.style.backgroundColor = getColorValue(event.color);

          eventTitle.appendChild(eventBadge);
          eventTitle.appendChild(document.createTextNode(event.title));
          eventItem.appendChild(eventTitle);

          const eventTime = document.createElement("div");
          eventTime.classList.add("event-time");
          eventTime.textContent = formatTime(event.time);
          eventItem.appendChild(eventTime);

          eventItem.addEventListener("click", () => {
              openEventDetailsModal(event);
          });

          eventsList.appendChild(eventItem);
      });
  }

  function openEventModal(event = null) {
      eventModal.classList.add("active");

      if (event) {
          // Edit mode
          document.querySelector(".modal-header h3").textContent = "Edit Event";
          document.getElementById("event-title").value = event.title;
          document.getElementById("event-date").value = event.date.split('T')[0]; // Format date for input
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
          // Add mode
          document.querySelector(".modal-header h3").textContent = "Add New Event";
          eventForm.reset();
          currentEventId = null;

          // Set default date to selected date
          const year = selectedDate.getFullYear();
          const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
          const day = String(selectedDate.getDate()).padStart(2, "0");
          eventDateInput.value = `${year}-${month}-${day}`;

          // Set default color
          colorOptions.forEach((option) => {
              option.classList.remove("selected");
              if (option.getAttribute("data-color") === "blue") {
                  option.classList.add("selected");
              }
          });
          eventColorInput.value = "blue";
      }
  }

  function closeEventModal() {
      eventModal.classList.remove("active");
      eventForm.reset();
      currentEventId = null;
  }

  function openEventDetailsModal(event) {
      eventDetailsModal.classList.add("active");

      document.getElementById("detail-event-title").textContent = event.title;
      document.getElementById("detail-event-date").textContent = formatDate(new Date(event.date));
      document.getElementById("detail-event-time").textContent = formatTime(event.time);
      document.getElementById("detail-event-description").textContent = event.description || "No description provided";

      currentEventId = event.id;
  }

  function closeEventDetailsModal() {
      eventDetailsModal.classList.remove("active");
      currentEventId = null;
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
});