package com.example.chatingAplication.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@ToString
@NoArgsConstructor
@EqualsAndHashCode
public class ChatRoomDto {

    private String id;
    private String name;
    private String topic;
    private String adminId;
    private String joinCode;
    private  String chatType;
    private String about;
    private String languages;
    private List<String> participants;

}
