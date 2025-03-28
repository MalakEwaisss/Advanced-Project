import java.util.Date;

public class Event {
    private String eventName;
    private String eventLocation;
    private Date startDate;
    private Date endDate;

    public Event(String eventName, String eventLocation, Date startDate, Date endDate) {
        this.eventName = eventName;
        this.eventLocation = eventLocation;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    public String getEventName() {
        return eventName;
    }

    public void editEvent(String newName, String newLocation, Date newStart, Date newEnd) {
        this.eventName = newName;
        this.eventLocation = newLocation;
        this.startDate = newStart;
        this.endDate = newEnd;
    }

    public void displayEvent() {
        System.out.println("Event: " + eventName);
        System.out.println("Location: " + eventLocation);
        System.out.println("Start Date: " + startDate);
        System.out.println("End Date: " + endDate);
        System.out.println("-------------------------");
    }
}
