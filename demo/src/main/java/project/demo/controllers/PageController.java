package project.demo.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import project.demo.models.User;

import org.springframework.ui.Model;  // To pass data to the view

@Controller
public class PageController {

    @GetMapping("/")
    public String home() {
        return "home";
    }

    @GetMapping("/admin")
    public String admin() {
        return "admin";
    }

    @GetMapping("/calender")
    public String calendar() {
        return "calender";
    }

    @GetMapping("/choose-account")
    public String chooseAccount() {
        return "choose_account";
    }

    @GetMapping("/login")
    public String showLoginPage(Model model) {
        model.addAttribute("user", new User());
        return "login"; // login.html in templates folder
    }

    @GetMapping("/manage-calendar")
    public String manageCalendar() {
        return "managecalendar";
    }

    @GetMapping("/manage-users")
    public String manageUsers() {
        return "manageusers";
    }

    

    @GetMapping("/organization-signup")
    public String organizationSignup() {
        return "organization_signup";
    }

    @GetMapping("/organization-calendar")
    public String organizationCalendar() {
        return "OrganizationCalendar";
    }

    @GetMapping("/profile")
    public String profile() {
        return "profile";
    }

    @GetMapping("/signup")
    public String signup() {
        return "signup";
    }

    @GetMapping("/student-signup")
    public String showSignupForm(Model model) {
        model.addAttribute("user", new User());
        return "student_signup";
    }
    

    @GetMapping("/student-calendar")
    public String studentCalendar() {
        return "studentCalendar";
    }

    @GetMapping("/todolist")
    public String todoList() {
        return "todolist";
    }
}