package com.example.chatingAplication.models;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@ToString
@NoArgsConstructor
@EqualsAndHashCode
@Document
public class ChatRoom {

    @Id
    private String id;
    // Per unicitetin duhet te kontrollohet ne kontrollor
    @NonNull
    private String name;
    @NonNull
    private String topic;
    private LocalDateTime recentConversation;
    private String adminId;
    private String joinCode;
    // true private conversation false group
    private boolean chatRoomStatus;
    // mesage IDs
    private List<String> mesages;
    private  String chatType;
    // user IDs
    private List<String> participants;
    private String about;
    private List<String> languages;

    public ChatRoom(@NonNull String name, @NonNull String topic, LocalDateTime recentConversation, String adminId, String joinCode, boolean chatRoomStatus, List<String> messages, String chatType, List<String> participants) {
        this.name = name;
        this.topic = topic;
        this.recentConversation = recentConversation;
        this.adminId = adminId;
        this.joinCode = joinCode;
        this.chatRoomStatus = chatRoomStatus;
        this.mesages = messages;
        this.chatType = chatType;
        this.participants = participants;
    }

    public ChatRoom(@NonNull String name, @NonNull String topic, LocalDateTime recentConversation, String adminId, String joinCode, boolean chatRoomStatus, List<String> messages, String chatType, List<String> participants, String about, List<String> languages ) {
        this.name = name;
        this.topic = topic;
        this.recentConversation = recentConversation;
        this.adminId = adminId;
        this.joinCode = joinCode;
        this.chatRoomStatus = chatRoomStatus;
        this.mesages = messages;
        this.chatType = chatType;
        this.participants = participants;
        this.about = about;
        this.languages = languages;
    }
}
