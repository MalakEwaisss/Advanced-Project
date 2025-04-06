package project.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Calendar;

public interface CalendarRepository  extends JpaRepository<Calendar, Integer> {
    Calendar findById(String id); 
}
