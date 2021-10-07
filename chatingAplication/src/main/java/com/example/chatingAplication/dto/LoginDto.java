package com.example.chatingAplication.dto;

import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
@EqualsAndHashCode
public class LoginDto {

    private  String password;
    private String email;
    private Integer tel;
}
