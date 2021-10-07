package com.example.chatingAplication.repo;

import com.example.chatingAplication.models.UserProfile;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserProfileRepo extends MongoRepository<UserProfile, String> {

    // @Query(value = "{'vehicleCompanies.companyName' : ?0 }")
    Optional<UserProfile> findByUserName(String userName );
    Optional<UserProfile> findByEmail(String email );
    Optional<UserProfile> findByTel(int tel );

   // @Query(" {'city': { $in: [?0] }, 'interests': { $in: [?1] }, 'languages': { $in: [?2] }, 'userActive' : true }")
   // List<UserProfile> findAllUserProfileBySearchFields( List<String> cities, List<String> interests, List<String> languages );
}
