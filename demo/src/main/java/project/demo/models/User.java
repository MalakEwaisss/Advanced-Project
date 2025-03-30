package project.demo.models;

import java.util.ArrayList;
import java.util.List;

import javax.management.Notification;

public abstract class User {
    protected String userID;
    protected String name;
    protected String email;
    protected String password;
    protected String role;
    protected List<Notification> notifications;

    public User(String userID, String name, String email, String password, String role) {
        this.userID = userID;
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.notifications = new ArrayList<>();
    }

    // Abstract methods
    public abstract boolean login(String email, String password);
    public abstract boolean signup();
    public abstract void logout();

    // Getters and setters
    public String getUserID() { return userID; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getRole() { return role; }
    public List<Notification> getNotifications() { return notifications; }

    public void setName(String name) { this.name = name; }
    public void setEmail(String email) { this.email = email; }
    public void setPassword(String password) { this.password = password; }

    public void addNotification(Notification notification) {
        notifications.add(notification);
    }

    public void clearNotifications() {
        notifications.clear();
    }
}