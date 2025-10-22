package com.cogniclass.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cogniclass.backend.entity.ChatMessage;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findByStudyGroupIdOrderBySentAtAsc(Long groupId);
}