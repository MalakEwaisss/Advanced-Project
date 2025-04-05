package project.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
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
    public String registerStudent(@ModelAttribute Students student) {
        studentRepo.save(student); // Save the student to the database
        return "redirect:/calender"; // Redirect to calendar.html
    }

    // Handle organization signup
    @PostMapping("/signup/organization")
    public String registerOrganization(@ModelAttribute Organization organization) {
        organizationRepo.save(organization); // Save the organization to the database
        return "redirect:/calender"; // Redirect to calendar.html
    }
}
