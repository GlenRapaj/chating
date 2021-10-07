package com.example.chatingAplication.models;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Getter
@Setter
@ToString
@NoArgsConstructor
@EqualsAndHashCode
@Document
public class UserProfile {

    @Id
    private String id;
    @NonNull
    private String name;
    @NonNull
    private String lastName;
    @NonNull
    private  String password;
    @Indexed(unique = true )
    private String email;
    private Integer tel;
    private boolean userActive;
    private String profilePhoto;
    @Indexed(unique = true )
    private String userName;
    private String city;
    // chatRooms ID
    private List<String> chatRooms;
    // Language ID
    private List<String> languages;
    private List<String> interests;
    private String about;

    public UserProfile(@NonNull String name, @NonNull String lastName, @NonNull String password, String email, Integer tel, boolean userActive, String profilePhoto, String userName, String city, List<String> chatRooms, List<String> languages, List<String> interests, String about) {
        this.name = name;
        this.lastName = lastName;
        this.password = password;
        this.email = email;
        this.tel = tel;
        this.userActive = userActive;
        this.profilePhoto = profilePhoto;
        this.userName = userName;
        this.city = city;
        this.chatRooms = chatRooms;
        this.languages = languages;
        this.interests = interests;
        this.about = about;
    }
}
