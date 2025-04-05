package project.demo.utils;

import project.demo.models.Event;
import java.time.LocalDate;
import java.time.LocalTime;

public class TestEventBuilder {

    // Default test values
    private static final String DEFAULT_TITLE = "Tech Conference";
    private static final LocalDate DEFAULT_DATE = LocalDate.of(2023, 12, 15);
    private static final LocalTime DEFAULT_TIME = LocalTime.of(9, 0);
    private static final String DEFAULT_DESCRIPTION = "Annual Developer Conference";
    private static final String DEFAULT_COLOR = "blue";

    /**
     * Creates a basic event with default test values
     */
    public static Event createDefaultEvent() {
        return new Event(
            DEFAULT_TITLE,
            DEFAULT_DATE,
            DEFAULT_TIME,
            DEFAULT_DESCRIPTION,
            DEFAULT_COLOR
        );
    }

    /**
     * Creates an event with default values and specified ID
     */
    public static Event createEventWithId(Long id) {
        Event event = createDefaultEvent();
        event.setId(id);
        return event;
    }

    /**
     * Creates a custom event with specified parameters
     */
    public static Event createCustomEvent(
        String title, 
        LocalDate date, 
        LocalTime time,
        String description,
        String color
    ) {
        return new Event(title, date, time, description, color);
    }

    /**
     * Creates an event with modified title
     */
    public static Event createEventWithTitle(String title) {
        Event event = createDefaultEvent();
        event.setTitle(title);
        return event;
    }

    /**
     * Creates an event with modified date
     */
    public static Event createEventWithDate(LocalDate date) {
        Event event = createDefaultEvent();
        event.setDate(date);
        return event;
    }

    /**
     * Creates an event with modified color
     */
    public static Event createEventWithColor(String color) {
        Event event = createDefaultEvent();
        event.setColor(color);
        return event;
    }
}