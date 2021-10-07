package com.example.chatingAplication.dto;

import lombok.*;
import org.springframework.data.mongodb.core.index.Indexed;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class UserRegistrationData {

    private  String name;
    private String lastName;
    private  String password;
    private String email;
    private Integer tel;
    private String userName;
}
