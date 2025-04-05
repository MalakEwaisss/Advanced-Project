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
    const eventModal = document.getElementById("event-modal")
    const eventDetailsModal = document.getElementById("event-details-modal")
    const closeModalBtn = document.querySelector(".close-modal")
    const closeDetailsModalBtn = document.getElementById("close-details-modal")
    const cancelEventBtn = document.getElementById("cancel-event")
    const eventForm = document.getElementById("event-form")
    const colorOptions = document.querySelectorAll(".color-option")
    const eventColorInput = document.getElementById("event-color")
    const editEventBtn = document.getElementById("edit-event")
    const deleteEventBtn = document.getElementById("delete-event")
    const addEventBtn = document.getElementById("add-event-btn")

    // State
    let currentDate = new Date()
    let selectedDate = new Date()
    let events = [
        {
            id: "1",
            title: "Project Due",
            date: "2025-03-30",  
            time: "23:59",
            description: "Submit React.js web app to GitHub",
            color: "blue",
            user: "Alex Chen"
        },
        {
            id: "2",
            title: "Lab Report",
            date: "2025-04-03", 
            time: "14:00",
            description: "Complete cardiac system diagrams",
            color: "purple",
            user: "Jamal Ahmed"
        },
        {
            id: "3",
            title: "Midterm Exam",
            date: "2025-04-07",  
            time: "11:00",
            description: "Computer Science 101 - Hall B",
            color: "green",
            user: "Dr. Smith"
        },
        {
            id: "4",
            title: "Math HW",
            date: "2025-04-09",
            time: "17:00",
            description: "Problems 5.1-5.7 from textbook",
            color: "orange",
            user: "Ethan Park"
        },
        {
            id: "5",
            title: "Portfolio Review",
            date: "2025-04-11",
            time: "13:00",
            description: "Prepare 10 pieces for critique",
            color: "pink",
            user: "Maya Patel"
        },
        {
            id: "6",
            title: "Court Prep",
            date: "2025-04-13",
            time: "15:30",
            description: "Research precedents for Mock Trial",
            color: "blue",
            user: "Daniel Kim"
        },
        {
            id: "7",
            title: "Research Draft",
            date: "2025-04-15",
            time: "21:00",
            description: "First draft on cognitive bias study",
            color: "purple",
            user: "Olivia Mbeki"
        },
        {
            id: "8",
            title: "Studio Model",  
            date: "2025-04-19",    
            time: "10:00",
            description: "Complete 3D printed bridge model",
            color: "green",
            user: "Carlos Silva"
        },
        {
            id: "9",
            title: "Composition Submission",
            date: "2025-04-23",
            time: "23:59",
            description: "Original piece for jury review",
            color: "orange",
            user: "Aisha Johnson"
        },
        {
            id: "10",
            title: "Lab Notebook Check",
            date: "2025-05-01",
            time: "08:00",
            description: "Update all microscopy observations",
            color: "pink",
            user: "Ryan Zhang"
        }
    ]
    let selectedColor = "blue"
    let currentEventId = null

    // Initialize
    initCalendar()

    function initCalendar() {
        renderCalendar(currentDate)
        renderMiniCalendar(currentDate)

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
        })

        closeModalBtn.addEventListener("click", () => {
            closeEventModal()
        })

        closeDetailsModalBtn.addEventListener("click", () => {
            closeEventDetailsModal()
        })

        cancelEventBtn.addEventListener("click", () => {
            closeEventModal()
        })

        eventForm.addEventListener("submit", (e) => {
            e.preventDefault()
            saveEvent()
        })

        colorOptions.forEach((option) => {
            option.addEventListener("click", () => {
                colorOptions.forEach((opt) => opt.classList.remove("selected"))
                option.classList.add("selected")
                selectedColor = option.getAttribute("data-color")
                eventColorInput.value = selectedColor
            })
        })

        editEventBtn.addEventListener("click", () => {
            const event = events.find((e) => e.id === currentEventId)
            if (event) {
                closeEventDetailsModal()
                openEventModal(event)
            }
        })

        deleteEventBtn.addEventListener("click", () => {
            if (currentEventId) {
                events = events.filter((event) => event.id !== currentEventId)
                closeEventDetailsModal()
                renderCalendar(currentDate)
                renderMiniCalendar(currentDate)
            }
        })

        addEventBtn.addEventListener("click", () => {
            openEventModal()
        })
    }

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
        const dayEvents = events.filter((event) => {
            const eventDate = new Date(event.date)
            return (
                eventDate.getDate() === date.getDate() &&
                eventDate.getMonth() === date.getMonth() &&
                eventDate.getFullYear() === date.getFullYear()
            )
        })

        dayEvents.forEach((event) => {
            const eventElement = document.createElement("div")
            eventElement.classList.add("event", event.color)
            eventElement.textContent = event.title
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
        const hasEvents = events.some((event) => {
            const eventDate = new Date(event.date)
            return (
                eventDate.getDate() === date.getDate() &&
                eventDate.getMonth() === date.getMonth() &&
                eventDate.getFullYear() === date.getFullYear()
            )
        })

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
        })

        miniCalendarDays.appendChild(day)
    }

    function openEventModal(event = null) {
        eventModal.classList.add("active")

        if (event) {
            // Edit mode
            document.querySelector(".modal-header h3").textContent = "Edit Event"
            document.getElementById("event-title").value = event.title
            document.getElementById("event-date").value = event.date
            document.getElementById("event-time").value = event.time
            document.getElementById("event-description").value = event.description || ""
            document.getElementById("event-color").value = event.color

            colorOptions.forEach((option) => {
                option.classList.remove("selected")
                if (option.getAttribute("data-color") === event.color) {
                    option.classList.add("selected")
                }
            })

            currentEventId = event.id
        } else {
            // Add mode
            document.querySelector(".modal-header h3").textContent = "Add New Event"
            eventForm.reset()
            currentEventId = generateId()

            // Set default date to selected date
            const year = selectedDate.getFullYear()
            const month = String(selectedDate.getMonth() + 1).padStart(2, "0")
            const day = String(selectedDate.getDate()).padStart(2, "0")
            document.getElementById("event-date").value = `${year}-${month}-${day}`

            // Set default color
            colorOptions.forEach((option) => {
                option.classList.remove("selected")
                if (option.getAttribute("data-color") === "blue") {
                    option.classList.add("selected")
                }
            })
            document.getElementById("event-color").value = "blue"
        }
    }

    function closeEventModal() {
        eventModal.classList.remove("active")
        eventForm.reset()
        currentEventId = null
    }

    function openEventDetailsModal(event) {
        eventDetailsModal.classList.add("active")

        document.getElementById("detail-event-title").textContent = event.title
        document.getElementById("detail-event-date").textContent = formatDate(new Date(event.date))
        document.getElementById("detail-event-time").textContent = formatTime(event.time)
        document.getElementById("detail-event-user").textContent = event.user || "Unknown User"
        document.getElementById("detail-event-description").textContent = event.description || "No description provided"

        currentEventId = event.id
    }

    function closeEventDetailsModal() {
        eventDetailsModal.classList.remove("active")
        currentEventId = null
    }

    function saveEvent() {
        const title = document.getElementById("event-title").value
        const date = document.getElementById("event-date").value
        const time = document.getElementById("event-time").value
        const description = document.getElementById("event-description").value
        const color = eventColorInput.value

        if (currentEventId) {
            // Update existing event or add new one
            const eventIndex = events.findIndex((e) => e.id === currentEventId)
            if (eventIndex !== -1) {
                // Update existing
                const user = events[eventIndex].user || "Admin"
                events[eventIndex] = {
                    ...events[eventIndex],
                    title,
                    date,
                    time,
                    description,
                    color,
                    user
                }
            } else {
                // Add new
                events.push({
                    id: currentEventId,
                    title,
                    date,
                    time,
                    description,
                    color,
                    user: "Admin"
                })
            }
        }

        closeEventModal()
        renderCalendar(currentDate)
        renderMiniCalendar(currentDate)
    }

    function generateId() {
        return Date.now().toString()
    }

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
        const options = { weekday: "long", month: "long", day: "numeric", year: "numeric" }
        return date.toLocaleDateString("en-US", options)
    }

    function formatTime(timeString) {
        const [hours, minutes] = timeString.split(":")
        const hour = Number.parseInt(hours)
        const ampm = hour >= 12 ? "PM" : "AM"
        const hour12 = hour % 12 || 12
        return `${hour12}:${minutes} ${ampm}`
    }
})