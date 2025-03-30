import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Scanner;

public class CalendarManager {
    private ArrayList<Event> events = new ArrayList<>();
    private Scanner scanner = new Scanner(System.in);
    private SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm");

    public void addEvent() {
        System.out.print("Enter event name: ");
        String name = scanner.nextLine();

        System.out.print("Enter event location: ");
        String location = scanner.nextLine();

        System.out.print("Enter start date (yyyy-MM-dd HH:mm): ");
        Date startDate = getDateFromUser();

        System.out.print("Enter end date (yyyy-MM-dd HH:mm): ");
        Date endDate = getDateFromUser();

        Event event = new Event(name, location, startDate, endDate);
        events.add(event);
        System.out.println("Event added successfully!");
    }

    public void editEvent() {
        if (events.isEmpty()) {
            System.out.println("No events to edit.");
            return;
        }

        System.out.print("Enter event name to edit: ");
        String name = scanner.nextLine();

        for (Event event : events) {
            if (event.getEventName().equalsIgnoreCase(name)) {
                System.out.print("Enter new event name: ");
                String newName = scanner.nextLine();

                System.out.print("Enter new location: ");
                String newLocation = scanner.nextLine();

                System.out.print("Enter new start date (yyyy-MM-dd HH:mm): ");
                Date newStart = getDateFromUser();

                System.out.print("Enter new end date (yyyy-MM-dd HH:mm): ");
                Date newEnd = getDateFromUser();

                event.editEvent(newName, newLocation, newStart, newEnd);
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
        String name = scanner.nextLine();

        events.removeIf(event -> event.getEventName().equalsIgnoreCase(name));
        System.out.println("Event deleted successfully!");
    }

    public void showEvents() {
        if (events.isEmpty()) {
            System.out.println("No events found.");
            return;
        }

        for (Event event : events) {
            event.displayEvent();
        }
    }

    private Date getDateFromUser() {
        while (true) {
            try {
                return dateFormat.parse(scanner.nextLine());
            } catch (ParseException e) {
                System.out.print("Invalid format! Please enter date again (yyyy-MM-dd HH:mm): ");
            }
        }
    }
}
