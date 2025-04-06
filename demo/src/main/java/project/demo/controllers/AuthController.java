package project.demo.controllers;

import project.demo.models.User;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import jakarta.servlet.http.HttpSession;
import project.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;


//@CrossOrigin(origins = "http://localhost:8085")
@Controller
@RequestMapping("/")
public class AuthController {

    @Autowired
    private UserRepository userRepository;



    @PostMapping("/student-signup")
    public String registerStudent(@ModelAttribute User user, Model model) {
        
        if (userRepository.findByEmail(user.getEmail()) != null) {
            model.addAttribute("error", "Email already exists.");
            return "student_signup";  // Return to signup page with error message
        }
            user.setRole("student");
        userRepository.save(user);

        // Optionally, you can add a message to the model
        model.addAttribute("message", "Student registered successfully!");

        // Redirect to a different page (e.g., calendar page)
        return "redirect:/login";  // Redirect after successful form submission
    }

    /* @PostMapping("/organization-signup")
    public String registerOrganization(@ModelAttribute User user, Model model) {
    
        // Check if the email already exists
        if (userRepository.findByEmail(user.getEmail()) != null) {
            model.addAttribute("error", "Email already exists.");
            return "organization_signup";  // Return to signup page with error message
        }
        
        // Set the role as 'organization'
        user.setRole("organization");
        
        // Save the organization as a user in the database
        userRepository.save(user);
    
        // Optionally, you can add a message to the model
        model.addAttribute("message", "Organization registered successfully!");
    
        // Redirect to login page
        return "redirect:/login";
    } */
    
    
    

   @PostMapping("/login")
    public String login(@ModelAttribute User user, Model model, HttpSession session) {
        User dbUser = userRepository.findByEmailAndPassword(user.getEmail(), user.getPassword());

        if (dbUser != null) {
            session.setAttribute("userId", dbUser.getId());
            session.setAttribute("role", dbUser.getRole());
            session.setAttribute("username", dbUser.getUsername());

            System.out.println("Session Attributes: userId = " + session.getAttribute("userId")
            + ", role = " + session.getAttribute("role") + ", username = " + session.getAttribute("username"));


            switch (dbUser.getRole()) {
                case "admin":
                    return "redirect:/admin";
                case "student":
                    return "redirect:/calender";
                case "organization":
                    return "redirect:/organization-calendar";
                default:
                    model.addAttribute("error", "Unknown role.");
                    return "login";
            }
        }

        model.addAttribute("error", "Invalid credentials.");
        return "login";
    }

   

 
}
