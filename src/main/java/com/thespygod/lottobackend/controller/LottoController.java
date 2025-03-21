package com.thespygod.lottobackend.controller;

import com.thespygod.lottobackend.models.Message;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Paths;

@Controller
public class LottoController {

    @MessageMapping("/requestNum")
    @SendTo("/topic/public")
    public Message sendMessage(@Payload Message message) {
        System.out.println("Received message: " + message.getContent());
        String scriptOutput = "";
        try {
            scriptOutput = runPythonScript(message.getContent());
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
        }

        return new Message(scriptOutput);
    }

    private String runPythonScript(String message) throws IOException, InterruptedException  {
        String pythonScriptPath = String.format("src/main/resources/python/%s.py", message); // Update this to your actual Python script path

        if (!Files.exists(Paths.get(pythonScriptPath))) {
            throw new IOException("Python script not found: " + pythonScriptPath);
        }
        ProcessBuilder processBuilder = new ProcessBuilder("python3", pythonScriptPath);

        Process process = processBuilder.start();

        BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
        StringBuilder output = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) {
            output.append(line).append("\n");
        }

        int exitCode = process.waitFor();
        if (exitCode != 0) {
            throw new IOException("Python script execution failed with exit code: " + exitCode);
        }

        return output.toString();
    }
}
