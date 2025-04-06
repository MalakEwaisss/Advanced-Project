package project.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.ui.Model;
import project.demo.models.Students;
import project.demo.models.Organization;
import project.demo.repository.StudentRepository;
import project.demo.repository.OrganizationRepository;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping("/User")


public class SignUpController {


    @Autowired
    private OrganizationRepository organizationRepo;


  

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