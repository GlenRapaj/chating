package com.example.chatingAplication.repo;

import com.example.chatingAplication.models.Interest;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InterestRepo extends MongoRepository<Interest, String> {
}
