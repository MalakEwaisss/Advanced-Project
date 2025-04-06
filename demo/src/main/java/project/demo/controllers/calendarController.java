package project.demo.controllers;

// import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;


import project.demo.models.Event;
import project.demo.models.Task;
// import project.demo.repository.adminRepository;
// import project.demo.repository.UserRepository;
import project.demo.repository.EventRepository;
import project.demo.repository.TaskRepository;
import project.demo.repository.CalendarRepository;

import java.util.Calendar;
import java.util.List;

@Controller
@RequestMapping("/calender")
public class calendarController {

    @Autowired private CalendarRepository calendarRepository;
    // @Autowired private adminRepository adminRepository;
    // @Autowired private UserRepository userRepository;
    @Autowired private EventRepository eventRepository;
    @Autowired private TaskRepository taskRepository;

    @GetMapping("/studentCalendar")
    public ModelAndView studentCalendar() {
        ModelAndView mav = new ModelAndView("studentCalendar.html");
        List<Calendar> calendar = calendarRepository.findAll();
        List<Event> events = eventRepository.findAll();
        List<Task> tasks = taskRepository.findAll();
        mav.addObject("calendar", calendar);
        mav.addObject("events", events);
        mav.addObject("tasks", tasks);
        return mav;
    }

    @GetMapping("/viewEvent")
    public ModelAndView viewEvent(Model model) {
        ModelAndView mav = new ModelAndView("studentCalendar.html");
        List<Event> event = eventRepository.findAll();
        mav.addObject("event", event);
        return mav;
    }

    @PostMapping("/addEvent")
    public String AddEvent(@ModelAttribute Event event) {
        this.eventRepository.save(event);
        return "Added event successfully!";
    }

    @PutMapping("/editEvent") 
    public String editEvent(@ModelAttribute Event event) {
        eventRepository.save(event);
        return "Modified event successfully!";
    }

    @DeleteMapping("/deleteEvent/{id}")
    public String deleteEventById(@PathVariable Long id) {
        eventRepository.deleteById(id);
        return "Deleted event successfully!";
    }

    @GetMapping("/viewTask")
    public ModelAndView viewTask(Model model) {
        ModelAndView mav = new ModelAndView("studentCalendar.html");
        List<Task> task = taskRepository.findAll();
        mav.addObject("task", task);
        return mav;
    }

    @PostMapping("/addTask")
    public String addTask(@ModelAttribute Task task) {
        taskRepository.save(task);
        return "Added task successfully!";
    }

    
    @PutMapping("/editTask") 
    public String editTask(@ModelAttribute Task task) {
        taskRepository.save(task);
        return "Modified task successfully!";
    }

   
    @DeleteMapping("/deleteTask/{id}")
    public String deleteTaskById(@PathVariable Long id) {
        taskRepository.deleteById(id);
        return "Deleted task successfully!";
    }
}
