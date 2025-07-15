package eventcalendar.controller;

import eventcalendar.model.Event;
import eventcalendar.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import eventcalendar.dto.EventDto;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/calendar")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    // ✅ Get all events for current user
    @GetMapping("/all")
    public List<EventDto> getAllEvents() {
        return eventService.getAllEvents();
    }

    // ✅ Create new event for current user
    @PostMapping("/create")
    public EventDto createEvent(@RequestBody EventDto eventDto, Principal principal) {
        return eventService.createEvent(eventDto, principal.getName());
    }

    // ✅ Update existing event, only if owned by current user
    @PutMapping("/update/{id}")
    public ResponseEntity<EventDto> updateEvent(@PathVariable Long id,
                                                @RequestBody EventDto eventDto,
                                                @AuthenticationPrincipal UserDetails user) {
        Event updated = eventService.updateEvent(id, eventDto, user.getUsername());
        return ResponseEntity.ok(new EventDto(
                updated.getId(),
                updated.getTitle(),
                updated.getDescription(),
                updated.getStartTime(),
                updated.getEndTime(),
                updated.getDone()
        ));
    }

    // ✅ Delete existing event, only if owned by current user
    @DeleteMapping("/delete/{eventId}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long eventId,
                                            Principal principal) {
        eventService.deleteEvent(eventId, principal.getName());
        return ResponseEntity.noContent().build();
    }

    // ✅ Get text-based recommendation from history if no event exists now
    @GetMapping("/recommendation")
    public ResponseEntity<String> getEventRecommendation(Principal principal) {
        String username = principal.getName();
        return ResponseEntity.ok(eventService.recommendEventFromHistory(username));
    }

    @GetMapping("/recommendations")
    public ResponseEntity<List<String>> getRecommendationsList(Principal principal) {
        return ResponseEntity.ok(eventService.getRecommendationsFromHistory(principal.getName()));
    }


    // ✅ Get today’s events OR fallback to recommendations from history
    @GetMapping("/today-or-recommendation")
    public List<EventDto> getTodayOrRecommendedEvents(Principal principal) {
        return eventService.getEventsWithRecommendationFallback(principal.getName());
    }

    // ✅ Simpler endpoint just for testing recommendation logic directly
    @GetMapping("/recommend")
    public String recommendFromHistory(Principal principal) {
        return eventService.recommendEventFromHistory(principal.getName());
    }
}
