package com.example.chatingAplication.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@ToString
@NoArgsConstructor
@EqualsAndHashCode
public class UserDataFront {

    private String id;
    private String name;
    private boolean userActive;
    private String profilePhoto;
    private String userName;
    private String city;
    private List<String> languages;
    private List<String> interests;
    private String about;

    public UserDataFront(String id, String name, boolean userActive, String profilePhoto, String userName, String city, List<String> languages, List<String> interests, String about ) {
        this.id = id;
        this.name = name;
        this.userActive = userActive;
        this.profilePhoto = profilePhoto;
        this.userName = userName;
        this.city = city;
        this.languages = languages;
        this.interests = interests;
        this.about = about;
    }
}
