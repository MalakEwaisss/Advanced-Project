package project.demo.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {

    // Show login page
    @GetMapping("/login")
    public String loginPage() {
        return "login"; // This refers to login.html in templates
    }

    // Show home page
    @GetMapping("/")
    public String homePage() {
        return "home"; // This refers to home.html in templates
    }

    // Show Calendar page
    @GetMapping("/Calendar")
    public String CalendarPage() {
        return "Calendar"; // This refers to calendar.html in templates
    }
}
