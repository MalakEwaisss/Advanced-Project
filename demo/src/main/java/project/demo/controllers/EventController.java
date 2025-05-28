package project.demo.controllers; 
import project.demo.model.Event;
import project.demo.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/events")
public class EventController {

    @Autowired
    private EventRepository eventRepository;

    @GetMapping
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    @GetMapping("/{id}")
    public Event getEventById(@PathVariable Long id) {
        return eventRepository.findById(id).orElse(null);
    }

    @PostMapping
    public Event saveEvent(@RequestBody Event event) {
        return eventRepository.save(event);
    }

    @PutMapping("/{id}")
    public Event updateEvent(@PathVariable Long id, @RequestBody Event eventDetails) {
        Event event = eventRepository.findById(id).orElse(null);
        if (event != null) {
            event.setTitle(eventDetails.getTitle());
            event.setDate(eventDetails.getDate());
            event.setTime(eventDetails.getTime());
            event.setDepartment(eventDetails.getDepartment());
            event.setColor(eventDetails.getColor());
            event.setDescription(eventDetails.getDescription());
            return eventRepository.save(event);
        }
        return null;
    }

   @DeleteMapping("/{id}")
public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
    try {
        eventRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    } catch (EmptyResultDataAccessException e) {
        return ResponseEntity.notFound().build();
    }
}
}