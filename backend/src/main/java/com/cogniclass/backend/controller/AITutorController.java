package com.cogniclass.backend.controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cogniclass.backend.entity.User;
import com.cogniclass.backend.repository.AIConversationRepository;
import com.cogniclass.backend.service.AITutorService;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AITutorController {
    
    private final AITutorService aiTutorService;
    private final AIConversationRepository aiConversationRepository;
    
    @PostMapping("/tutor")
    public ResponseEntity<?> getAIResponse(@RequestBody TutorRequest request) {
        try {
            log.info("Received AI tutor request: {}", request.getMessage());
            
            String aiResponse = aiTutorService.getAIResponse(request.getMessage(), request.getContext());
            String responseType = aiTutorService.determineResponseType(aiResponse);
            
            log.info("AI response generated successfully, type: {}", responseType);
            
            Map<String, Object> response = new HashMap<>();
            response.put("response", aiResponse);
            response.put("type", responseType);
            response.put("timestamp", LocalDateTime.now());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error in AI tutor endpoint: {}", e.getMessage(), e);
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("response", "I'm having technical difficulties. Please try again.");
            errorResponse.put("type", "explanation");
            errorResponse.put("error", true);
            
            return ResponseEntity.status(500).body(errorResponse);
        }
    }
    
    @GetMapping("/conversations")
    public ResponseEntity<?> getUserConversations(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        var conversations = aiConversationRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        return ResponseEntity.ok(conversations);
    }
    
    @Data
    static class TutorRequest {
        private String message;
        private String context = "general learning";
        private Long groupId;
    }
}