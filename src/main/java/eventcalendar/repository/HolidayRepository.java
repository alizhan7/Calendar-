package eventcalendar.repository;

import eventcalendar.model.Holiday;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface HolidayRepository extends JpaRepository<Holiday, Long> {
    List<Holiday> findByDateBetween(LocalDate start, LocalDate end);
    List<Holiday> findByCountryCodeAndDateBetween(String countryCode, LocalDate start, LocalDate end);
}
