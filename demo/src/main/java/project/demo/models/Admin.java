package project.demo.models;
// package project.demo.models;

// import jakarta.persistence.*;
// import java.util.List;

// @Entity
// @Table(name = "users")
// public class Admin extends User {
//     @Override
//     public String getRole() {
//         return "admin";
//     }
    
//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     private Long id;

//     private String name;
//     private String email;
//     private String password;

//     @OneToMany(mappedBy = "admin", cascade = CascadeType.ALL)
//     private List<User> manageUsers;

//     @OneToMany(mappedBy = "admin", cascade = CascadeType.ALL)
//     private List<Task> manageTasks;

//     @OneToMany(mappedBy = "admin", cascade = CascadeType.ALL)
//     private List<Event> manageEvents;

//     public Admin() {}

//     public Admin(String name, String email, String password) {
//         this.name = name;
//         this.email = email;
//         this.password = password;
//     }

//     // Getters and setters...
//     public Long getId() { return id; }
//     public void setId(Long id) { this.id = id; }

//     public String getName() { return name; }
//     public void setName(String name) { this.name = name; }

//     public String getEmail() { return email; }
//     public void setEmail(String email) { this.email = email; }

//     public String getPassword() { return password; }
//     public void setPassword(String password) { this.password = password; }

//     public List<User> getManageUsers() { return manageUsers; }
//     public void setManageUsers(List<User> manageUsers) { this.manageUsers = manageUsers; }

//     public List<Task> getManageTasks() { return manageTasks; }
//     public void setManageTasks(List<Task> manageTasks) { this.manageTasks = manageTasks; }

//     public List<Event> getManageEvents() { return manageEvents; }
//     public void setManageEvents(List<Event> manageEvents) { this.manageEvents = manageEvents; }
// }