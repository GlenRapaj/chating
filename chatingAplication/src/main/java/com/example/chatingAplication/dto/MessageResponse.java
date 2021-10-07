package com.example.chatingAplication.dto;

import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
@EqualsAndHashCode
public class MessageResponse {
    private String message;

    public MessageResponse( String message ){
        this.message = message ;
    }
}

