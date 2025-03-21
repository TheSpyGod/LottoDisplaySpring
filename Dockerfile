FROM maven:3.8.5-openjdk-17 as build
COPY . .

RUN mvn clean package -DskipTests

FROM openjdk:17.0.1-jdk-slim

RUN apt-get update && apt-get install -y python3 python3-pip

COPY requirements.txt /app/requirements.txt
RUN pip3 install --no-cache-dir -r /app/requirements.txt

COPY --from=build /target/lottowebsocket-0.0.1-SNAPSHOT.jar demo.jar

COPY src/main/resources/python /app/python

# Expose port 8080 (or the port your app will be running on)
EXPOSE 8080

# Set the entrypoint to run the Java application
ENTRYPOINT ["java", "-jar", "demo.jar"]

# Optionally, you can also include Python execution in your entrypoint or as part of the process.
