package project.demo.controllers;

import project.demo.models.User;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import project.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;

@Controller
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    // Show sign-up page
    @GetMapping("/signup")
    public String showSignUpPage(Model model) {
        model.addAttribute("user", new User());
        return "signup";  // Refers to signup.html in templates
    }

    // Handle sign-up
    @PostMapping("/signup")
    public String signup(@ModelAttribute User user, Model model) {
        if (userRepository.findByEmail(user.getEmail()) != null) {
            model.addAttribute("error", "Email already exists.");
            return "signup";
        }

        // Save the new user to the database without hashing the password
        userRepository.save(user);
        return "redirect:/auth/login";  // Redirect to login after successful sign-up
    }

    // Handle login request
    @PostMapping("/login")
    public String login(String email, String password, String role, Model model) {
        // Authenticate the user with the provided email, password, and role
        User user = authenticateUser(email, password, role);

        if (user != null) {
            // Successful login, redirect to calendar or appropriate page
            return "redirect:/calendar";
        } else {
            // Failed login, show error message
            model.addAttribute("error", "Invalid email, password, or role.");
            return "login";  // Stay on login page with error message
        }
    }

    // Login success page
    @GetMapping("/loginSuccess")
    public String loginSuccess() {
        return "loginSuccess";  // Redirect to success page after login
    }

    // Mock method for authenticating user (this would typically involve checking a database)
    private User authenticateUser(String email, String password, String role) {
        User user = userRepository.findByEmail(email);
        if (user != null && user.getPassword().equals(password) && user.getRole().equals(role)) {
            return user;  // Return authenticated user
        }
        return null;  // Return null if authentication fails
    }
}
