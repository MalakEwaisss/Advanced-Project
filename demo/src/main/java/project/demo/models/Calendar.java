package project.demo.models;

// import java.security.PrivateKey;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "calendar")
public class Calendar {

    private int year;
    private int month;
    private int day;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    public Calendar(Long id, int year, int month, int day) {
        this.id = id;
        this.year = year;
        this.month = month;
        this.day = day;
    }

    @OneToMany(mappedBy = "admin", cascade = CascadeType.ALL)
    private List<Task> manageTasks;

    @OneToMany(mappedBy = "admin", cascade = CascadeType.ALL)
    private List<Event> manageEvents;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

     private List<Event> events = new ArrayList<>();

    public boolean addEvent(Event event) {
        return events.add(event);
    }
    public Task addTask(Task task) {
        // Logic to add a task to the calendar
        return task;
    }       
    public Event editEvent(String eventID, Event updatedEvent) {
        // Logic to edit an event in the calendar
        return updatedEvent;
    }
    public Task editTask(String taskID, Task updatedTask) {
        // Logic to edit a task in the calendar
        return updatedTask;
    }
    public Event deleteEvent(String eventID) {
        // Logic to delete an event from the calendar
        return null;
    }
    public Task deleteTask(String taskID) {
        // Logic to delete a task from the calendar
        return null;
    }

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public int getMonth() {
        return month;
    }

    public void setMonth(int month) {
        this.month = month;
    }

    public int getDay() {
        return day;
    }

    public void setDay(int day) {
        this.day = day;
    }
    
}
