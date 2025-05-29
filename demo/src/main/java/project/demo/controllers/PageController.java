package project.demo.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import project.demo.models.Organization;
import project.demo.models.User;

import org.springframework.ui.Model;  // To pass data to the view

@Controller
public class PageController {

   

    @GetMapping("/admin")
    public String admin() {
        return "admin";
    }


    @GetMapping("/manage-calendar")
    public String manageCalendar() {
        return "managecalendar";
    }

    @GetMapping("/manage-users")
    public String manageUsers(Model model) {
        model.addAttribute("user", new User());

        return "manageusers";
    }


    @GetMapping("/profile")
    public String profile() {
        return "profile";
    }

   
    @GetMapping("/student-calendar")
    public String studentCalendar() {
        return "studentCalendar";
    }

   
}