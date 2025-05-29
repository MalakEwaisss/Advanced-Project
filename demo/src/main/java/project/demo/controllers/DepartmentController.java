// src/main/java/com/example/calendar/controller/DepartmentController.java
package project.demo.controllers;
import project.demo.models.Department;
import project.demo.repository.DepartmentRepository;
import project.demo.repository.EventRepository;
import project.demo.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/departments")
public class DepartmentController {

    @Autowired
    private DepartmentRepository departmentRepository;
    
    @Autowired
    private TaskRepository taskRepository;
    
    @Autowired
    private EventRepository eventRepository;

    @GetMapping
    public List<Department> getAll() {
        return departmentRepository.findAll();
    }

    @PostMapping
    public Department save(@RequestBody Department department) {
        return departmentRepository.save(department);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDepartment(@PathVariable Long id) {
        try {
            if (!departmentRepository.existsById(id)) {
                return ResponseEntity.notFound().build();
            }
            
            // First delete all tasks associated with this department
            taskRepository.deleteByDepartmentId(id);
            
            // Then delete all events associated with this department
            eventRepository.deleteByDepartment(id.toString());
            
            // Finally delete the department
            departmentRepository.deleteById(id);
            
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}