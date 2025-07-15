package eventcalendar.controller;

import eventcalendar.model.History;
import eventcalendar.service.HistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/history")
@RequiredArgsConstructor
public class HistoryController {

    private final HistoryService historyService;

    @PostMapping("/create")
    public History createHistory(@RequestBody History history, Principal principal) {
        return historyService.saveHistory(history, principal.getName());
    }

    @GetMapping("/all")
    public List<History> getHistory(Principal principal) {
        System.out.println("📌 Authenticated user: " + principal.getName());
        return historyService.getUserHistory(principal.getName());
    }

    @GetMapping("/recommendation")
    public String getRecommendation(Principal principal) {
        Optional<History> recommendation = historyService.getRecommendation(principal.getName());

        return recommendation
                .map(h -> "We suggest: " + h.getSummary())
                .orElse("No recommendation found.");
    }

    @DeleteMapping("/delete/{id}")
    public void deleteHistory(@PathVariable("id") Long id, Principal principal) {
        historyService.deleteById(id, principal.getName());
    }

    @PutMapping("/update/{id}")
    public History updateHistory(@PathVariable("id") Long id, @RequestBody History updated, Principal principal) {
        return historyService.updateHistory(id, updated, principal.getName());
    }

}
