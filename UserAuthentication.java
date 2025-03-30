import java.util.HashMap;
import java.util.Scanner;

// User class to store user credentials
class User {
    private String username;
    private String password;
    private String userType;
    private String companyName; // Only for organizations

    public User(String username, String password, String userType) {
        this.username = username;
        this.password = password;
        this.userType = userType;
        this.companyName = null; // No company for students
    }

    public User(String username, String password, String userType, String companyName) {
        this.username = username;
        this.password = password;
        this.userType = userType;
        this.companyName = companyName;
    }

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }

    public String getUserType() {
        return userType;
    }

    public String getCompanyName() {
        return companyName;
    }
}

// UserManager class to handle user authentication and registration
class UserManager {
    private HashMap<String, User> users;

    public UserManager() {
        users = new HashMap<>();
        users.put("admin", new User("admin", "1234", "Admin"));
        users.put("student1", new User("student1", "pass1", "Student"));
        users.put("company1", new User("company1", "pass2", "Organization", "TechCorp"));
    }

    public User validateLogin(String username, String password) {
        User user = users.get(username);
        return (user != null && user.getPassword().equals(password)) ? user : null;
    }

    public boolean signUp(String username, String password, String userType, String companyName) {
        if (users.containsKey(username)) {
            System.out.println("Error: Username already exists.");
            return false;
        }

        if (userType.equalsIgnoreCase("Organization")) {
            users.put(username, new User(username, password, userType, companyName));
        } else {
            users.put(username, new User(username, password, userType));
        }

        System.out.println("Sign-up successful! You can now log in.");
        return true;
    }
}

// Logout class
class Logout {
    public void performLogout() {
        System.out.println("Logging out...");
        System.out.println("You have been logged out successfully.");
    }
}

// UI class to handle user interaction
class AuthenticationSystem {
    private Scanner scanner;
    private UserManager userManager;
    private Logout logout;

    public AuthenticationSystem() {
        scanner = new Scanner(System.in);
        userManager = new UserManager();
        logout = new Logout();
    }

    public void start() {
        System.out.println("Welcome to the Login System!");

        System.out.print("Do you have an account? (yes/no): ");
        String choice = getUserInput();

        if (choice.equalsIgnoreCase("no")) {
            registerUser();
        }

        User user = loginUser();
        if (user != null) {
            System.out.println("Login successful! Welcome, " + user.getUsername());

            if (user.getUserType().equals("Organization")) {
                System.out.println("Organization Name: " + user.getCompanyName());
            }

            // Redirect to Calendar after login
            CalendarApp.startCalendar(user.getUsername());

            System.out.print("Do you want to logout? (yes/no): ");
            String logoutChoice = getUserInput();
            if (logoutChoice.equalsIgnoreCase("yes")) {
                logout.performLogout();
            }
        }
    }

    private void registerUser() {
        System.out.print("Enter new username: ");
        String newUsername = getUserInput();

        System.out.print("Enter new password: ");
        String newPassword = getUserInput();

        System.out.print("Are you a Student or an Organization? (Student/Organization): ");
        String userType = getUserInput();

        String companyName = null;
        if (userType.equalsIgnoreCase("Organization")) {
            System.out.print("Enter your company name: ");
            companyName = getUserInput();
        }

        if (!userManager.signUp(newUsername, newPassword, userType, companyName)) {
            System.out.println("Sign-up failed. Please try again.");
        }
    }

    private User loginUser() {
        System.out.print("Enter Username: ");
        String username = getUserInput();

        System.out.print("Enter Password: ");
        String password = getUserInput();

        User user = userManager.validateLogin(username, password);
        if (user == null) {
            System.out.println("Invalid username or password. Please try again.");
        }
        return user;
    }

    private String getUserInput() {
        String input;
        do {
            input = scanner.nextLine().trim();
        } while (input.isEmpty());
        return input;
    }

    public void close() {
        scanner.close();
    }
}

// Main class
public class UserAuthentication {
    public static void main(String[] args) {
        AuthenticationSystem authSystem = new AuthenticationSystem();
        authSystem.start();
        authSystem.close();
    }
}
