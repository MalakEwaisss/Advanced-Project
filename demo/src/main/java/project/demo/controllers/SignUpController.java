package project.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.ui.Model;
import project.demo.models.Students;
import project.demo.models.Organization;
import project.demo.repository.StudentRepository;
import project.demo.repository.OrganizationRepository;

@Controller
public class SignUpController {

    @Autowired
    private StudentRepository studentRepo;

    @Autowired
    private OrganizationRepository organizationRepo;

    // Handle student signup
    @PostMapping("/signup/student")
    public String registerStudent(@ModelAttribute Students student, Model model) {
        studentRepo.save(student);  // Save student data
        model.addAttribute("message", "Student registered successfully!");
        return "redirect:/calender";  // Redirect to calendar after successful registration
    }

    // Handle organization signup
    @PostMapping("/signup/organization")
    public String registerOrganization(@ModelAttribute Organization organization, Model model) {
        organizationRepo.save(organization);  // Save organization data
        model.addAttribute("message", "Organization registered successfully!");
        return "redirect:/calender";  // Redirect to calendar after successful registration
    }
}
