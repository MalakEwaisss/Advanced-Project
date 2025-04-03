package project.demo;

import java.util.Calendar;

import org.apache.catalina.User;
import org.springframework.scheduling.config.Task;

public interface IAdminActions {
    User createUser(User user);
    boolean deleteUser(String userId);
    Task editAnyTask(String taskId, Task updatedTask);
    boolean deleteAnyTask(String taskId);
    Calendar createOrganizationCalendar(Calendar calendar);
}