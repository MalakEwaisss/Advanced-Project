package project.demo.controllers;

import project.demo.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.ui.Model;
import project.demo.models.Students;
import project.demo.models.Organization;
import project.demo.repository.studentRepository;
import project.demo.repository.OrganizationRepository;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

import jakarta.persistence.Table;

@Controller
@RequestMapping("/User")
@Table(name = "users")
public class SignUpController {

    @Autowired
    private studentRepository studentRepository;

    @Autowired
    private OrganizationRepository organizationRepo;

    @GetMapping("/signup")
    public String showSignUpPage() {
        return "signup";  // Refers to signup.html in templates
    }

    // Handle Sign-Up Form Submission
    @PostMapping("/signup")
    public String handleSignUp(Long id, String role, String firstName, String lastName, String username,
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
            user = new User(id, firstName, lastName, username, email1, password1, role);
        } else if (role.equals("organization")) {
            // Create a new organization user
            user = new User(id, organizationName, email1, password1, role);
        }

        // Simulate saving the user to the database (mock example)
        // In a real-world scenario, you would save the user to the database here.
        
        // If successful, redirect to login or home page (can be customized)
        return "redirect:/login"; 
    }
    // Handle GET request for student signup
    @GetMapping("/signup/student")
    public ModelAndView showStudentSignupForm() {
        ModelAndView mav = new ModelAndView("student_signup.html");
        mav.addObject("student", new Students());  // Add an empty student object for form binding
        mav.setViewName("student_signup.html");  // Return the student signup HTML view (studentSignup.html)
        return mav;
    }

    // Handle POST request for student signup
    @PostMapping("/signup/student")
    public String registerStudent(@ModelAttribute Students student) {
        studentRepository.save(student);  // Save student data
        return "redirect:/calendar";  // Redirect to calendar after successful registration
    }

    // Handle GET request for organization signup
    @GetMapping("/signup/organization")
    public ModelAndView showOrganizationSignupForm() {
        ModelAndView mav = new ModelAndView("organization_signup.html");
        mav.addObject("organization", new Organization());  // Add an empty organization object for form binding
        mav.setViewName("organization_signup.html");  // Return the organization signup HTML view (organizationSignup.html)
        return mav;
    }

    // Handle POST request for organization signup
    @PostMapping("/signup/organization")
    public String registerOrganization(@ModelAttribute Organization organization) {
        organizationRepo.save(organization);  // Save organization data
        return "redirect:/calendar";  // Redirect to calendar after successful registration
    }
}