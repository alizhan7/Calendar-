package eventcalendar.controller;

import eventcalendar.model.Holiday;
import eventcalendar.service.HolidayService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/calendar")
public class HolidayController {

    private final HolidayService holidayService;

    public HolidayController(HolidayService holidayService) {
        this.holidayService = holidayService;
    }

    @GetMapping("/holidays/{year}")
    public List<Holiday> getHolidays(@PathVariable("year") int year) {
        return holidayService.getKazakhstanHolidays(year);
    }

    @PostMapping("/holidays/init")
    public String initHolidays() {
        holidayService.saveKazakhstanHolidaysIfNotExists();
        return "Kazakhstan holidays saved.";
    }
}
