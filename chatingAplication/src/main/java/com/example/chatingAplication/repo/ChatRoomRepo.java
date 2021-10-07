package com.example.chatingAplication.repo;

import com.example.chatingAplication.models.ChatRoom;
import com.example.chatingAplication.models.UserProfile;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ChatRoomRepo extends MongoRepository<ChatRoom, String> {
    Optional<ChatRoom> findByName(String chatRoomName );
}
