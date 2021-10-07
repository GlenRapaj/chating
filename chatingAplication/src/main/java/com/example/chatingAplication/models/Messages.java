package com.example.chatingAplication.models;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@ToString
@NoArgsConstructor
@EqualsAndHashCode
@Document
public class Messages {

    @Id
    private String id;
    private String userId;
    @NonNull
    private String messageText;
    private String chatRoomId;
    private LocalDateTime messageTime;
    private List<String> seenMessage;
    private String userName;
    private String profilePhoto;
    // E shtuar
    private List<String> deletedParticipantId;
    private boolean isDeleted ;
}
