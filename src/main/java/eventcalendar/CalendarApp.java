package eventcalendar;

import eventcalendar.model.User;
import eventcalendar.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class CalendarApp {

    public static void main(String[] args) {
        SpringApplication.run(CalendarApp.class, args);
    }

    @Bean
    public CommandLineRunner createTestUser(UserRepository userRepo, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepo.findByUsername("admin").isEmpty()) {
                User user = new User();
                user.setUsername("admin");
                user.setPassword(passwordEncoder.encode("admin")); // password is "admin"
                userRepo.save(user);
                System.out.println("🟢 Created test user: admin/admin");
            } else {
                System.out.println("🟡 User 'admin' already exists");
            }
        };
    }
}
