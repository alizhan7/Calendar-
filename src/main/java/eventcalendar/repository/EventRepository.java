package eventcalendar.repository;

import eventcalendar.model.Event;
import eventcalendar.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;

import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {

    // Find all events created by a specific user
    List<Event> findByUser(User user);

    // Optional: Find all events between certain dates
    List<Event> findByStartTimeBetween(LocalDateTime start, LocalDateTime end);
}
