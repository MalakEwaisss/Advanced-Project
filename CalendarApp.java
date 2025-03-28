import java.util.ArrayList;
import java.util.Scanner;

class Event {
    private String eventName;
    private String eventLocation;

    public Event(String eventName, String eventLocation) {
        this.eventName = eventName;
        this.eventLocation = eventLocation;
    }

    public String getEventName() {
        return eventName;
    }

    public String getEventLocation() {
        return eventLocation;
    }

    public void editEvent(String newName, String newLocation) {
        this.eventName = newName;
        this.eventLocation = newLocation;
    }

    public void displayEvent() {
        System.out.println("Event: " + eventName);
        System.out.println("Location: " + eventLocation);
        System.out.println("----------------------------");
    }
}

class CalendarManager {
    private ArrayList<Event> events = new ArrayList<>();
    private Scanner scanner = new Scanner(System.in);

    public void addEvent() {
        System.out.print("Enter event name: ");
        String name = scanner.nextLine().trim();

        System.out.print("Enter event location: ");
        String location = scanner.nextLine().trim();

        if (name.isEmpty() || location.isEmpty()) {
            System.out.println("Error: Event name and location cannot be empty.");
            return;
        }

        events.add(new Event(name, location));
        System.out.println("Event added successfully!");
    }

    public void editEvent() {
        if (events.isEmpty()) {
            System.out.println("No events to edit.");
            return;
        }

        System.out.print("Enter event name to edit: ");
        String name = scanner.nextLine().trim();

        for (Event event : events) {
            if (event.getEventName().equalsIgnoreCase(name)) {
                System.out.print("Enter new event name: ");
                String newName = scanner.nextLine().trim();

                System.out.print("Enter new event location: ");
                String newLocation = scanner.nextLine().trim();

                if (newName.isEmpty() || newLocation.isEmpty()) {
                    System.out.println("Error: New event name and location cannot be empty.");
                    return;
                }

                event.editEvent(newName, newLocation);
                System.out.println("Event updated successfully!");
                return;
            }
        }
        System.out.println("Event not found.");
    }

    public void deleteEvent() {
        if (events.isEmpty()) {
            System.out.println("No events to delete.");
            return;
        }

        System.out.print("Enter event name to delete: ");
        String name = scanner.nextLine().trim();

        boolean removed = events.removeIf(event -> event.getEventName().equalsIgnoreCase(name));
        if (removed) {
            System.out.println("Event deleted successfully!");
        } else {
            System.out.println("Event not found.");
        }
    }

    public void showEvents() {
        if (events.isEmpty()) {
            System.out.println("No events found.");
            return;
        }
    
        System.out.println("\nYour Events:");
        int index = 1;
        for (Event event : events) {
            System.out.println("Event #" + index);
            event.displayEvent();
            index++;
        }
    }
    
}

public class CalendarApp {
    private static final CalendarManager calendarManager = new CalendarManager(); // Use single instance

    public static void startCalendar(String username) {
        Scanner scanner = new Scanner(System.in);

        while (true) {
            System.out.println("\nCalendar Menu:");
            System.out.println("1. Add Event");
            System.out.println("2. Edit Event");
            System.out.println("3. Delete Event");
            System.out.println("4. View Events");
            System.out.println("5. Logout");

            System.out.print("Enter choice: ");
            while (!scanner.hasNextInt()) {
                System.out.print("Invalid input. Enter a number (1-5): ");
                scanner.next();
            }

            int choice = scanner.nextInt();
            scanner.nextLine(); // Consume newline

            switch (choice) {
                case 1 -> calendarManager.addEvent();
                case 2 -> calendarManager.editEvent();
                case 3 -> calendarManager.deleteEvent();
                case 4 -> calendarManager.showEvents();
                case 5 -> {
                    System.out.println("Logging out...");
                    return;
                }
                default -> System.out.println("Invalid choice. Please enter a number between 1 and 5.");
            }
        }
    }
}
