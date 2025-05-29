package project.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import project.demo.models.Students;
import org.springframework.stereotype.Repository;

public interface StudentRepository extends JpaRepository<Students, Long> {
  Students findByEmail(String email);

    void save(Students student);
}
