package project.demo.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "organization")  // Correct table name as per your database
public class Organization {

    private String organizationName;
    private String email;
    private String password;

    // Getter for organizationName
    public String getOrganizationName() {
        return organizationName;
    }

    // Setter for organizationName
    public void setOrganizationName(String organizationName) {
        this.organizationName = organizationName;
    }

    // Getter for email
    public String getEmail() {
        return email;
    }

    // Setter for email
    public void setEmail(String email) {
        this.email = email;
    }

    // Getter for password
    public String getPassword() {
        return password;
    }

    // Setter for password
    public void setPassword(String password) {
        this.password = password;
    }

}
