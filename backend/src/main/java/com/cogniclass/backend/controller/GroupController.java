package com.cogniclass.backend.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cogniclass.backend.entity.StudyGroup;
import com.cogniclass.backend.entity.User;
import com.cogniclass.backend.repository.StudyGroupRepository;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/groups")
@RequiredArgsConstructor
public class GroupController {
    
    private final StudyGroupRepository studyGroupRepository;
    
    @GetMapping
    public ResponseEntity<List<StudyGroup>> getAllGroups() {
        List<StudyGroup> groups = studyGroupRepository.findByIsPublicTrue();
        return ResponseEntity.ok(groups);
    }
    
    @PostMapping
    public ResponseEntity<?> createGroup(@RequestBody CreateGroupRequest request, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        
        StudyGroup group = new StudyGroup();
        group.setName(request.getName());
        group.setDescription(request.getDescription());
        group.setSubject(request.getSubject());
        group.setCreatedBy(user);
        group.getMembers().add(user); // Creator is automatically a member
        
        StudyGroup savedGroup = studyGroupRepository.save(group);
        return ResponseEntity.ok(savedGroup);
    }
    
    @GetMapping("/{groupId}")
    public ResponseEntity<?> getGroup(@PathVariable Long groupId) {
        Optional<StudyGroup> group = studyGroupRepository.findById(groupId);
        if (group.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(group.get());
    }
    
    @PostMapping("/{groupId}/join")
    public ResponseEntity<?> joinGroup(@PathVariable Long groupId, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Optional<StudyGroup> groupOpt = studyGroupRepository.findById(groupId);
        
        if (groupOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        StudyGroup group = groupOpt.get();
        if (!group.getMembers().contains(user)) {
            group.getMembers().add(user);
            studyGroupRepository.save(group);
        }
        
        return ResponseEntity.ok(Map.of("message", "Joined group successfully"));
    }
    
    @GetMapping("/my-groups")
    public ResponseEntity<List<StudyGroup>> getMyGroups(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        List<StudyGroup> groups = studyGroupRepository.findByMembersId(user.getId());
        return ResponseEntity.ok(groups);
    }
    
    @Data
    static class CreateGroupRequest {
        private String name;
        private String description;
        private String subject;
    }
}