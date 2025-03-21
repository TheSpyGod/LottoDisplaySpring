FROM maven:3.8.5-openjdk-17 as build
COPY . .

RUN mvn clean package -DskipTests

FROM openjdk:17.0.1-jdk-slim

COPY --from=build /target/lottowebsocket-0.0.1-SNAPSHOT.jar demo.jar

# Expose port 8080 (or the port your app will be running on)
EXPOSE 8080

# Set the entrypoint to run the Java application
ENTRYPOINT ["java", "-jar", "demo.jar"]

# Optionally, you can also include Python execution in your entrypoint or as part of the process.
