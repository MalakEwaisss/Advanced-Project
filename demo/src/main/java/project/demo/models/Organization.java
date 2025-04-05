package project.demo.models;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;

@Entity
public class Organization {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String organizationName;
    private String email;
    private String password;

    public Organization() {}

    public Organization(Long id, String organizationName, String email, String password) {
        this.id = id;
        this.organizationName = organizationName;
        this.email = email;
        this.password = password;
    }

    // Getters and setters...
}
