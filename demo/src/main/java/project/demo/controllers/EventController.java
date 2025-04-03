package project.demo.controllers;

import project.demo.models.Event;
import project.demo.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/events")
@CrossOrigin(origins = "*")  
public class EventController {

    @Autowired
    private EventRepository eventRepository;

    // Add an event
    @PostMapping("/add")
    public Event addEvent(@RequestBody Event event) {
        return eventRepository.save(event);
    }

    // Get all events
    @GetMapping("/all")
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    // Get events by date
    @GetMapping("/date/{date}")
    public List<Event> getEventsByDate(@PathVariable String date) {
        return eventRepository.findByDate(LocalDate.parse(date)); // Convert String to LocalDate
    }

    // Delete an event by ID
    @DeleteMapping("/delete/{id}")
    public void deleteEvent(@PathVariable Long id) {
        eventRepository.deleteById(id);
    }
    @PutMapping("/update/{id}")
public Event updateEvent(@PathVariable Long id, @RequestBody Event event) {
    event.setId(id);
    return eventRepository.save(event);
}
}
