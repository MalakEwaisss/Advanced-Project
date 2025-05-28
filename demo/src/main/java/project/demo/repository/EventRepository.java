package project.demo.repository;
import project.demo.models.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

public interface EventRepository extends JpaRepository<Event, Long> {
    
    @Modifying
    @Transactional
    @Query("DELETE FROM Event e WHERE e.department = :departmentId")
    void deleteByDepartment(String departmentId);
}