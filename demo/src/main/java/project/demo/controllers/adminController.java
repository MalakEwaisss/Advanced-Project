package project.demo.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import project.demo.IAdminActions;
import project.demo.models.User;
import project.demo.repository.adminRepository;

@RestController
@RequestMapping("/api/admin")
public class adminController {
    private final IAdminActions adminActions;
    private final adminRepository adminRepository;

    public adminController(IAdminActions adminActions, adminRepository adminRepository) {
        this.adminActions = adminActions;
        this.adminRepository = adminRepository;
    }

    @PostMapping("/users")
    public ResponseEntity<User> createUser(@RequestBody User user) {
        User createdUser = adminActions.createUser(user);
        adminRepository.saveUser(createdUser);
        return ResponseEntity.ok(createdUser);
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable String userId) {
        adminActions.deleteUser(userId);
        adminRepository.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/tasks/{taskId}")
    public ResponseEntity<Task> editTask(@PathVariable String taskId, @RequestBody Task task) {
        Task updatedTask = adminActions.editAnyTask(taskId, task);
        adminRepository.saveTask(updatedTask);
        return ResponseEntity.ok(updatedTask);
    }

    @DeleteMapping("/tasks/{taskId}")
    public ResponseEntity<Void> deleteTask(@PathVariable String taskId) {
        adminActions.deleteAnyTask(taskId);
        adminRepository.deleteTask(taskId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/calendars")
    public ResponseEntity<Calendar> createCalendar(@RequestBody Calendar calendar) {
        Calendar createdCalendar = adminActions.createOrganizationCalendar(calendar);
        adminRepository.saveCalendar(createdCalendar);
        return ResponseEntity.ok(createdCalendar);
    }
}