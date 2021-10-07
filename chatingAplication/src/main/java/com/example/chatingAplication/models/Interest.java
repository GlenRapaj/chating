package com.example.chatingAplication.models;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Getter
@Setter
@ToString
@NoArgsConstructor
@EqualsAndHashCode
@Document
public class Interest {

    @Id
    private String id;
    private String interestType;
    private String interestDescription;
    private List<String> userIds;
}
