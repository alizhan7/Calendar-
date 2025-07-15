package eventcalendar.service;

import eventcalendar.model.Holiday;
import eventcalendar.repository.HolidayRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class HolidayService {

    private final HolidayRepository holidayRepository;

    public HolidayService(HolidayRepository holidayRepository) {
        this.holidayRepository = holidayRepository;
    }

    public List<Holiday> getKazakhstanHolidays(int year) {
        LocalDate start = LocalDate.of(year, 1, 1);
        LocalDate end = LocalDate.of(year, 12, 31);
        return holidayRepository.findByCountryCodeAndDateBetween("KZ", start, end);
    }

    public void saveKazakhstanHolidaysIfNotExists() {
        if (!holidayRepository.existsById(1L)) { // crude check, improve later
            holidayRepository.saveAll(List.of(
                    new Holiday(null, LocalDate.of(2025, 1, 1), "New Year's Day", "KZ"),
                    new Holiday(null, LocalDate.of(2025, 3, 8), "International Women's Day", "KZ"),
                    new Holiday(null, LocalDate.of(2025, 3, 21), "Nauryz Meiramy", "KZ"),
                    new Holiday(null, LocalDate.of(2025, 5, 1), "Unity Day", "KZ"),
                    new Holiday(null, LocalDate.of(2025, 5, 9), "Victory Day", "KZ"),
                    new Holiday(null, LocalDate.of(2025, 7, 6), "Capital City Day", "KZ"),
                    new Holiday(null, LocalDate.of(2025, 8, 30), "Constitution Day", "KZ"),
                    new Holiday(null, LocalDate.of(2025, 12, 16), "Independence Day", "KZ")
            ));
        }
    }
}
