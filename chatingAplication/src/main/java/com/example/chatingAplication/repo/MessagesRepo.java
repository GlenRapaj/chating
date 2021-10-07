package com.example.chatingAplication.repo;

import com.example.chatingAplication.models.Messages;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MessagesRepo extends MongoRepository<Messages, String> {

    List<Messages> findByChatRoomId(String chatRoomId );
}
