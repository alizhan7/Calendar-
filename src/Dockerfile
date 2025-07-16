# Use OpenJDK as base image
FROM openjdk:17-jdk-alpine

# Set working directory inside the container
WORKDIR /app

# Copy the built JAR file into the container
COPY target/calendarr.jar app.jar

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
