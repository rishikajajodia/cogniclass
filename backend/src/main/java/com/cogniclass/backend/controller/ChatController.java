package com.cogniclass.backend.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cogniclass.backend.entity.ChatMessage;
import com.cogniclass.backend.entity.StudyGroup;
import com.cogniclass.backend.entity.User;
import com.cogniclass.backend.repository.ChatMessageRepository;
import com.cogniclass.backend.repository.StudyGroupRepository;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {
    
    private final ChatMessageRepository chatMessageRepository;
    private final StudyGroupRepository studyGroupRepository;
    
    @GetMapping("/{groupId}/messages")
    public ResponseEntity<List<ChatMessage>> getGroupMessages(@PathVariable Long groupId) {
        List<ChatMessage> messages = chatMessageRepository.findByStudyGroupIdOrderBySentAtAsc(groupId);
        return ResponseEntity.ok(messages);
    }
    
    @PostMapping("/{groupId}/messages")
    public ResponseEntity<?> sendMessage(
            @PathVariable Long groupId,
            @RequestBody SendMessageRequest request,
            Authentication authentication) {
        
        User user = (User) authentication.getPrincipal();
        Optional<StudyGroup> groupOpt = studyGroupRepository.findById(groupId);
        
        if (groupOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        ChatMessage message = new ChatMessage();
        message.setContent(request.getContent());
        message.setSender(user);
        message.setStudyGroup(groupOpt.get());
        message.setSentAt(LocalDateTime.now());
        message.setMessageType("TEXT");
        
        ChatMessage savedMessage = chatMessageRepository.save(message);
        return ResponseEntity.ok(savedMessage);
    }
    
    @Data
    static class SendMessageRequest {
        private String content;
    }
}