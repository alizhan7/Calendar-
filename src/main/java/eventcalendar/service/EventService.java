package eventcalendar.service;

import eventcalendar.dto.EventDto;
import eventcalendar.model.Event;
import eventcalendar.model.User;
import eventcalendar.repository.EventRepository;
import eventcalendar.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    // Create new event
    public EventDto createEvent(EventDto eventDto, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Event event = Event.builder()
                .title(eventDto.getTitle())
                .description(eventDto.getDescription())
                .startTime(eventDto.getStartTime())
                .endTime(eventDto.getEndTime())
                .user(user) // 👈 attach user
                .build();

        Event saved = eventRepository.save(event);

        return new EventDto(
                saved.getId(),
                saved.getTitle(),
                saved.getDescription(),
                saved.getStartTime(),
                saved.getEndTime()
        );
    }


    // Convert to EventDto
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
                        event.getEndTime()
                ))
                .collect(Collectors.toList());
    }
    // Get all events for a user
    public List<Event> getEventsByUser(Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        return userOpt.map(eventRepository::findByUser)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
    }

    // Update event
    public Event updateEvent(Long eventId, Event updatedEvent) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        event.setTitle(updatedEvent.getTitle());
        event.setDescription(updatedEvent.getDescription());
        event.setStartTime(updatedEvent.getStartTime());
        event.setEndTime(updatedEvent.getEndTime());
        return eventRepository.save(event);
    }

    // Delete event
    public void deleteEvent(Long eventId) {
        if (!eventRepository.existsById(eventId)) {
            throw new RuntimeException("Event not found");
        }
        eventRepository.deleteById(eventId);
    }
}
