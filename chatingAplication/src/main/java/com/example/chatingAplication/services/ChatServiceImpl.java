package com.example.chatingAplication.services;

import com.example.chatingAplication.dto.ChatRoomDto;
import com.example.chatingAplication.dto.GroupSearchField;
import com.example.chatingAplication.models.ChatRoom;
import com.example.chatingAplication.models.Messages;
import com.example.chatingAplication.models.UserProfile;
import com.example.chatingAplication.repo.ChatRoomRepo;
import com.example.chatingAplication.repo.MessagesRepo;
import com.example.chatingAplication.repo.UserProfileRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;


import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.springframework.data.mongodb.core.query.Criteria.where;

@Service
public class ChatServiceImpl {

    @Autowired
    private ChatRoomRepo chatRoomRepo;
    @Autowired
    private UserProfileRepo userProfileRepo;
    @Autowired
    private MessagesRepo messagesRepo;
    @Autowired
    private MongoTemplate mongoTemplate;
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    public boolean checkChatRoomExistence( String chatRoomId ){
        Optional<ChatRoom> optChatRoom = this.chatRoomRepo.findById( chatRoomId );
        return optChatRoom.isPresent();
    }

    public List<ChatRoom> checkPrivateConversationExistence( String participantId, String userId ){
        Query query = new Query();
        query.addCriteria( where("chatRoomStatus").is( true ) );
        query.addCriteria( where("participants").all(List.of(participantId, userId)));
        List<ChatRoom> chatRooms = mongoTemplate.find(query, ChatRoom.class);
//        if( chatRooms.size() != 0 ){ return true; }
//        return false;
        return chatRooms;
    }

    public String joinChatRoom( String chatRoomId, String userId  ){
        Optional<ChatRoom> optChatRoom = this.chatRoomRepo.findById( chatRoomId );
        if( optChatRoom.get().isChatRoomStatus() ) { return null; }
        if( !optChatRoom.get().getParticipants().contains( userId ) ){
            optChatRoom.get().getParticipants().add( userId );
            ChatRoom chatRoom = this.chatRoomRepo.save( optChatRoom.get() );
            return chatRoom.getId();
        }
        return null;
    }

    public String createPrivateChat(  String participantId, String userId  ){
        Optional<UserProfile> optUserProfile = this.userProfileRepo.findById( userId );
        if ( optUserProfile.isEmpty() ) { return null; }
        List<String> participants = new ArrayList<>();
        participants.add( userId );
        participants.add( participantId );
        List<String> permanentParticipants = new ArrayList<>();
//        permanentParticipants.add( userId );
//        permanentParticipants.add( participantId );

        ChatRoom chatRoom = new ChatRoom( "Private Conversation",  "Private Conversation", LocalDateTime.now(),
                userId, null, true, new ArrayList<String>(),
                null, participants);
//        chatRoom.setPermanentParticipants( permanentParticipants );
        chatRoom = this.chatRoomRepo.save( chatRoom );
        return chatRoom.getId();
    }

    public void addChatRoomToUserProfile( String chatRoomId, String userId ){
        Optional<UserProfile> optUserProfile = this.userProfileRepo.findById( userId );
        if ( !optUserProfile.isPresent() ){ return; }
        if( !optUserProfile.get().getChatRooms().contains( chatRoomId ) ){
            optUserProfile.get().getChatRooms().add( chatRoomId );
            this.userProfileRepo.save( optUserProfile.get() );
        }
    }

    public List<Messages> getMessagesOfChatRoom( String chatRoomId ){
        Query query = new Query();
        query.addCriteria( where("chatRoomId").is( chatRoomId ) );
        query.with( Sort.by( Sort.Direction.ASC, "messageTime" ) );
        return mongoTemplate.find(query, Messages.class);
    }

