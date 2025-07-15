FROM openjdk:11
COPY src/main/java/eventcalendar/ /tmp
WORKDIR /tmp
CMD java.com.jetbrains.CalendarApp