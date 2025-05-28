package project.demo.controllers;

import project.demo.model.Event;
import project.demo.repository.EventRepository;
import project.demo.controllers.EventController;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class EventControllerTest {

    @Mock
    private EventRepository eventRepository;

    @InjectMocks
    private EventController eventController;

    private Event sampleEvent;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        System.out.println("\n=== Starting new test ===");
        
        // Create a sample event for testing
        sampleEvent = new Event();
        sampleEvent.setId(1L);
        sampleEvent.setTitle("Team Meeting");
        sampleEvent.setDate(LocalDate.now());
        sampleEvent.setTime(LocalTime.now());
        sampleEvent.setDepartment("IT");
        sampleEvent.setColor("#FF0000");
        sampleEvent.setDescription("Weekly team sync");
    }

    @Test
    void getAllEvents_ShouldReturnAllEvents() {
        System.out.println("Testing: getAllEvents_ShouldReturnAllEvents");
        // Arrange
        Event event2 = new Event();
        event2.setId(2L);
        event2.setTitle("Project Review");
        
        List<Event> expectedEvents = Arrays.asList(sampleEvent, event2);
        when(eventRepository.findAll()).thenReturn(expectedEvents);

        // Act
        List<Event> actualEvents = eventController.getAllEvents();

        // Assert
        assertEquals(expectedEvents.size(), actualEvents.size());
        assertEquals(expectedEvents, actualEvents);
        verify(eventRepository, times(1)).findAll();
        System.out.println("✓ getAllEvents test passed successfully");
    }

    @Test
    void getEventById_WhenEventExists_ShouldReturnEvent() {
        System.out.println("Testing: getEventById_WhenEventExists_ShouldReturnEvent");
        // Arrange
        when(eventRepository.findById(1L)).thenReturn(Optional.of(sampleEvent));

        // Act
        Event foundEvent = eventController.getEventById(1L);

        // Assert
        assertNotNull(foundEvent);
        assertEquals(sampleEvent.getId(), foundEvent.getId());
        assertEquals(sampleEvent.getTitle(), foundEvent.getTitle());
        verify(eventRepository, times(1)).findById(1L);
        System.out.println("✓ getEventById test passed successfully");
    }

    @Test
    void getEventById_WhenEventDoesNotExist_ShouldReturnNull() {
        System.out.println("Testing: getEventById_WhenEventDoesNotExist_ShouldReturnNull");
        // Arrange
        when(eventRepository.findById(999L)).thenReturn(Optional.empty());

        // Act
        Event foundEvent = eventController.getEventById(999L);

        // Assert
        assertNull(foundEvent);
        verify(eventRepository, times(1)).findById(999L);
        System.out.println("✓ getEventById with non-existent ID test passed successfully");
    }

    @Test
    void saveEvent_ShouldSaveAndReturnEvent() {
        System.out.println("Testing: saveEvent_ShouldSaveAndReturnEvent");
        // Arrange
        when(eventRepository.save(any(Event.class))).thenReturn(sampleEvent);

        // Act
        Event savedEvent = eventController.saveEvent(sampleEvent);

        // Assert
        assertNotNull(savedEvent);
        assertEquals(sampleEvent.getTitle(), savedEvent.getTitle());
        assertEquals(sampleEvent.getDepartment(), savedEvent.getDepartment());
        verify(eventRepository, times(1)).save(sampleEvent);
        System.out.println("✓ saveEvent test passed successfully");
    }

    @Test
    void updateEvent_WhenEventExists_ShouldUpdateAndReturnEvent() {
        System.out.println("Testing: updateEvent_WhenEventExists_ShouldUpdateAndReturnEvent");
        // Arrange
        Event updatedEvent = new Event();
        updatedEvent.setTitle("Updated Meeting");
        updatedEvent.setDepartment("HR");
        
        when(eventRepository.findById(1L)).thenReturn(Optional.of(sampleEvent));
        when(eventRepository.save(any(Event.class))).thenReturn(updatedEvent);

        // Act
        Event result = eventController.updateEvent(1L, updatedEvent);

        // Assert
        assertNotNull(result);
        assertEquals(updatedEvent.getTitle(), result.getTitle());
        assertEquals(updatedEvent.getDepartment(), result.getDepartment());
        verify(eventRepository, times(1)).findById(1L);
        verify(eventRepository, times(1)).save(any(Event.class));
        System.out.println("✓ updateEvent test passed successfully");
    }

    @Test
    void updateEvent_WhenEventDoesNotExist_ShouldReturnNull() {
        System.out.println("Testing: updateEvent_WhenEventDoesNotExist_ShouldReturnNull");
        // Arrange
        when(eventRepository.findById(999L)).thenReturn(Optional.empty());

        // Act
        Event result = eventController.updateEvent(999L, sampleEvent);

        // Assert
        assertNull(result);
        verify(eventRepository, times(1)).findById(999L);
        verify(eventRepository, never()).save(any(Event.class));
        System.out.println("✓ updateEvent with non-existent ID test passed successfully");
    }

    @Test
    void deleteEvent_WhenEventExists_ShouldReturnNoContent() {
        System.out.println("Testing: deleteEvent_WhenEventExists_ShouldReturnNoContent");
        // Arrange
        doNothing().when(eventRepository).deleteById(1L);

        // Act
        ResponseEntity<Void> response = eventController.deleteEvent(1L);

        // Assert
        assertEquals(ResponseEntity.noContent().build(), response);
        verify(eventRepository, times(1)).deleteById(1L);
        System.out.println("✓ deleteEvent test passed successfully");
    }

    @Test
    void deleteEvent_WhenEventDoesNotExist_ShouldReturnNotFound() {
        System.out.println("Testing: deleteEvent_WhenEventDoesNotExist_ShouldReturnNotFound");
        // Arrange
        doThrow(new EmptyResultDataAccessException(1)).when(eventRepository).deleteById(999L);

        // Act
        ResponseEntity<Void> response = eventController.deleteEvent(999L);

        // Assert
        assertEquals(ResponseEntity.notFound().build(), response);
        verify(eventRepository, times(1)).deleteById(999L);
        System.out.println("✓ deleteEvent with non-existent ID test passed successfully");
    }
} 