    public void sendMessage( Messages message, String userId ){
        Optional<ChatRoom> optChatRoom = this.chatRoomRepo.findById( message.getChatRoomId() );
        Optional<UserProfile> optUserProfile = this.userProfileRepo.findById( userId );
        if ( optChatRoom.isEmpty() ){ return; }
        if( optUserProfile.isEmpty() ){ return; }
        if( !optUserProfile.get().getChatRooms().contains( message.getChatRoomId() ) ){ return; }

        message.setMessageTime( LocalDateTime.now() );
        // message.getSeenMessage().add( userId );
        message.setUserName( optUserProfile.get().getUserName() );
        message.setProfilePhoto( optUserProfile.get().getProfilePhoto() );
        message.setDeletedParticipantId( new ArrayList<>());
        message = this.messagesRepo.save(message);

        optChatRoom.get().getMesages().add( message.getId() );
        this.chatRoomRepo.save( optChatRoom.get() );

        for( String id : optChatRoom.get().getParticipants() ){
            if( !id.equals( userId ) ){
                Optional<UserProfile> optCoTalkerProfile = this.userProfileRepo.findById( id );
                if( optCoTalkerProfile.isPresent() ){
                    if( optChatRoom.get().isChatRoomStatus() && !optCoTalkerProfile.get().getChatRooms().contains( message.getChatRoomId() ) ){
                        optCoTalkerProfile.get().getChatRooms().add( message.getChatRoomId() );
                        this.addChatRoomToUserProfile( message.getChatRoomId(), id );
                    }
                }
            }
        }
        // + optChatRoom.get().getId() + coTalkerId
        simpMessagingTemplate.convertAndSend("/topic/notification" , message );
    }

    public void makeMessageSeen( String userId, String messageId ){
        Optional<Messages> optMessage = this.messagesRepo.findById( messageId );
        if( optMessage.isEmpty() ){ return; }
        if( !optMessage.get().getSeenMessage().contains( userId ) ){
            optMessage.get().getSeenMessage().add( userId );
            this.messagesRepo.save( optMessage.get() );
        }
    }

    public String deleteMessage( String id ){
        Optional<Messages> optMessage = this.messagesRepo.findById( id );
        if( optMessage.isEmpty() ){ return null; }

        this.messagesRepo.deleteById( id );
        return optMessage.get().getChatRoomId();
    }

    public void removeMessageFromChatRoom( String chatRoomId, String id ){
        Optional<ChatRoom> optChatRoom = this.chatRoomRepo.findById( chatRoomId );
        if( optChatRoom.isEmpty() ){ return; }
        optChatRoom.get().getMesages().remove( id );
        this.chatRoomRepo.save( optChatRoom.get() );
    }

    public List<ChatRoom> getUserChatRooms( String id ){

        Optional<UserProfile> optUserProfile = this.userProfileRepo.findById( id );
        if( optUserProfile.isEmpty() ){ return new ArrayList<>(); }

        Query query = new Query();
//        query.addCriteria( where("participants").is( id ) );
        query.addCriteria( where("id").in( optUserProfile.get().getChatRooms() ) );
        query.addCriteria( where("name").is( "Private Conversation" ) );
        query.with( Sort.by( Sort.Direction.DESC,"recentConversation" ) );

        return mongoTemplate.find(query, ChatRoom.class);
    }

    public List<String> deleteChatRoom( String id ){
        Optional<ChatRoom> optChatRoom = this.chatRoomRepo.findById( id );
        if( optChatRoom.isEmpty() ){ return null; }
        for( String userId : optChatRoom.get().getParticipants() ){
            Optional<UserProfile> optUserProfile = this.userProfileRepo.findById( userId );
            if( optUserProfile.isPresent() ){
                if( optUserProfile.get().getChatRooms().contains( id ) ){
                    optUserProfile.get().getChatRooms().remove( id );
                    this.userProfileRepo.save( optUserProfile.get() );
                }
            }
        }
        List<String> messageIdList = optChatRoom.get().getMesages();
        this.chatRoomRepo.deleteById( id );
        return messageIdList;
    }

    public boolean checkChatRoomExistenceByName( String chatRoomName ){
        if( chatRoomName.trim().equalsIgnoreCase("private conversation") ){ return true; }
        Optional<ChatRoom> optChatRoom = this.chatRoomRepo.findByName( chatRoomName );
        return optChatRoom.isPresent();
    }

    public ChatRoom createGroup( String userId, String groupType, ChatRoomDto chatRoomData ){
        List<String> participants = new ArrayList<>();
        participants.add( userId );
        String joinCode = null ;
        if( groupType.equalsIgnoreCase("private") ){ joinCode = chatRoomData.getJoinCode(); }
        ChatRoom chatRoom = new ChatRoom( chatRoomData.getName(), chatRoomData.getTopic(), LocalDateTime.now() , userId, joinCode, false, new ArrayList<>(), groupType, participants, chatRoomData.getAbout(), List.of( chatRoomData.getLanguages() ) );
        chatRoom = this.chatRoomRepo.save( chatRoom );
        Optional<UserProfile> optUserProfile = this.userProfileRepo.findById( userId );
        optUserProfile.get().getChatRooms().add( chatRoom.getId() );
        this.userProfileRepo.save( optUserProfile.get() );
        return chatRoom;
    }

