package project.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import project.demo.models.Students;
import project.demo.models.student;
import org.springframework.stereotype.Repository;
public interface studentRepository  extends JpaRepository<student, Long> {
    student findByEmail(String email);

    void save(Students student);
}
