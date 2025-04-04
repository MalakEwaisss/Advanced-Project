package project.demo.models;

public class User {
    private String email;
    private String password;
    private String role;

    // Constructor
    public User(String email, String password, String role) {
        this.email = email;
        this.password = password;
        this.role = role;
    }

    // Getters and Setters
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }




    private Long id;
    private String firstName;
    private String lastName;
    private String username;
    private String email1;
    private String password1;
    private String role1; // 'student' or 'organization'
    private String organizationName; // Only for organizations

    // Constructor for student user
    public User(String firstName, String lastName, String username, String email1, String password1, String role1) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.username = username;
        this.email1 = email1;
        this.password1 = password1;
        this.role1 = role1;
    }

    // Constructor for organization user
    public User(String organizationName, String email1, String password1, String role1) {
        this.organizationName = organizationName;
        this.email1 = email1;
        this.password1 = password1;
        this.role1 = role1;
    }

    // Getters and Setters for the attributes
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail1() {
        return email1;
    }

    public void setEmail1(String email1) {
        this.email1 = email1;
    }

    public String getPassword1() {
        return password1;
    }

    public void setPassword1(String password1) {
        this.password1 = password1;
    }

    public String getRole1() {
        return role1;
    }

    public void setRole1(String role1) {
        this.role1 = role1;
    }

    public String getOrganizationName() {
        return organizationName;
    }

    public void setOrganizationName(String organizationName) {
        this.organizationName = organizationName;
    }
}

