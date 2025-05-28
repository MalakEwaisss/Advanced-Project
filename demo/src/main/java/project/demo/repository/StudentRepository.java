package project.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import project.demo.model.Students;

public interface StudentRepository extends JpaRepository<Students, Long> {
}
