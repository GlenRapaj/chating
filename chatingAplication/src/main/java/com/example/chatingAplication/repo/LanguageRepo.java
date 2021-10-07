package com.example.chatingAplication.repo;

import com.example.chatingAplication.models.ChatRoom;
import com.example.chatingAplication.models.Language;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LanguageRepo extends MongoRepository<Language, String> {
}
