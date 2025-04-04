package project.demo.controllers;

import project.demo.models.User;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/auth")
public class AuthController {

    // Handle login request
    @PostMapping("/login")
    public String login(String email, String password, String role, Model model) {
        // Manually authenticate user (mocking the user data for this example)
        User user = authenticateUser(email, password, role);

        if (user != null) {
            // Successful login, redirect to success page
            return "redirect:/Calendar";

        } else {
            // Failed login, show error message
            model.addAttribute("error", "Invalid email, password, or role.");
            return "login";  // Stay on login page with error message
        }
    }



    // Login success page
    @RequestMapping("/loginSuccess")
    public String loginSuccess() {
        return "loginSuccess";  // Redirect to success page
    }

    // Mock method for authenticating user (this would typically involve checking a database)
    private User authenticateUser(String email, String password, String role) {
        // Example data for demonstration purposes
        if (email.equals("student@example.com") && password.equals("password123") && role.equals("student")) {
            return new User("student@example.com", "password123", "student");  // Return valid user
        } else if (email.equals("org@example.com") && password.equals("password123") && role.equals("organization")) {
            return new User("org@example.com", "password123", "organization");  // Return valid user
        }
        return null;  // Return null if authentication fails
    }


    @Controller
    public class PageController {
    
        @GetMapping("/login")
        public String loginPage() {
            return "login"; // this refers to login.html in templates
        }
    
        @GetMapping("/")
        public String homePage() {
            return "home"; // this refers to home.html in templates
        }
    
        @GetMapping("/Calendar")
        public String CalendarPage() {
            return "Calendar"; // this refers to calendar.html in templates
        }
    }
    

}
