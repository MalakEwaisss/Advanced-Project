// src/main/java/com/example/demo/repository/DepartmentRepository.java
package project.demo.repository;
import project.demo.models.Department;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DepartmentRepository extends JpaRepository<Department, Long> {
    // Spring Data JPA automatically provides methods like:
    // findById, save, deleteById, existsById, findAll, etc.
    
}