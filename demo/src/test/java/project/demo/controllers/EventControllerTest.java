package project.demo.controllers;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import project.demo.models.Event;
import project.demo.repository.EventRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class EventControllerTest {

    @Mock
    private EventRepository eventRepository;

    @InjectMocks
    private EventController eventController;

    // Test data
    private Event createTestEvent() {
        return new Event(
            "Conference", 
            LocalDate.of(2023, 12, 15),
            LocalTime.of(9, 0),
            "Tech conference",
            "blue"
        );
    }

    // Add Event Tests
    @Test
    public void addEvent_shouldReturnSavedEvent() {
        // Arrange
        Event newEvent = createTestEvent();
        Event savedEvent = createTestEvent();
        savedEvent.setId(1L);
        
        when(eventRepository.save(any(Event.class))).thenReturn(savedEvent);

        // Act
        Event result = eventController.addEvent(newEvent);

        // Assert
        assertNotNull(result.getId());
        assertEquals(1L, result.getId());
        verify(eventRepository, times(1)).save(newEvent);
    }

    @Test
    public void addEvent_withNullEvent_shouldThrowException() {
        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> {
            eventController.addEvent(null);
        });
    }

    // Delete Event Tests
    @Test
    public void deleteEvent_withValidId_shouldCallRepository() {
        // Arrange
        Long eventId = 1L;
        doNothing().when(eventRepository).deleteById(eventId);

        // Act
        eventController.deleteEvent(eventId);

        // Assert
        verify(eventRepository, times(1)).deleteById(eventId);
    }

    @Test
    public void deleteEvent_withNonExistentId_shouldThrowException() {
        // Arrange
        Long invalidId = 999L;
        doThrow(new RuntimeException("Event not found")).when(eventRepository).deleteById(invalidId);

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            eventController.deleteEvent(invalidId);
        });
    }

    // Update Event Test (bonus)
    @Test
    public void updateEvent_shouldUpdateExistingEvent() {
        // Arrange
        Long eventId = 1L;
        Event existingEvent = createTestEvent();
        existingEvent.setId(eventId);
        Event updatedEvent = createTestEvent();
        updatedEvent.setTitle("Updated Conference");
        
        when(eventRepository.save(any(Event.class))).thenReturn(updatedEvent);

        // Act
        Event result = eventController.updateEvent(eventId, updatedEvent);

        // Assert
        assertEquals("Updated Conference", result.getTitle());
        verify(eventRepository, times(1)).save(updatedEvent);
    }
}