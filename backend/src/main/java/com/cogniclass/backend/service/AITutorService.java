package com.cogniclass.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class AITutorService {
    
    private final RestTemplate restTemplate;
    
    @Value("${groq.api.key}")
    private String groqApiKey;
    
    public String getAIResponse(String userMessage, String context) {
        try {
            log.info("Getting AI response for message: {}", userMessage);
            
            // Check API key
            if (groqApiKey == null || groqApiKey.contains("your_groq_api_key")) {
                log.error("Groq API key not configured properly");
                return "AI service configuration error. Please check API key.";
            }
            
            String url = "https://api.groq.com/openai/v1/chat/completions";
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + groqApiKey);
            
            // Build request
            Map<String, Object> requestBody = new HashMap<>();
            
            Map<String, String> systemMessage = new HashMap<>();
            systemMessage.put("role", "system");
            systemMessage.put("content", "You are an AI tutor specializing in " + context + ". Be helpful and educational.");
            
            Map<String, String> userMessageObj = new HashMap<>();
            userMessageObj.put("role", "user");
            userMessageObj.put("content", userMessage);
            
            requestBody.put("messages", new Map[]{systemMessage, userMessageObj});
            requestBody.put("model", "llama-3.1-8b-instant"); // UPDATED MODEL
            requestBody.put("temperature", 0.7);
            requestBody.put("max_tokens", 1024);
            
            log.info("Sending request to Groq API...");
            
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, entity, Map.class);
            
            log.info("Received response from Groq API: {}", response.getStatusCode());
            
            // Parse response
            Map<String, Object> responseBody = response.getBody();
            if (responseBody != null && responseBody.containsKey("choices")) {
                java.util.List<Map<String, Object>> choices = (java.util.List<Map<String, Object>>) responseBody.get("choices");
                if (!choices.isEmpty()) {
                    Map<String, Object> firstChoice = choices.get(0);
                    Map<String, Object> message = (Map<String, Object>) firstChoice.get("message");
                    String content = (String) message.get("content");
                    log.info("AI response generated successfully");
                    return content;
                }
            }
            
            log.warn("Unexpected response format from Groq API");
            return "I received an unexpected response from the AI service.";
            
        } catch (Exception e) {
            log.error("Error calling Groq API: {}", e.getMessage(), e);
            return "I'm experiencing technical difficulties. Please try again later. Error: " + e.getMessage();
        }
    }
    
    public String determineResponseType(String content) {
        if (content == null) return "EXPLANATION";
        
        String lowerContent = content.toLowerCase();
        if (lowerContent.contains("example") || lowerContent.contains("for instance")) {
            return "EXAMPLE";
        } else if (lowerContent.contains("hint") || lowerContent.contains("try thinking")) {
            return "HINT";
        } else if (lowerContent.contains("?") && content.split("\\?").length > 2) {
            return "QUESTION";
        }
        return "EXPLANATION";
    }
}