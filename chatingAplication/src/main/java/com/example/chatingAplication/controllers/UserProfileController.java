package com.example.chatingAplication.controllers;

import com.example.chatingAplication.config.HandledException;
import com.example.chatingAplication.dto.*;
import com.example.chatingAplication.models.UserProfile;
import com.example.chatingAplication.repo.CityRepo;
import com.example.chatingAplication.repo.LanguageRepo;
import com.example.chatingAplication.services.UserProfileServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/user/")
@CrossOrigin("*")
public class UserProfileController {

    @Autowired
    private CityRepo cityRepo;
    @Autowired
    private com.example.chatingAplication.repo.InterestRepo interestRepo;
    @Autowired
    private LanguageRepo languageRepo;
    @Autowired
    private UserProfileServiceImpl userProfileSevice;

    private String namePattern = "[A-Z]{1,1}[a-zA-Z]{2,19}";
    private String emailPattern = "[a-zA-Z0-9]+@[a-zA-Z]+\\.[a-zA-Z]{3,3}" ;
    private String phonePattern = "[0-9]+";

    @ResponseStatus(HttpStatus.OK)
    @PostMapping("create-user")
    public void createUserByEmail(@RequestBody UserRegistrationData userRegistrationData ){

        String registrationCheckResultError = checkingRegistrationDataForBlankFields( userRegistrationData );
        if ( registrationCheckResultError != null ){ throw new HandledException( " Error occurred " + registrationCheckResultError ); }

        String regexError = checkingRegistrationDataFieldsFormat( userRegistrationData );
        if ( regexError != null ){ throw new HandledException( regexError ); }

        String passwordLengthError = checkingPasswordOptimalLength( userRegistrationData.getPassword() );
        if ( passwordLengthError != null ){ throw new HandledException( "PasswordLengthError " + passwordLengthError ); }

        Optional<UserProfile> optProfile = this.userProfileSevice.findProfileByUserName( userRegistrationData.getUserName() );
        if ( optProfile.isPresent() ){ throw new HandledException( "User Name is taken." ); }

        optProfile = this.userProfileSevice.findProfileByEmail( userRegistrationData.getEmail() );
        if ( optProfile.isPresent() ){ throw new HandledException( "Already exist one account with specific email." ); }

        UserProfile newUserProfile = new UserProfile( userRegistrationData.getName(), userRegistrationData.getLastName(),
                userRegistrationData.getPassword(), userRegistrationData.getEmail(),
                userRegistrationData.getTel(), false, "", userRegistrationData.getUserName(),
                "", new ArrayList<>(), new ArrayList<>(), new ArrayList<>(), "" );
        this.userProfileSevice.createNewUserProfile( newUserProfile );
    }

    @ResponseStatus(HttpStatus.OK)
    @PostMapping(path = "login" )
    public ResponseEntity<MessageResponse> login(@RequestBody LoginDto loginData ){

        if ( loginData.getEmail() == null || loginData.getEmail().isBlank() ){
            throw new HandledException( "Email error" );
        }else{
            boolean regexCheck = Pattern.matches(this.emailPattern, loginData.getEmail().trim() );
            if ( !regexCheck ){ throw new HandledException( "Email not in right format" ); }
        }
        if ( loginData.getPassword() == null || loginData.getPassword().isBlank() ){ throw new HandledException( "Password Error" ); }
        String userId = null;
        if ( !loginData.getEmail().isBlank() ) {
            userId = this.userProfileSevice.LoginUserByEmail(loginData.getEmail(), loginData.getPassword());
        }
        return new ResponseEntity<>(new MessageResponse( userId ), HttpStatus.OK);
    }

    @ResponseStatus(HttpStatus.OK)
    @GetMapping("check-user-status/{id}")
    public boolean checkUserStatus( @PathVariable("id") String id ){
        if( id.equals("0") ){ return false; }
        Optional<UserProfile> optUserProfile = this.userProfileSevice.getUserProfileById( id );
        if( optUserProfile.isEmpty() ){ return false; }
        return optUserProfile.get().isUserActive();
    }

    @ResponseStatus(HttpStatus.OK)
    @GetMapping("user-profile/{id}")
    public UserProfile getUserProfileById( @PathVariable("id") String id ){
        if( id.equals('0') ){ throw new HandledException( "User Profile not found" ); }
        Optional<UserProfile> optUserProfile = this.userProfileSevice.getUserProfileById( id );
        if ( !optUserProfile.isPresent() ){ throw new HandledException( "User Profile not found" ); }
        return optUserProfile.get();
    }

