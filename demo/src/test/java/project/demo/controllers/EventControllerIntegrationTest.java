package project.demo.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import project.demo.models.Event;
import project.demo.repository.EventRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class EventControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private EventRepository eventRepository;

    private Event createTestEvent(Long id) {
        Event event = new Event(
            "Tech Conference",
            LocalDate.of(2023, 12, 15),
            LocalTime.of(9, 0),
            "Annual Developer Conference",
            "blue"
        );
        event.setId(id);
        return event;
    }

    // Add Event Tests
    @Test
    public void addEvent_shouldReturnCreatedEvent() throws Exception {
        Event newEvent = createTestEvent(null);
        Event savedEvent = createTestEvent(1L);

        when(eventRepository.save(any(Event.class))).thenReturn(savedEvent);

        mockMvc.perform(post("/events/add")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(newEvent)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.title").value("Tech Conference"))
                .andExpect(jsonPath("$.color").value("blue"));
    }

    // Delete Event Tests
    @Test
    public void deleteEvent_shouldReturnOkStatus() throws Exception {
        Long eventId = 1L;
        doNothing().when(eventRepository).deleteById(eventId);

        mockMvc.perform(delete("/events/delete/{id}", eventId))
                .andExpect(status().isOk());

        verify(eventRepository, times(1)).deleteById(eventId);
    }

    @Test
    public void deleteEvent_withNonExistentId_shouldReturnNotFound() throws Exception {
        Long invalidId = 999L;
        doThrow(new RuntimeException()).when(eventRepository).deleteById(invalidId);

        mockMvc.perform(delete("/events/delete/{id}", invalidId))
                .andExpect(status().is5xxServerError());
    }

    // Get Events Tests
    @Test
    public void getAllEvents_shouldReturnEventList() throws Exception {
        Event event1 = createTestEvent(1L);
        Event event2 = createTestEvent(2L);

        when(eventRepository.findAll()).thenReturn(Arrays.asList(event1, event2));

        mockMvc.perform(get("/events/all"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[1].id").value(2L));
    }

    // Update Event Test
    @Test
    public void updateEvent_shouldReturnUpdatedEvent() throws Exception {
        Long eventId = 1L;
        Event existingEvent = createTestEvent(eventId);
        Event updatedEvent = createTestEvent(eventId);
        updatedEvent.setTitle("Updated Conference");

        when(eventRepository.save(any(Event.class))).thenReturn(updatedEvent);

        mockMvc.perform(put("/events/update/{id}", eventId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedEvent)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Updated Conference"));
    }
}