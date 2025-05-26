package project.demo.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import project.demo.models.User;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Custom method to find a user by email
    User findByEmail(String email);
    User findByEmailAndPassword(String email, String password);

}
