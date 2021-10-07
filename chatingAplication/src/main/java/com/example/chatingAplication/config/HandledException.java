package com.example.chatingAplication.config;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class HandledException extends  RuntimeException{

    public HandledException(  String mesage ){
        super( mesage );
    }

    public HandledException(  String mesage , Throwable throwable ){
        super( mesage, throwable );
    }
}
