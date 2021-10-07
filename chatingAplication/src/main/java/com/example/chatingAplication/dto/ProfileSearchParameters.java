package com.example.chatingAplication.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@ToString
@NoArgsConstructor
@EqualsAndHashCode
public class ProfileSearchParameters {

    private String userName;
    private String city;
    private String languages;
    private String interests;
}
