package com.cogniclass.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cogniclass.backend.entity.StudyGroup;

public interface StudyGroupRepository extends JpaRepository<StudyGroup, Long> {
    List<StudyGroup> findByIsPublicTrue();
    List<StudyGroup> findByCreatedById(Long userId);
    List<StudyGroup> findByMembersId(Long userId);
}