    @ResponseStatus(HttpStatus.OK)
    @GetMapping("get-user-details/{id}")
    public UserDataFront getUserDetails( @PathVariable("id") String id ){
        if( id.equals('0') ){ throw new HandledException( "User Profile not found" ); }
        Optional<UserProfile> optUserProfile = this.userProfileSevice.getUserProfileById( id );
        if( optUserProfile.isEmpty() ){ throw new HandledException( "User Profile not found" ); }
        return new UserDataFront( optUserProfile.get().getId(), optUserProfile.get().getName(), optUserProfile.get().isUserActive(),
                optUserProfile.get().getProfilePhoto(), optUserProfile.get().getUserName(), optUserProfile.get().getCity(),
                optUserProfile.get().getLanguages(), optUserProfile.get().getInterests(), optUserProfile.get().getAbout() );
    }

    @ResponseStatus(HttpStatus.OK)
    @PostMapping("search-profile")
    public Page<UserProfile> searchDbForUserProfile( @RequestBody ProfileSearchParameters profileSearchParameters, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "2") int size ){
        Pageable paging = PageRequest.of(page, size );
        Page<UserProfile> userProfiles = this.userProfileSevice.searchDbForUserProfile( profileSearchParameters, paging );
        return userProfiles;
//        List<UserDataFront> userDataFrontList = new ArrayList<>();
//        for( UserProfile userProfile : userProfiles ){
//            userDataFrontList.add( new UserDataFront( userProfile.getId(), userProfile.getName(), userProfile.isUserActive(),
//                    userProfile.getProfilePhoto(), userProfile.getUserName(), userProfile.getCity(),
//                    userProfile.getLanguages(), userProfile.getInterests(), "" ) );
//        }
//        return userDataFrontList;
    }

    @ResponseStatus(HttpStatus.OK)
    @GetMapping("log-out/{id}")
    public void logOut( @PathVariable("id") String id ){
        if( id.equals('0') ){ return; }
        this.userProfileSevice.logOut( id );
    }

    @ResponseStatus(HttpStatus.OK)
    @GetMapping("get-chat-room-users/{id}")
    public List<UserProfile> getChatRoomUsers( @PathVariable("id") String id ){
        return this.userProfileSevice.getChatRoomUsers( id );
    }

    @ResponseStatus(HttpStatus.OK)
    @PutMapping("modify-password/{id}")
    public void modifyPassword( @PathVariable("id") String id, @RequestBody String password ){
        if( id.equals('0') ){ return; }
        this.userProfileSevice.modifyPassword( id, password );
    }

    @ResponseStatus(HttpStatus.OK)
    @PutMapping("modify-last-name/{id}")
    public void modifyLastName( @PathVariable("id") String id, @RequestBody String lastName ){
        if( id.equals('0') ){ return; }
        this.userProfileSevice.modifyLastName( id, lastName );
    }

    @ResponseStatus(HttpStatus.OK)
    @PutMapping("modify-about/{id}")
    public void modifyAbout( @PathVariable("id") String id, @RequestBody String about ){
        if( id.equals('0') ){ return; }
        this.userProfileSevice.modifyAbout( id, about );
    }

    @ResponseStatus(HttpStatus.OK)
    @PutMapping("modify-name/{id}")
    public void modifyName( @PathVariable("id") String id, @RequestBody String name ){
        if( id.equals('0') ){ return; }
        this.userProfileSevice.modifyName( id, name );
    }

    @ResponseStatus(HttpStatus.OK)
    @PutMapping("modify-email/{id}")
    public void modifyEmail( @PathVariable("id") String id, @RequestBody String email ){
        if( id.equals('0') ){ return; }
        Optional<UserProfile> optUserProfile = this.userProfileSevice.findProfileByEmail( email );
        if ( optUserProfile.isPresent() ){ throw new HandledException( "Email exists." ); }
        this.userProfileSevice.modifyEmail( id, email );
    }

    @ResponseStatus(HttpStatus.OK)
    @PutMapping("modify-user-name/{id}")
    public void modifyUserName( @PathVariable("id") String id, @RequestBody String userName ){
        if( id.equals('0') ){ return; }
        Optional<UserProfile> optUserProfile = this.userProfileSevice.findProfileByUserName( userName );
        if ( optUserProfile.isPresent() ){ throw new HandledException( "User Name exists." ); }
        this.userProfileSevice.modifyUserName( id, userName );
    }

    @ResponseStatus(HttpStatus.OK)
    @PutMapping("remove-language/{id}")
    public void removeLanguage( @PathVariable("id") String id, @RequestBody String language ){
        if( id.equals('0') ){ return; }
        this.userProfileSevice.removeLanguage( id, language );
    }

    @ResponseStatus(HttpStatus.OK)
    @PutMapping("remove-interest/{id}")
    public void removeInterest( @PathVariable("id") String id, @RequestBody String interest ){
        if( id.equals('0') ){ return; }
        this.userProfileSevice.removeInterest( id, interest );
    }

    @ResponseStatus(HttpStatus.OK)
    @PutMapping("set-interest/{id}")
    public void setInterest( @PathVariable("id") String id, @RequestBody String interest ){
        if( id.equals('0') ){ return; }
        this.userProfileSevice.setInterest( id, interest );
    }

    @ResponseStatus(HttpStatus.OK)
    @PutMapping("set-city/{id}")
    public void setCity( @PathVariable("id") String id, @RequestBody String city ){
        if( id.equals('0') ){ return; }
        this.userProfileSevice.setCity( id, city );
    }

    @ResponseStatus(HttpStatus.OK)
    @PutMapping("set-language/{id}")
    public void setLanguage( @PathVariable("id") String id, @RequestBody String language  ){
        if( id.equals('0') ){ return; }
        this.userProfileSevice.setLanguage( id, language );
    }

    private String checkingRegistrationDataForBlankFields( UserRegistrationData userRegistrationData ){
        if ( ( userRegistrationData.getEmail() == null || userRegistrationData.getEmail().isBlank() ) && ( userRegistrationData.getTel() == null ) ) { return "Email/Tel "; }
        if ( userRegistrationData.getName() == null || userRegistrationData.getName().isBlank() ){ return "Name"; }
        if ( userRegistrationData.getLastName() == null || userRegistrationData.getLastName().isBlank() ){ return "Last Name"; }
        if ( userRegistrationData.getPassword() == null || userRegistrationData.getPassword().isBlank() ){ return "Password"; }
        if( userRegistrationData.getUserName() == null || userRegistrationData.getUserName().isBlank() ){ return "Username"; }

        boolean regexCheck = Pattern.matches(this.emailPattern, userRegistrationData.getEmail().trim() );
        if ( !regexCheck ){ throw new HandledException( "Email/Tel not in right format" ); }

        regexCheck = Pattern.matches(this.phonePattern, userRegistrationData.getTel() + "" );
        if ( userRegistrationData.getTel() != null && !regexCheck ){ throw new HandledException( "Email/Tel not in right format" ); }

        regexCheck = Pattern.matches(this.phonePattern, userRegistrationData.getLastName() );
        if ( regexCheck ){ throw new HandledException( "Last Name not in right format" ); }
        return null;
    }

    private String checkingRegistrationDataFieldsFormat( UserRegistrationData userRegistrationData ){
        boolean regexCheck = Pattern.matches(this.emailPattern, userRegistrationData.getEmail().trim() );
        if ( !regexCheck ){ return "Email/Tel not in right format"; }
        regexCheck = Pattern.matches(this.phonePattern, userRegistrationData.getTel() + "" );
        if ( userRegistrationData.getTel() != null && !regexCheck ){ return "Email/Tel not in right format"; }
        regexCheck = Pattern.matches(this.namePattern, userRegistrationData.getLastName() );
        if ( !regexCheck ){ return "Last Name not in right format"; }
        regexCheck = Pattern.matches(this.namePattern, userRegistrationData.getName() );
        if ( !regexCheck ){ return "Name not in right format"; }
        return null;
    }

    private String checkingPasswordOptimalLength( String password ){
        if ( password.length() > 16 ){ return "Password To Long."; }
        if ( password.length() < 5 ){ return "Password To Short"; }
        return null;
    }

    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ExceptionHandler(HandledException.class)
    public Exception handleNotFound(Exception exception ){ return exception; }

}
