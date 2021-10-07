package com.example.chatingAplication.dto;

import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
@EqualsAndHashCode
public class GroupSearchField {

    // user ID
    private String id;
    private String  name;
    private String  topic;
    private String  chatType;
    private String  languages;
}
