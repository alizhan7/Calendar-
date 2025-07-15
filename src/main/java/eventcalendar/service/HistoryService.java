package eventcalendar.service;

import eventcalendar.model.History;
import eventcalendar.model.User;
import eventcalendar.repository.HistoryRepository;
import eventcalendar.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class HistoryService {

    private final HistoryRepository historyRepo;
    private final UserRepository userRepo;

    /**
     * Save a history entry to DB.
     */
    public History saveHistory(History history, String username) {
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        history.setUser(user);
        return historyRepo.save(history);
    }

    /**
     * Get all history records for current user.
     */
    public List<History> getUserHistory(String username) {
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return historyRepo.findAllByUserOrderByStartDateTimeDesc(user);
    }

    /**
     * Recommend an activity based on the last day’s activity at the current hour.
     */
    public Optional<History> getRecommendation(String username) {
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<History> historyList = historyRepo.findAllByUserOrderByStartDateTimeDesc(user);
        if (historyList.isEmpty()) return Optional.empty();

        LocalDateTime now = LocalDateTime.now();
        int currentHour = now.getHour();

        for (History h : historyList) {
            if (h.getStartDateTime().getHour() == currentHour) {
                return Optional.of(h);
            }
        }

        return Optional.empty();
    }
    public void deleteById(Long id, String username) {
        History history = historyRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("History not found"));

        if (!history.getUser().getUsername().equals(username)) {
            throw new RuntimeException("Access denied");
        }

        historyRepo.deleteById(id);
    }

    public History updateHistory(Long id, History updated, String username) {
        History history = historyRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("History not found"));

        if (!history.getUser().getUsername().equals(username)) {
            throw new RuntimeException("Access denied");
        }

        history.setSummary(updated.getSummary());
        history.setStartDateTime(updated.getStartDateTime());
        history.setEndDateTime(updated.getEndDateTime());

        return historyRepo.save(history);
    }


}