    public Page<ChatRoom> searchDbGroups(GroupSearchField groupSearchField, Pageable pageable ){
        Query query = new Query();

        if( groupSearchField.getLanguages() != null ){ query.addCriteria( where("languages").is( groupSearchField.getLanguages() ) ); }
        if( groupSearchField.getTopic() != null ){ query.addCriteria( where("topic").is( groupSearchField.getTopic() ) ); }
        if( groupSearchField.getName() != null ){ query.addCriteria( where("name").is( groupSearchField.getName() ) ); }
        query.addCriteria( where("chatType").is( groupSearchField.getChatType() ) );

        long count = mongoTemplate.count(query.skip(-1).limit(-1), ChatRoom.class);
        // e shtuar
        query.with( pageable );
        query.skip( pageable.getPageSize() * pageable.getPageNumber() );
        query.limit( pageable.getPageSize() );
        List<ChatRoom> chatRooms = mongoTemplate.find(query, ChatRoom.class);
        return new PageImpl<ChatRoom>(chatRooms, pageable, count);
    }

    public List<ChatRoom> getChatRooms(String userId, String chatType ){
        Query query = new Query();
        query.addCriteria( where("chatType").is( chatType ) );
        query.addCriteria( where("participants").is( userId ) );
        query.with( Sort.by( Sort.Direction.DESC,"recentConversation" ) );

        return mongoTemplate.find(query, ChatRoom.class);
    }

    public void removeUserFromChatRoom( String id, String userId ){
        Optional<ChatRoom> optChatRoom = this.chatRoomRepo.findById( id );
        if( optChatRoom.isEmpty() ){ return; }
        optChatRoom.get().getParticipants().remove( userId );
        this.chatRoomRepo.save( optChatRoom.get() );
    }

    public void updateChatRoomPage( String chatRoomId, ChatRoomDto chatRoomData ){
        Optional<ChatRoom> optChatRoom = this.chatRoomRepo.findById( chatRoomId );
        if( optChatRoom.isEmpty() ){ return; }
        optChatRoom.get().setName( chatRoomData.getName() );
        optChatRoom.get().setTopic( chatRoomData.getTopic() );
        this.chatRoomRepo.save( optChatRoom.get() );
    }

    public ChatRoom getChatRoomDetails( String id ){
        Optional<ChatRoom> optChatRoom = this.chatRoomRepo.findById( id );
        if( optChatRoom.isEmpty() ){ return null; }
        return optChatRoom.get();
    }

    public boolean checkChatRoomIfEmpty( String chatRoomId, String userId ){
        Optional<ChatRoom> optChatRoom = this.chatRoomRepo.findById( chatRoomId );
        if( optChatRoom.isEmpty() ){ return true; }
        for( String id : optChatRoom.get().getParticipants()){
            if( !id.equals( userId )){
                Optional<UserProfile> optUserProfile = this.userProfileRepo.findById( id );
                if( optUserProfile.isEmpty() ){ return true; }
                if( optUserProfile.get().getChatRooms().contains( chatRoomId ) ){ return false; }
            }
        }
        return true;
    }

    public void messageSoftDelete( String chatRoomId, String userId ){
        List<Messages> messages = this.messagesRepo.findByChatRoomId( chatRoomId );
        for ( Messages message : messages ){
            if( !message.getDeletedParticipantId().contains( userId ) ){
                message.getDeletedParticipantId().add( userId );
            }
        }
        this.messagesRepo.saveAll( messages );
    }

    public void softDeleteMessage( String messageId , String userId  ){
        Optional<Messages> optMessage = this.messagesRepo.findById( messageId );
        if( optMessage.isEmpty() ){ return; }
        if( !optMessage.get().getDeletedParticipantId().contains( userId ) ){
            optMessage.get().getDeletedParticipantId().add( userId );
            this.messagesRepo.save( optMessage.get() );
        }
    }

    public Optional<Messages> getMessage( String messageId ){
        return this.messagesRepo.findById( messageId );
    }

    public boolean canMessageBeDeleted( String userId, Messages messages ){
        Optional<UserProfile> optUserProfile = this.userProfileRepo.findById( userId );
        if( optUserProfile.isEmpty() ){ return false; }
        if( optUserProfile.get().getChatRooms().contains( messages.getChatRoomId() ) ){ return true; }
        return false;
    }

}
