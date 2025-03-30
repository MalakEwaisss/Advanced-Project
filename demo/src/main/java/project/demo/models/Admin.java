package project.demo.models;

import java.util.Calendar;
import org.springframework.scheduling.config.Task;
import project.demo.IAdminActions;
import project.demo.repository.UserRepository;
// import project.demo.repository.EventRepository;
import project.demo.repository.TaskRepository;
import project.demo.repository.CalendarRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public class Admin extends User implements IAdminActions {
    private final UserRepository userRepository;
    // private final EventRepository eventRepository;
    private final TaskRepository taskRepository;
    private final CalendarRepository calendarRepository;

    public Admin(String userId, String name, String email, String password,
                UserRepository userRepository,
                // EventRepository eventRepository,
                TaskRepository taskRepository,
                CalendarRepository calendarRepository) {
        super(userId, name, email, password, "ADMIN");
        this.userRepository = userRepository;
        // this.eventRepository = eventRepository;
        this.taskRepository = taskRepository;
        this.calendarRepository = calendarRepository;
    }

    @Override
    public User createUser(User user) {
        // Validate user data
        if (user.getName() == null || user.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("User name cannot be empty");
        }
        if (user.getEmail() == null || !user.getEmail().contains("@")) {
            throw new IllegalArgumentException("Invalid email format");
        }

        // Check if user already exists
        if (userRepository.existsById(user.getUserId())) {
            throw new IllegalStateException("User with ID " + user.getUserId() + " already exists");
        }

        // Set default role if not specified
        if (user.getRole() == null || user.getRole().trim().isEmpty()) {
            user.setRole("USER");
        }

        // Save and return the new user
        return userRepository.save(user);
    }

    @Override
    public boolean deleteUser(String userId) {
        // Check if user exists
        if (!userRepository.existsById(userId)) {
            throw new IllegalArgumentException("User with ID " + userId + " not found");
        
        }

        // Prevent self-deletion
        if (this.getUserId().equals(userId)) {
            throw new SecurityException("Admins cannot delete themselves");
        }

        // Delete the user
        userRepository.deleteById(userId);
        return true;
    }


    @Override
    public Task editAnyTask(String taskId, Task updatedTask) {
        // Verify task exists
        Task existingTask = taskRepository.findById(taskId)
            .orElseThrow(() -> new IllegalArgumentException("Task not found"));

        // Validate due date is in the future
        if (updatedTask.getDueDate().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Due date must be in the future");
        }

        // Preserve the original assignee
        updatedTask.setAssignedUser(existingTask.getAssignedUser());

        // Update and return the task
        return taskRepository.save(updatedTask);
    }

    @Override
    public boolean deleteAnyTask(String taskId) {
        // Verify task exists
        if (!taskRepository.existsById(taskId)) {
            throw new IllegalArgumentException("Task not found");
        }

        // Delete the task
        taskRepository.deleteById(taskId);
        return true;
    }

    @Override
    public Calendar createOrganizationCalendar(Calendar calendar) {
        // Validate calendar name
        if (calendar.getName() == null || calendar.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Calendar name cannot be empty");
        }

        // Set default values if not provided
        if (calendar.getDescription() == null) {
            calendar.setDescription("Organization calendar");
        }

        // Set the admin as the owner
        calendar.setOwner(this);

        // Save and return the calendar
        return calendarRepository.save(calendar);
    }

    @Override
    public org.apache.catalina.User createUser(org.apache.catalina.User user) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'createUser'");
    }

    @Override
    public boolean login(String email, String password) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'login'");
    }

    @Override
    public boolean signup() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'signup'");
    }

    @Override
    public void logout() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'logout'");
    }
}