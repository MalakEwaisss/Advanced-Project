package project.demo.controllers;

import project.demo.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
@Table(name = "users")
public class SignUpController {

    // Show the Sign-Up Page
    @GetMapping("/signup")
    public String showSignUpPage() {
        return "signup";  // Refers to signup.html in templates
    }

    // Handle Sign-Up Form Submission
    @PostMapping("/signup")
    public String handleSignUp(String role, String firstName, String lastName, String username,
                                String email1, String password1, String organizationName, Model model) {
        
        // Validate if the required fields are filled
        if (role == null || email1 == null || password1 == null || 
            (role.equals("student") && (firstName == null || lastName == null || username == null)) || 
            (role.equals("organization") && organizationName == null)) {
            model.addAttribute("error", "Please fill in all required fields.");
            return "signup"; // Stay on the sign-up page if there are errors
        }

        // Create the user based on the role selected
        User user = null;
        if (role.equals("student")) {
            // Create a new student user
            user = new User(firstName, lastName, username, email1, password1, role);
        } else if (role.equals("organization")) {
            // Create a new organization user
            user = new User(organizationName, email1, password1, role);
        }

        // Simulate saving the user to the database (mock example)
        // In a real-world scenario, you would save the user to the database here.
        
        // If successful, redirect to login or home page (can be customized)
        return "redirect:/login"; // Redirect to login page after successful sign up
    }
}
