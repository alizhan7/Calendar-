package eventcalendar.repository;

import eventcalendar.model.History;
import eventcalendar.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HistoryRepository extends JpaRepository<History, Long> {
    List<History> findAllByUserOrderByStartDateTimeDesc(User user);
}
