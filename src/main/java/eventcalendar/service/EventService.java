package eventcalendar.service;

import eventcalendar.dto.EventDto;
import eventcalendar.model.Event;
import eventcalendar.model.History;
import eventcalendar.model.User;
import eventcalendar.repository.EventRepository;
import eventcalendar.repository.HistoryRepository;
import eventcalendar.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
@Transactional
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final HistoryRepository historyRepository;

    /**
     * Create new calendar event linked to authenticated user.
     */
    public EventDto createEvent(EventDto eventDto, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Event event = Event.builder()
                .title(eventDto.getTitle())
                .description(eventDto.getDescription())
                .startTime(eventDto.getStartTime())
                .endTime(eventDto.getEndTime())
                .user(user)
                .build();

        Event saved = eventRepository.save(event);

        return new EventDto(
                saved.getId(),
                saved.getTitle(),
                saved.getDescription(),
                saved.getStartTime(),
                saved.getEndTime(),
                saved.getDone() // ✅ Add this
        );
    }

    /**
     * Get all events for the currently authenticated user.
     */
    public List<EventDto> getAllEvents() {
        String username = ((UserDetails) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal()).getUsername();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        return eventRepository.findByUser(user).stream()
                .map(event -> new EventDto(
                        event.getId(),
                        event.getTitle(),
                        event.getDescription(),
                        event.getStartTime(),
                        event.getEndTime(),
                        event.getDone() // ✅ use getter
                ))
                .collect(Collectors.toList());
    }

    /**
     * Optional: Get all events for a user by ID (not commonly used).
     */
    public List<Event> getEventsByUser(Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        return userOpt.map(eventRepository::findByUser)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
    }

    /**
     * Update event if user owns it.
     */
    public Event updateEvent(Long id, EventDto eventDto, String username) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        if (!event.getUser().getUsername().equals(username)) {
            throw new RuntimeException("Not authorized to update this event");
        }

        event.setTitle(eventDto.getTitle());
        event.setDescription(eventDto.getDescription());
        event.setStartTime(eventDto.getStartTime());
        event.setEndTime(eventDto.getEndTime());
        event.setDone(eventDto.getDone()); // <- This line is essential

        return eventRepository.save(event);
    }


    /**
     * Delete event if user owns it.
     */
    public void deleteEvent(Long eventId, String username) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        if (!event.getUser().getUsername().equals(username)) {
            throw new RuntimeException("Access denied");
        }

        eventRepository.deleteById(eventId);
    }

    /**
     * Recommend an activity from history if user has no events.
     */
    public String recommendEventFromHistory(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Event> userEvents = eventRepository.findByUser(user);
        if (!userEvents.isEmpty()) {
            return "You already have events scheduled.";
        }

        List<History> historyList = historyRepository.findAllByUserOrderByStartDateTimeDesc(user);
        if (historyList.isEmpty()) {
            return "No history to suggest from.";
        }

        int currentHour = LocalDateTime.now().getHour();

        return historyList.stream()
                .filter(h -> h.getStartDateTime().getHour() == currentHour)
                .findFirst()
                .map(h -> "Recommended based on past activity: " + h.getSummary())
                .orElse("No specific recommendation for this hour, but try revisiting your recent tasks.");
    }

    /**
     * Return today's events; if none, suggest one based on history.
     */
    public List<EventDto> getEventsWithRecommendationFallback(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        LocalDateTime today = LocalDateTime.now().toLocalDate().atStartOfDay();

        List<EventDto> todayEvents = eventRepository.findByUser(user).stream()
                .filter(e -> e.getStartTime().toLocalDate().equals(today.toLocalDate()))
                .map(e -> new EventDto(
                        e.getId(),
                        e.getTitle(),
                        e.getDescription(),
                        e.getStartTime(),
                        e.getEndTime(),
                        e.getDone() // ✅ add done
                ))
                .collect(Collectors.toList());

        if (!todayEvents.isEmpty()) {
            return todayEvents;
        }

        // Fallback: Suggest from history
        List<History> historyList = historyRepository.findAllByUserOrderByStartDateTimeDesc(user);
        if (historyList.isEmpty()) return List.of();

        int currentHour = LocalDateTime.now().getHour();

        return historyList.stream()
                .filter(h -> h.getStartDateTime().getHour() == currentHour)
                .findFirst()
                .map(h -> List.of(new EventDto(
                        null,
                        "[Suggested] " + h.getSummary(),
                        "Based on your past activity",
                        LocalDateTime.now().withMinute(0),
                        LocalDateTime.now().plusHours(1).withMinute(0),
                        false // ✅ mark suggested events as not done
                )))
                .orElse(List.of());
    }
    public List<String> getRecommendationsFromHistory(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        int currentHour = LocalDateTime.now().getHour();

        return historyRepository.findAllByUserOrderByStartDateTimeDesc(user).stream()
                .filter(h -> h.getStartDateTime().getHour() == currentHour)
                .map(History::getSummary)
                .distinct()
                .collect(Collectors.toList());
    }

}
