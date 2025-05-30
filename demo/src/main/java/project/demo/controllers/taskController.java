package project.demo.controllers;

import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;


import project.demo.models.User;
import project.demo.models.Admin;
import project.demo.models.Task;
import project.demo.repository.adminRepository;
import project.demo.repository.UserRepository;
import project.demo.repository.TaskRepository;
import project.demo.repository.CalendarRepository;


import java.util.List;

@Controller
@RequestMapping("/task")
public class taskController {

    @Autowired private adminRepository adminRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private TaskRepository taskRepository;
    @Autowired private CalendarRepository calendarRepository;



    @GetMapping("/dashboard")
    public ModelAndView dashboard() {
        ModelAndView mav = new ModelAndView("admin.html");
        List<User> users = userRepository.findAll();
        List<Task> tasks = taskRepository.findAll();
        mav.addObject("users", users);
        mav.addObject("tasks", tasks);
        return mav;
    }

    @GetMapping("/users")
    public ModelAndView viewUsers(Model model) {
        ModelAndView mav = new ModelAndView("manageusers.html");
        List<User> users = userRepository.findAll();
        mav.addObject("users", users);
        return mav;
    }

    @PostMapping("/users")
    public String createUser(@ModelAttribute User user) {
        String encryptedPassword = BCrypt.hashpw(user.getPassword(),BCrypt.gensalt(12)); // Encrypt the password here if needed
        user.setPassword(encryptedPassword); // Set the encrypted password
        user.setRole("student"); // Set default role to "student"
        this.userRepository.save(user);
        return "redirect:/admin/users"+"Added user successfully!";
    }

    @PostMapping("/users/edit")
    public String editUser(@ModelAttribute User user) {
        userRepository.save(user);
        return "redirect:/admin/users"+"Modified user successfully!";
    }

    @PostMapping("/users/delete/{id}")
    public String deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return "redirect:/admin/users";
    }

    @GetMapping("/adminCalendar")
    public ModelAndView viewCalendar(Model model) {
        ModelAndView mav = new ModelAndView("managecalendar.html");
        List<Task> tasks = taskRepository.findAll();
        mav.addObject("tasks", tasks);
        return mav;
    }

    @GetMapping("/tasks")
    public ModelAndView viewTasks(Model model) {
        ModelAndView mav = new ModelAndView("managecalendar.html");
        List<Task> tasks = taskRepository.findAll();
        mav.addObject("tasks", tasks);
        return mav;
    }
    @PostMapping("/tasks")
    public String addTask(@ModelAttribute Task task) {
        taskRepository.save(task);
        return "redirect:/admin/adminCalendar";
    }

    @PostMapping("/tasks/delete/{id}")
    public String deleteTask(@PathVariable Long id) {
        taskRepository.deleteById(id);
        return "redirect:/admin/adminCalendar";
    }
}
