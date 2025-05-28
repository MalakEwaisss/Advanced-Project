package project.demo.controllers;
import project.demo.model.Task;
import project.demo.model.Department;
import project.demo.repository.TaskRepository;
import project.demo.repository.DepartmentRepository;
import project.demo.exception.ResourceNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class TaskControllerTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private DepartmentRepository departmentRepository;

    @InjectMocks
    private TaskController taskController;

    private Task sampleTask;
    private Department sampleDepartment;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        System.out.println("\n=== Starting new test ===");

        // Create sample department
        sampleDepartment = new Department();
        sampleDepartment.setId(1L);
        sampleDepartment.setName("IT");

        // Create sample task
        sampleTask = new Task();
        sampleTask.setId(1L);
        sampleTask.setTitle("Implement Login Feature");
        sampleTask.setDescription("Create user authentication system");
        sampleTask.setDate(LocalDate.now());
        sampleTask.setPriority("high");
        sampleTask.setDepartment(sampleDepartment);
    }

    @Test
    void getAllTasks_ShouldReturnAllTasks() {
        System.out.println("Testing: getAllTasks_ShouldReturnAllTasks");
        // Arrange
        Task task2 = new Task();
        task2.setId(2L);
        task2.setTitle("Fix Bug");
        task2.setDepartment(sampleDepartment);

        List<Task> expectedTasks = Arrays.asList(sampleTask, task2);
        when(taskRepository.findAll()).thenReturn(expectedTasks);

        // Act
        ResponseEntity<?> response = taskController.getAllTasks();

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(expectedTasks, response.getBody());
        verify(taskRepository, times(1)).findAll();
        System.out.println("✓ getAllTasks test passed successfully");
    }

    @Test
    void getAllTasks_WhenErrorOccurs_ShouldReturnError() {
        System.out.println("Testing: getAllTasks_WhenErrorOccurs_ShouldReturnError");
        // Arrange
        when(taskRepository.findAll()).thenThrow(new RuntimeException("Database error"));

        // Act
        ResponseEntity<?> response = taskController.getAllTasks();

        // Assert
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertTrue(response.getBody().toString().contains("Error fetching tasks"));
        verify(taskRepository, times(1)).findAll();
        System.out.println("✓ getAllTasks error handling test passed successfully");
    }

    @Test
    void getTasksByDepartment_WhenDepartmentExists_ShouldReturnTasks() {
        System.out.println("Testing: getTasksByDepartment_WhenDepartmentExists_ShouldReturnTasks");
        // Arrange
        when(departmentRepository.existsById(1L)).thenReturn(true);
        when(taskRepository.findByDepartmentId(1L)).thenReturn(Arrays.asList(sampleTask));

        // Act
        ResponseEntity<?> response = taskController.getTasksByDepartment(1L);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(Arrays.asList(sampleTask), response.getBody());
        verify(departmentRepository, times(1)).existsById(1L);
        verify(taskRepository, times(1)).findByDepartmentId(1L);
        System.out.println("✓ getTasksByDepartment test passed successfully");
    }

    @Test
    void getTasksByDepartment_WhenDepartmentDoesNotExist_ShouldReturnNotFound() {
        System.out.println("Testing: getTasksByDepartment_WhenDepartmentDoesNotExist_ShouldReturnNotFound");
        // Arrange
        when(departmentRepository.existsById(999L)).thenReturn(false);

        // Act
        ResponseEntity<?> response = taskController.getTasksByDepartment(999L);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertTrue(response.getBody().toString().contains("Department not found"));
        verify(departmentRepository, times(1)).existsById(999L);
        verify(taskRepository, never()).findByDepartmentId(any());
        System.out.println("✓ getTasksByDepartment with non-existent department test passed successfully");
    }

    @Test
    void getTaskById_WhenTaskExists_ShouldReturnTask() {
        System.out.println("Testing: getTaskById_WhenTaskExists_ShouldReturnTask");
        // Arrange
        when(taskRepository.findById(1L)).thenReturn(Optional.of(sampleTask));

        // Act
        ResponseEntity<?> response = taskController.getTaskById(1L);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(sampleTask, response.getBody());
        verify(taskRepository, times(1)).findById(1L);
        System.out.println("✓ getTaskById test passed successfully");
    }

    @Test
    void getTaskById_WhenTaskDoesNotExist_ShouldReturnNotFound() {
        System.out.println("Testing: getTaskById_WhenTaskDoesNotExist_ShouldReturnNotFound");
        // Arrange
        when(taskRepository.findById(999L)).thenReturn(Optional.empty());

        // Act
        ResponseEntity<?> response = taskController.getTaskById(999L);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertTrue(response.getBody().toString().contains("Task not found"));
        verify(taskRepository, times(1)).findById(999L);
        System.out.println("✓ getTaskById with non-existent task test passed successfully");
    }

    @Test
    void createTask_WithValidData_ShouldCreateTask() {
        System.out.println("Testing: createTask_WithValidData_ShouldCreateTask");
        // Arrange
        when(departmentRepository.findById(1L)).thenReturn(Optional.of(sampleDepartment));
        when(taskRepository.save(any(Task.class))).thenReturn(sampleTask);

        // Act
        ResponseEntity<?> response = taskController.createTask(sampleTask);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(sampleTask, response.getBody());
        verify(departmentRepository, times(1)).findById(1L);
        verify(taskRepository, times(1)).save(any(Task.class));
        System.out.println("✓ createTask test passed successfully");
    }

    @Test
    void createTask_WithMissingTitle_ShouldReturnBadRequest() {
        System.out.println("Testing: createTask_WithMissingTitle_ShouldReturnBadRequest");
        // Arrange
        Task invalidTask = new Task();
        invalidTask.setDepartment(sampleDepartment);

        // Act
        ResponseEntity<?> response = taskController.createTask(invalidTask);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertTrue(response.getBody().toString().contains("Task title is required"));
        verify(taskRepository, never()).save(any(Task.class));
        System.out.println("✓ createTask with missing title test passed successfully");
    }

    @Test
    void createTask_WithInvalidDepartment_ShouldReturnBadRequest() {
        System.out.println("Testing: createTask_WithInvalidDepartment_ShouldReturnBadRequest");
        // Arrange
        Task taskWithInvalidDept = new Task();
        taskWithInvalidDept.setTitle("Test Task");
        taskWithInvalidDept.setDepartment(new Department());
        when(departmentRepository.findById(any())).thenReturn(Optional.empty());

        // Act
        ResponseEntity<?> response = taskController.createTask(taskWithInvalidDept);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertTrue(response.getBody().toString().contains("Department not found"));
        verify(taskRepository, never()).save(any(Task.class));
        System.out.println("✓ createTask with invalid department test passed successfully");
    }

    @Test
    void updateTask_WhenTaskExists_ShouldUpdateTask() {
        System.out.println("Testing: updateTask_WhenTaskExists_ShouldUpdateTask");
        // Arrange
        Task updatedTask = new Task();
        updatedTask.setTitle("Updated Title");
        updatedTask.setDepartment(sampleDepartment);

        when(taskRepository.findById(1L)).thenReturn(Optional.of(sampleTask));
        when(departmentRepository.findById(1L)).thenReturn(Optional.of(sampleDepartment));
        when(taskRepository.save(any(Task.class))).thenReturn(updatedTask);

        // Act
        ResponseEntity<Task> response = taskController.updateTask(1L, updatedTask);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(updatedTask.getTitle(), response.getBody().getTitle());
        verify(taskRepository, times(1)).findById(1L);
        verify(taskRepository, times(1)).save(any(Task.class));
        System.out.println("✓ updateTask test passed successfully");
    }

    @Test
    void updateTask_WhenTaskDoesNotExist_ShouldThrowException() {
        System.out.println("Testing: updateTask_WhenTaskDoesNotExist_ShouldThrowException");
        // Arrange
        when(taskRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> {
            taskController.updateTask(999L, sampleTask);
        });
        verify(taskRepository, times(1)).findById(999L);
        verify(taskRepository, never()).save(any(Task.class));
        System.out.println("✓ updateTask with non-existent task test passed successfully");
    }

    @Test
    void deleteTask_WhenTaskExists_ShouldDeleteTask() {
        System.out.println("Testing: deleteTask_WhenTaskExists_ShouldDeleteTask");
        // Arrange
        when(taskRepository.existsById(1L)).thenReturn(true);
        doNothing().when(taskRepository).deleteById(1L);

        // Act
        ResponseEntity<?> response = taskController.deleteTask(1L);

        // Assert
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(taskRepository, times(1)).existsById(1L);
        verify(taskRepository, times(1)).deleteById(1L);
        System.out.println("✓ deleteTask test passed successfully");
    }

    @Test
    void deleteTask_WhenTaskDoesNotExist_ShouldReturnNotFound() {
        System.out.println("Testing: deleteTask_WhenTaskDoesNotExist_ShouldReturnNotFound");
        // Arrange
        when(taskRepository.existsById(999L)).thenReturn(false);

        // Act
        ResponseEntity<?> response = taskController.deleteTask(999L);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertTrue(response.getBody().toString().contains("Task not found"));
        verify(taskRepository, times(1)).existsById(999L);
        verify(taskRepository, never()).deleteById(any());
        System.out.println("✓ deleteTask with non-existent task test passed successfully");
    }
} 