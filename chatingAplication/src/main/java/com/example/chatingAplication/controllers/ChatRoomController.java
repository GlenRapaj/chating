package com.example.chatingAplication.controllers;

import com.example.chatingAplication.config.HandledException;
import com.example.chatingAplication.dto.ChatRoomDto;
import com.example.chatingAplication.dto.GroupSearchField;
import com.example.chatingAplication.dto.MessageResponse;
import com.example.chatingAplication.models.ChatRoom;
import com.example.chatingAplication.models.Language;
import com.example.chatingAplication.models.Messages;
import com.example.chatingAplication.models.UserProfile;
import com.example.chatingAplication.repo.LanguageRepo;
import com.example.chatingAplication.services.UserProfileServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@RestController
@RequestMapping("/chat/")
@CrossOrigin("*")
public class ChatRoomController {

    @Autowired
    private com.example.chatingAplication.services.ChatServiceImpl chatServiceImpl;
    @Autowired
    private LanguageRepo languageRepo;
    @Autowired
    private UserProfileServiceImpl userProfileService;
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @PostMapping("create-join-chat/{id}")
    public MessageResponse createOrJoin(@RequestBody String chatRoomId, @PathVariable("id") String userId ){
        if( userId.equals("0") ){ return null; }
        boolean exist = this.chatServiceImpl.checkChatRoomExistence( chatRoomId );
        String chatId = null;
        if( exist ){
            chatId = this.chatServiceImpl.joinChatRoom( chatRoomId, userId );
            if( chatId == null ){ throw new HandledException( "Something went wrong." ); }
        }else{
            List<ChatRoom> chatRooms = this.chatServiceImpl.checkPrivateConversationExistence( chatRoomId, userId );
            if( chatRooms.size() != 0 ){
                this.chatServiceImpl.addChatRoomToUserProfile( chatRooms.get(0).getId(), userId );
                chatId = chatRooms.get(0).getId();
            }else{
                chatId = this.chatServiceImpl.createPrivateChat( chatRoomId, userId  );
                this.chatServiceImpl.addChatRoomToUserProfile( chatId, chatRoomId );
            }
        }
        this.chatServiceImpl.addChatRoomToUserProfile( chatId, userId );
        return new MessageResponse( chatId );
    }

    @GetMapping("get-chat-room-messages/{id}")
    public List<Messages> getChatRoomMessages( @PathVariable("id") String id){
        return this.chatServiceImpl.getMessagesOfChatRoom( id );
    }

    @PostMapping("send-message/{id}")
    public void sendMessage( @RequestBody Messages message, @PathVariable("id") String id ){
        this.chatServiceImpl.sendMessage( message, id );
    }

    @GetMapping("seen-message/{id}/{messageId}")
    public void makeMessageSeen( @PathVariable("id") String id, @PathVariable("messageId") String messageId ){
        this.chatServiceImpl.makeMessageSeen( id, messageId );
    }

    @DeleteMapping("delete-message/{id}/{userId}")
    public void deleteMessage( @PathVariable("id") String id, @PathVariable("userId") String userId ){
        if( userId.equals("0") ){ return; }
        Optional<Messages> optMessages = this.chatServiceImpl.getMessage( id );
        if( optMessages.isEmpty() ){ return; }
        if( !optMessages.get().getUserId().equals( userId ) ){ return; }
        boolean canDelete = this.chatServiceImpl.canMessageBeDeleted( userId, optMessages.get() );
        if( !canDelete ){ return; }
        String chatRoomId = this.chatServiceImpl.deleteMessage( id );
        if( chatRoomId != null ){
            this.chatServiceImpl.removeMessageFromChatRoom( chatRoomId, id );
        }
        optMessages.get().setDeleted(true);
        this.simpMessagingTemplate.convertAndSend("/topic/notification" , optMessages.get() );
    }

    @GetMapping("chat-rooms/{id}")
    public List<ChatRoom> getUserChatRooms( @PathVariable("id") String id ){
        return this.chatServiceImpl.getUserChatRooms( id );
    }

    @DeleteMapping("delete-chat-room/{id}")
    public void deleteChatRoom( @PathVariable("id") String id ){
        List<String> messageIdList = this.chatServiceImpl.deleteChatRoom( id );
        if( messageIdList == null ){ throw new HandledException( "Chat Room not found" ); }
        for( String messageId : messageIdList ){
            this.chatServiceImpl.deleteMessage( messageId );
        }
    }

    @PostMapping("create-group/{id}/{groupType}")
    public ChatRoom createGroup(@PathVariable("id") String userId, @PathVariable("groupType") String groupType, @RequestBody ChatRoomDto chatRoomData ){
        String validationAnswer = this.chatRoomDataValidation( chatRoomData );
        if( validationAnswer != null ){ throw new HandledException( validationAnswer ); }
        boolean chatRoomExists = this.chatServiceImpl.checkChatRoomExistenceByName( chatRoomData.getName() );
        if( chatRoomExists ){ throw new HandledException( "Group Already Exists." ); }
        if( chatRoomData.getChatType() == null || chatRoomData.getChatType().isBlank() ){ throw new HandledException( "Type of Group is not in the right format." ); }
        if( !groupType.equalsIgnoreCase("private") && !groupType.equalsIgnoreCase("public") ){ throw new HandledException( "Type of Group is not in the right format." ); }
        if( ( groupType.equalsIgnoreCase("private") ) && ( chatRoomData.getJoinCode() == null || chatRoomData.getJoinCode().isBlank() ) ){ throw new HandledException( "Join Code of Group is not in the right format." ); }
        Optional< UserProfile > optUserProfile = this.userProfileService.getUserProfileById( userId );
        if( optUserProfile.isEmpty() ){ throw new HandledException( "You Should register first." ); }
        ChatRoom chatRoom = this.chatServiceImpl.createGroup( userId, groupType, chatRoomData );
        // e shtuar
//        this.chatServiceImpl.joinChatRoom( chatRoom.getId(), userId );
        return chatRoom;
    }

