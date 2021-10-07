package com.example.chatingAplication.repo;

import com.example.chatingAplication.models.City;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CityRepo  extends MongoRepository<City, String> {
}
