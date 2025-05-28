// src/main/java/com/example/demo/repository/DepartmentRepository.java
package project.demo.repository;
import org.springframework.data.jpa.repository.JpaRepository;

import project.demo.model.Department;

public interface DepartmentRepository extends JpaRepository<Department, Long> {
    // Spring Data JPA automatically provides methods like:
    // findById, save, deleteById, existsById, findAll, etc.
    
}