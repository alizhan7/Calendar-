package eventcalendar.controller;

import eventcalendar.model.Reminder;
import eventcalendar.model.User;
import eventcalendar.repository.ReminderRepository;
import eventcalendar.repository.UserRepository;
import eventcalendar.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/reminders")
@RequiredArgsConstructor
public class ReminderController {

    private final ReminderRepository reminderRepo;
    private final UserRepository userRepo;

    @PostMapping
    public ResponseEntity<?> createReminder(@RequestBody Reminder reminder, Principal principal) {
        User user = userRepo.findByUsername(principal.getName()).orElseThrow();
        reminder.setUser(user);
        reminderRepo.save(reminder);
        return ResponseEntity.ok("Reminder created");
    }

    @GetMapping
    public ResponseEntity<List<Reminder>> getReminders(Principal principal) {
        User user = userRepo.findByUsername(principal.getName()).orElseThrow();
        return ResponseEntity.ok(reminderRepo.findByUserId(user.getId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReminder(@PathVariable Long id) {
        reminderRepo.deleteById(id);
        return ResponseEntity.ok("Deleted");
    }
}
