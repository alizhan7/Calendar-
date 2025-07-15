package eventcalendar.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class History {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String summary;

    private LocalDateTime startDateTime;
    private LocalDateTime endDateTime;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
