// package project.demo.models;

// import java.util.Calendar;
// import java.util.List;


// public class student extends User {
    
//     public student(String userID, String name, String email, String password, String role) {
//         super(userID, name, email, password, role);
//         //TODO Auto-generated constructor stub
//     }
//     private Calendar personalCalendar;
//     private ToDoList toDoList;



//     @Override
//     public boolean login(String email, String password) {
//         return this.email.equals(email) && this.password.equals(password);
//     }

//     @Override
//     public boolean signup() {
//         // Implementation for student signup
//         return true;
//     }

//     @Override
//     public void logout() {
//         // Implementation for logout
//     }

//     // Student-specific methods
//     public boolean addEvent(Event event) {
//         return personalCalendar.addEvent(event);
//     }

//     public boolean editEvent(String eventID, Event updatedEvent) {
//         return personalCalendar.editEvent(eventID, updatedEvent);
//     }

//     public boolean deleteEvent(String eventID) {
//         return personalCalendar.deleteEvent(eventID);
//     }

//     public Reminder setReminder(Event event, String message, String reminderDate) {
//         return personalCalendar.setReminder(event, message, reminderDate);
//     }

//     public boolean addTask(Task task) {
//         return toDoList.addTask(task);
//     }

//     public boolean editTask(String taskID, Task updatedTask) {
//         return toDoList.editTask(taskID, updatedTask);
//     }

//     public boolean deleteTask(String taskID) {
//         return toDoList.deleteTask(taskID);
//     }

//     public Reminder setTaskReminder(Task task, String message, String reminderDate) {
//         return toDoList.setReminder(task, message, reminderDate);
//     }

//     // Setters & Getters
//     public Calendar getPersonalCalendar() { 
//         return personalCalendar; 
//     }
//     public void setPersonalCalendar(Calendar personalCalendar) { 
//         this.personalCalendar = personalCalendar; 
//     }
//     public void setToDoList(ToDoList toDoList) { 
//         this.toDoList = toDoList; 
//     }
//     public ToDoList getToDoList() { 
//         return toDoList; 
//     }
// }