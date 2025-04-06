package project.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import project.demo.models.student;

public interface studentRepository  extends JpaRepository<student, Integer> {
    student findByEmail(String email);
}
