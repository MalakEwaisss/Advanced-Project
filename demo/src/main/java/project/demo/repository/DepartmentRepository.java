package project.demo.repository;

import project.demo.models.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {
    // This interface extends JpaRepository which provides basic CRUD operations
    // We don't need to define any additional methods for this basic functionality
    
    // Optional: Find department by name
    boolean existsByName(String name);
}