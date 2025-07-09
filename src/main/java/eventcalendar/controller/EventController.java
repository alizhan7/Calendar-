package eventcalendar.controller;

import eventcalendar.model.Event;
import eventcalendar.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import eventcalendar.dto.EventDto;


import java.util.List;
import java.security.Principal;

@RestController
@RequestMapping("/api/calendar")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @GetMapping("/all")
    public List<EventDto> getAllEvents() {
        return eventService.getAllEvents();
    }

    @PostMapping("/create")
    public EventDto createEvent(@RequestBody EventDto eventDto, Principal principal) {
        return eventService.createEvent(eventDto, principal.getName());
    }

    @PutMapping("/update/{eventId}")
    public ResponseEntity<Event> updateEvent(@PathVariable Long eventId,
                                             @RequestBody Event updatedEvent) {
        Event event = eventService.updateEvent(eventId, updatedEvent);
        return ResponseEntity.ok(event);
    }

    @DeleteMapping("/delete/{eventId}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long eventId) {
        eventService.deleteEvent(eventId);
        return ResponseEntity.noContent().build();
    }
}
