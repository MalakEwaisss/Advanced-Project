package project.demo.repository;
import project.demo.models.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends CrudRepository<User, Long> {
    User findByEmail(String email);

    // Add this method for login
    User findByEmailAndPassword(String email, String password);
}
