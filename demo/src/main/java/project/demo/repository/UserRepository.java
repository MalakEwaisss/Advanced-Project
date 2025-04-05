package project.demo.repository;  // Corrected package


import project.demo.models.User;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
@Repository
public class UserRepository {

    private static final List<User> users = new ArrayList<>();

    static {
        // Example data
        users.add(new User("student@example.com", "password123", "student"));
        users.add(new User("org@example.com", "password123", "organization"));
    }

    // Find a user by email
    public User findByEmail(String email) {
        return users.stream()
                    .filter(user -> user.getEmail().equals(email))
                    .findFirst()
                    .orElse(null);  // Return null if not found
    }
}
