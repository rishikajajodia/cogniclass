package com.cogniclass.backend.controller;

import java.time.LocalDateTime;
import java.util.Arrays;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cogniclass.backend.entity.AIConversation;
import com.cogniclass.backend.entity.ChatMessage;
import com.cogniclass.backend.entity.StudyGroup;
import com.cogniclass.backend.entity.User;
import com.cogniclass.backend.repository.AIConversationRepository;
import com.cogniclass.backend.repository.ChatMessageRepository;
import com.cogniclass.backend.repository.StudyGroupRepository;
import com.cogniclass.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/demo")
@RequiredArgsConstructor
public class DemoDataController {
    
    private final UserRepository userRepository;
    private final StudyGroupRepository studyGroupRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final AIConversationRepository aiConversationRepository;
    
    @PostMapping("/setup")
    public String setupDemoData() {
        // Clear existing data
        chatMessageRepository.deleteAll();
        aiConversationRepository.deleteAll();
        studyGroupRepository.deleteAll();
        userRepository.deleteAll();
        
        // Create demo users
        User teacher = new User();
        teacher.setEmail("professor@university.edu");
        teacher.setName("Dr. Smith");
        teacher.setRole("TEACHER");
        teacher.setPassword("$2a$10$demo"); // encoded "demo"
        userRepository.save(teacher);
        
        User student1 = new User();
        student1.setEmail("alex@student.edu");
        student1.setName("Alex Johnson");
        student1.setRole("STUDENT");
        student1.setPassword("$2a$10$demo");
        userRepository.save(student1);
        
        User student2 = new User();
        student2.setEmail("sarah@student.edu");
        student2.setName("Sarah Chen");
        student2.setRole("STUDENT");
        student2.setPassword("$2a$10$demo");
        userRepository.save(student2);
        
        User student3 = new User();
        student3.setEmail("mike@student.edu");
        student3.setName("Mike Rodriguez");
        student3.setRole("STUDENT");
        student3.setPassword("$2a$10$demo");
        userRepository.save(student3);
        
        // Create demo study groups
        StudyGroup mathGroup = new StudyGroup();
        mathGroup.setName("Advanced Calculus Study Group");
        mathGroup.setDescription("Master derivatives, integrals, and limits together");
        mathGroup.setSubject("Mathematics");
        mathGroup.setCreatedBy(teacher);
        mathGroup.setMembers(Arrays.asList(teacher, student1, student2, student3));
        studyGroupRepository.save(mathGroup);
        
        StudyGroup codingGroup = new StudyGroup();
        codingGroup.setName("Web Development Club");
        codingGroup.setDescription("Learn React, Spring Boot, and full-stack development");
        codingGroup.setSubject("Computer Science");
        codingGroup.setCreatedBy(student1);
        codingGroup.setMembers(Arrays.asList(student1, student2, student3));
        studyGroupRepository.save(codingGroup);
        
        // Add demo chat messages
        addDemoMessages(mathGroup, teacher, student1, student2, student3);
        addDemoMessages(codingGroup, teacher, student1, student2, student3);
        
        // Add demo AI conversations
        addDemoAIConversations(mathGroup, student1);
        
        return "Demo data created successfully!";
    }
    
    private void addDemoMessages(StudyGroup group, User teacher, User... students) {
        String[] mathMessages = {
            "Welcome to our " + group.getName() + "! 🎉",
            "Hi everyone! Looking forward to studying together",
            "Can someone explain the chain rule?",
            "The chain rule is used for composite functions: d/dx[f(g(x))] = f'(g(x)) * g'(x)",
            "Thanks! That makes sense now",
            "Don't forget about the practice problems due Friday",
            "I created a study guide for the midterm - check the files section"
        };
        
        String[] codingMessages = {
            "Let's build a full-stack app together!",
            "I'm working on the React frontend - anyone want to pair program?",
            "The Spring Boot backend is running smoothly",
            "Check out this cool animation I implemented",
            "Has anyone deployed to production before?",
            "We should add authentication next week"
        };
        
        User[] messageSenders = {teacher, students[0], students[1], students[2], students[0], teacher, students[1]};
        String[] messages = group.getSubject().equals("Mathematics") ? mathMessages : codingMessages;
        
        for (int i = 0; i < messages.length; i++) {
            ChatMessage msg = new ChatMessage();
            msg.setContent(messages[i]);
            msg.setSender(messageSenders[i % messageSenders.length]);
            msg.setStudyGroup(group);
            msg.setSentAt(LocalDateTime.now().minusHours(messages.length - i));
            msg.setMessageType("TEXT");
            chatMessageRepository.save(msg);
        }
    }
    
    private void addDemoAIConversations(StudyGroup group, User student) {
        String[] aiQuestions = {
            "Explain the fundamental theorem of calculus",
            "What's the difference between derivatives and integrals?",
            "Give me a real-world application of limits"
        };
        
        String[] aiResponses = {
            "The fundamental theorem connects differentiation and integration...",
            "Derivatives measure instantaneous rate of change, while integrals...",
            "Limits are used in engineering for stability analysis..."
        };
        
        for (int i = 0; i < aiQuestions.length; i++) {
            AIConversation conv = new AIConversation();
            conv.setUser(student);
            conv.setStudyGroup(group);
            conv.setUserMessage(aiQuestions[i]);
            conv.setAiResponse(aiResponses[i]);
            conv.setResponseType("EXPLANATION");
            conv.setCreatedAt(LocalDateTime.now().minusDays(aiQuestions.length - i));
            aiConversationRepository.save(conv);
        }
    }
}
