package project.demo.repository;
import project.demo.models.Task;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
     @Modifying
    @Transactional
    @Query("DELETE FROM Task t WHERE t.department.id = :departmentId")
    void deleteByDepartmentId(Long departmentId);
    
    // Add method to find tasks by department ID
    List<Task> findByDepartmentId(Long departmentId);
}