    @ResponseStatus(HttpStatus.OK)
    @PostMapping("search-groups")
    public Page<ChatRoom> searchGroups(@RequestBody GroupSearchField groupSearchField, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "3") int size ){
        Optional< UserProfile > optUserProfile = this.userProfileService.getUserProfileById( groupSearchField.getId() );
        if( optUserProfile.isEmpty() && groupSearchField.getChatType().equals("private") ){ throw new HandledException( "You Should register first." ); }
        Pageable paging = PageRequest.of(page, size, Sort.by( "recentConversation" ).descending() );
        return this.chatServiceImpl.searchDbGroups( groupSearchField, paging );
    }

    @ResponseStatus(HttpStatus.OK)
    @GetMapping("get-chat-rooms/{id}/{chatType}")
    public List<ChatRoom> getChatRooms(@PathVariable("id") String userId, @PathVariable("chatType") String chatType ){
        return this.chatServiceImpl.getChatRooms( userId, chatType );
    }

    @ResponseStatus(HttpStatus.OK)
    @GetMapping("leave-chat-room/{id}/{userId}")
    public void leaveChatRoomGroup( @PathVariable("id") String id, @PathVariable("userId") String userId ){
        if( userId.equals("0") ){ return; }
        this.userProfileService.removeChatRoomFromUser( id, userId );
//        this.chatServiceImpl.removeUserFromChatRoom( id, userId );
        //this.chatServiceImpl.deleteChatRoomIfEmpty( id );
    }

    @ResponseStatus(HttpStatus.OK)
    @PutMapping("update-chat-room-page/{chatRoomId}/{id}")
    public void updateChatRoomPage( @PathVariable("chatRoomId") String chatRoomId, @PathVariable("id") String id, @RequestBody ChatRoomDto chatRoomData ){
        if( id.equals("0") ){ return; }
        if( chatRoomData.getName() == null || chatRoomData.getName().isBlank() || chatRoomData.getTopic() == null || chatRoomData.getTopic().isBlank() ){ return; }
        this.chatServiceImpl.updateChatRoomPage( chatRoomId, chatRoomData );
    }

    @ResponseStatus(HttpStatus.OK)
    @GetMapping("chat-room-details/{id}")
    public ChatRoom chatRoomDetails( @PathVariable("id") String id ){
        boolean exist = this.chatServiceImpl.checkChatRoomExistence( id );
        if( !exist ){ return null; }
        return this.chatServiceImpl.getChatRoomDetails( id );
    }

    @ResponseStatus(HttpStatus.OK)
    @DeleteMapping("leave-delete-private-conversation/{chatId}/{userId}")
    public void leaveDeletePrivateConversation( @PathVariable("chatId") String chatRoomId , @PathVariable("userId") String userId  ){
        if( userId.equals("0") ){ return; }
        boolean exist = this.chatServiceImpl.checkChatRoomExistence( chatRoomId );
        if( !exist ){ return; }
        this.userProfileService.removeChatRoomFromUser( chatRoomId, userId );
//        this.chatServiceImpl.removeUserFromChatRoom( chatRoomId, userId );
        this.chatServiceImpl.messageSoftDelete( chatRoomId, userId );
        boolean isEmptyOfParticipants = this.chatServiceImpl.checkChatRoomIfEmpty( chatRoomId, userId );
        if( isEmptyOfParticipants ){
            List<String> messageIdList = this.chatServiceImpl.deleteChatRoom( chatRoomId );
            if( messageIdList == null ){ return; }
            for( String messageId : messageIdList ){
                this.chatServiceImpl.deleteMessage( messageId );
            }
        }
    }

    @ResponseStatus(HttpStatus.OK)
    @DeleteMapping("soft-delete-message/{messageId}/{userId}")
    public void softDeleteMessage( @PathVariable("messageId") String messageId , @PathVariable("userId") String userId  ){
        this.chatServiceImpl.softDeleteMessage( messageId, userId );
    }

    public String chatRoomDataValidation( ChatRoomDto chatRoomData ){
        if( chatRoomData.getName() == null || chatRoomData.getName().isBlank() ){ return "Name of Group is required."; }
        if( chatRoomData.getTopic() == null || chatRoomData.getTopic().isBlank() ){ return "Topic of Group is required."; }
        if( chatRoomData.getLanguages() == null || chatRoomData.getLanguages().isBlank() ){ return "Language of Group is required."; }
        if( chatRoomData.getName().length() < 3 ){ return "Name of Group should be at least 3 character long."; }
        if( chatRoomData.getName().length() < 3 ){ return "Topic of Group should be at least 3 character long."; }
        List<Language> languages = this.languageRepo.findAll();
        Set<String> languagesSet = new HashSet<>();

        for( Language language : languages ){
            languagesSet.add( language.getLanguage() );
        }
        if( !languagesSet.contains( chatRoomData.getLanguages() ) ){
            return "Choose a valid Language.";
        }
        return null;
    }

    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ExceptionHandler(HandledException.class)
    public Exception handleNotFound(Exception exception ){ return exception; }
}
