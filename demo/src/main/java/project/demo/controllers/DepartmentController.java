package project.demo.controllers;

import project.demo.models.Department;
import project.demo.repository.DepartmentRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/departments")
@CrossOrigin(origins = "http://localhost:8085")

public class DepartmentController {
    
    @Autowired
    private final DepartmentRepository departmentRepository;

    
    public DepartmentController(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }
    
    @GetMapping
    public ResponseEntity<List<Department>> getAllDepartments() {
        List<Department> departments = departmentRepository.findAll();
        return new ResponseEntity<>(departments, HttpStatus.OK);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Department> getDepartmentById(@PathVariable Long id) {
        Optional<Department> department = departmentRepository.findById(id);
        return department
                .map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
    @PostMapping
    public ResponseEntity<?> createDepartment(@Valid @RequestBody Department department) {
        // Check if department name already exists
        if (departmentRepository.existsByName(department.getName())) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Department name already exists");
            return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
        }
        
        Department savedDepartment = departmentRepository.save(department);
        return new ResponseEntity<>(savedDepartment, HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Department> updateDepartment(
            @PathVariable Long id, 
            @Valid @RequestBody Department departmentDetails) {
        
        Optional<Department> departmentOptional = departmentRepository.findById(id);
        
        if (departmentOptional.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        
        Department department = departmentOptional.get();
        department.setName(departmentDetails.getName());
        department.setColor(departmentDetails.getColor());
        
        Department updatedDepartment = departmentRepository.save(department);
        return new ResponseEntity<>(updatedDepartment, HttpStatus.OK);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteDepartment(@PathVariable Long id) {
        Optional<Department> department = departmentRepository.findById(id);
        
        if (department.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        
        departmentRepository.deleteById(id);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Department deleted successfully");
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}