package project.demo.controllers;
import project.demo.controllers.DepartmentController;
import project.demo.model.Department;
import project.demo.repository.DepartmentRepository;
import project.demo.repository.EventRepository;
import project.demo.repository.TaskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class DepartmentControllerTest {

    @Mock
    private DepartmentRepository departmentRepository;

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private EventRepository eventRepository;

    @InjectMocks
    private DepartmentController departmentController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        System.out.println("\n=== Starting new test ===");
    }

    @Test
    void getAll_ShouldReturnAllDepartments() {
        System.out.println("Testing: getAll_ShouldReturnAllDepartments");
        // Arrange
        Department dept1 = new Department();
        dept1.setId(1L);
        dept1.setName("IT");

        Department dept2 = new Department();
        dept2.setId(2L);
        dept2.setName("HR");

        List<Department> expectedDepartments = Arrays.asList(dept1, dept2);
        when(departmentRepository.findAll()).thenReturn(expectedDepartments);

        // Act
        List<Department> actualDepartments = departmentController.getAll();

        // Assert
        assertEquals(expectedDepartments.size(), actualDepartments.size());
        assertEquals(expectedDepartments, actualDepartments);
        verify(departmentRepository, times(1)).findAll();
        System.out.println("✓ getAll test passed successfully");
    }

    @Test
    void save_ShouldSaveAndReturnDepartment() {
        System.out.println("Testing: save_ShouldSaveAndReturnDepartment");
        // Arrange
        Department department = new Department();
        department.setName("IT");
        when(departmentRepository.save(any(Department.class))).thenReturn(department);

        // Act
        Department savedDepartment = departmentController.save(department);

        // Assert
        assertNotNull(savedDepartment);
        assertEquals("IT", savedDepartment.getName());
        verify(departmentRepository, times(1)).save(department);
        System.out.println("✓ save test passed successfully");
    }

    @Test
    void deleteDepartment_WhenDepartmentExists_ShouldDeleteSuccessfully() {
        System.out.println("Testing: deleteDepartment_WhenDepartmentExists_ShouldDeleteSuccessfully");
        // Arrange
        Long departmentId = 1L;
        when(departmentRepository.existsById(departmentId)).thenReturn(true);
        doNothing().when(taskRepository).deleteByDepartmentId(departmentId);
        doNothing().when(eventRepository).deleteByDepartment(departmentId.toString());
        doNothing().when(departmentRepository).deleteById(departmentId);

        // Act
        ResponseEntity<?> response = departmentController.deleteDepartment(departmentId);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(departmentRepository, times(1)).existsById(departmentId);
        verify(taskRepository, times(1)).deleteByDepartmentId(departmentId);
        verify(eventRepository, times(1)).deleteByDepartment(departmentId.toString());
        verify(departmentRepository, times(1)).deleteById(departmentId);
        System.out.println("✓ delete existing department test passed successfully");
    }

    @Test
    void deleteDepartment_WhenDepartmentDoesNotExist_ShouldReturnNotFound() {
        System.out.println("Testing: deleteDepartment_WhenDepartmentDoesNotExist_ShouldReturnNotFound");
        // Arrange
        Long departmentId = 1L;
        when(departmentRepository.existsById(departmentId)).thenReturn(false);

        // Act
        ResponseEntity<?> response = departmentController.deleteDepartment(departmentId);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        verify(departmentRepository, times(1)).existsById(departmentId);
        verify(taskRepository, never()).deleteByDepartmentId(any());
        verify(eventRepository, never()).deleteByDepartment(any());
        verify(departmentRepository, never()).deleteById(any());
        System.out.println("✓ delete non-existent department test passed successfully");
    }

    @Test
    void deleteDepartment_WhenExceptionOccurs_ShouldReturnInternalServerError() {
        System.out.println("Testing: deleteDepartment_WhenExceptionOccurs_ShouldReturnInternalServerError");
        // Arrange
        Long departmentId = 1L;
        when(departmentRepository.existsById(departmentId)).thenReturn(true);
        doThrow(new RuntimeException("Database error")).when(taskRepository).deleteByDepartmentId(departmentId);

        // Act
        ResponseEntity<?> response = departmentController.deleteDepartment(departmentId);

        // Assert
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        verify(departmentRepository, times(1)).existsById(departmentId);
        verify(taskRepository, times(1)).deleteByDepartmentId(departmentId);
        verify(eventRepository, never()).deleteByDepartment(any());
        verify(departmentRepository, never()).deleteById(any());
        System.out.println("✓ delete with exception test passed successfully");
    }
} 