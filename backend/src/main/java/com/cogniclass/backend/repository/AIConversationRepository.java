package com.cogniclass.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cogniclass.backend.entity.AIConversation;

public interface AIConversationRepository extends JpaRepository<AIConversation, Long> {
    List<AIConversation> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<AIConversation> findByStudyGroupIdOrderByCreatedAtDesc(Long groupId);
}