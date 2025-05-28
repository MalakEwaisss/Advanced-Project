package project.demo.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import project.demo.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Custom method to find a user by email
    User findByEmail(String email);
    User findByEmailAndPassword(String email, String password);

}
