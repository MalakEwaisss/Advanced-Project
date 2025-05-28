package project.demo.controllers;
import project.demo.exception.ResourceNotFoundException;
import project.demo.model.Department;
import project.demo.model.Task;
import project.demo.repository.DepartmentRepository;
import project.demo.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    private static final Logger logger = LoggerFactory.getLogger(TaskController.class);

    @Autowired
    private TaskRepository taskRepository;
    
    @Autowired
    private DepartmentRepository departmentRepository;

    @GetMapping
    public ResponseEntity<?> getAllTasks() {
        try {
            logger.info("Fetching all tasks");
            List<Task> tasks = taskRepository.findAll();
            logger.info("Found {} tasks", tasks.size());
            return ResponseEntity.ok(tasks);
        } catch (Exception e) {
            logger.error("Error fetching tasks", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching tasks: " + e.getMessage());
        }
    }

    @GetMapping("/department/{departmentId}")
    public ResponseEntity<?> getTasksByDepartment(@PathVariable Long departmentId) {
        try {
            logger.info("Fetching tasks for department ID: {}", departmentId);
            if (!departmentRepository.existsById(departmentId)) {
                logger.warn("Department not found with ID: {}", departmentId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Department not found with ID: " + departmentId);
            }
            List<Task> tasks = taskRepository.findByDepartmentId(departmentId);
            logger.info("Found {} tasks for department {}", tasks.size(), departmentId);
            return ResponseEntity.ok(tasks);
        } catch (Exception e) {
            logger.error("Error fetching tasks for department {}", departmentId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching tasks: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTaskById(@PathVariable Long id) {
        try {
            logger.info("Fetching task with ID: {}", id);
            Optional<Task> task = taskRepository.findById(id);
            if (task.isPresent()) {
                logger.info("Found task: {}", task.get());
                return ResponseEntity.ok(task.get());
            } else {
                logger.warn("Task not found with ID: {}", id);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Task not found with ID: " + id);
            }
        } catch (Exception e) {
            logger.error("Error fetching task {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching task: " + e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> createTask(@RequestBody Task task) {
        try {
            logger.info("Creating new task: {}", task);
            
            if (task.getTitle() == null || task.getTitle().trim().isEmpty()) {
                logger.warn("Task creation failed: Title is required");
                return ResponseEntity.badRequest().body("Task title is required");
            }
            
            if (task.getDepartment() == null || task.getDepartment().getId() == null) {
                logger.warn("Task creation failed: Department is required");
                return ResponseEntity.badRequest().body("Department is required");
            }
            
            Optional<Department> departmentOpt = departmentRepository.findById(task.getDepartment().getId());
            if (!departmentOpt.isPresent()) {
                logger.warn("Task creation failed: Department not found with ID: {}", task.getDepartment().getId());
                return ResponseEntity.badRequest().body("Department not found with ID: " + task.getDepartment().getId());
            }
            
            task.setDepartment(departmentOpt.get());
            
            if (task.getDate() == null) {
                logger.info("Setting default date to today");
                task.setDate(LocalDate.now());
            }
            
            if (task.getPriority() == null || task.getPriority().isEmpty()) {
                logger.info("Setting default priority to medium");
                task.setPriority("medium");
            }
            
            Task savedTask = taskRepository.save(task);
            logger.info("Task created successfully: {}", savedTask);
            return ResponseEntity.ok(savedTask);
        } catch (Exception e) {
            logger.error("Error creating task", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating task: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
public ResponseEntity<Task> updateTask(@PathVariable Long id, @RequestBody Task taskDetails) {
    Task task = taskRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
    
    task.setTitle(taskDetails.getTitle());
    task.setDate(taskDetails.getDate());
    task.setPriority(taskDetails.getPriority());
    task.setDescription(taskDetails.getDescription());
    
    // Update department if provided
    if (taskDetails.getDepartment() != null && taskDetails.getDepartment().getId() != null) {
        Department department = departmentRepository.findById(taskDetails.getDepartment().getId())
            .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + taskDetails.getDepartment().getId()));
        task.setDepartment(department);
    }
    
    Task updatedTask = taskRepository.save(task);
    return ResponseEntity.ok(updatedTask);
}
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable Long id) {
        try {
            logger.info("Deleting task with ID: {}", id);
            if (!taskRepository.existsById(id)) {
                logger.warn("Task not found with ID: {}", id);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Task not found with ID: " + id);
            }
            
            taskRepository.deleteById(id);
            logger.info("Task deleted successfully");
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            logger.error("Error deleting task {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting task: " + e.getMessage());
        }
    }
}