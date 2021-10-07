package com.example.chatingAplication.services;

import com.example.chatingAplication.dto.ProfileSearchParameters;
import com.example.chatingAplication.models.UserProfile;
import com.example.chatingAplication.repo.UserProfileRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Optional;

import static org.springframework.data.mongodb.core.query.Criteria.where;

@Service
public class UserProfileServiceImpl {  // UserProfileSeviceImpl

    @Autowired
    private UserProfileRepo userProfileRepo;

    @Autowired
    private MongoTemplate mongoTemplate;

    public void createNewUserProfile( UserProfile newUserProfile ){
        this.userProfileRepo.save( newUserProfile );
    }

    public Optional<UserProfile> findProfileByUserName( String userName ){
        return this.userProfileRepo.findByUserName( userName );
    }

    public Optional<UserProfile> findProfileByEmail( String email ){
        return this.userProfileRepo.findByEmail( email );
    }

    public Optional<UserProfile> findProfileByPhoneNumber( Integer tel ){
        if ( tel != null )
            return this.userProfileRepo.findByTel( tel );
        return null;
    }

    public String LoginUserByEmail(String email, String password ){
        Optional<UserProfile> optUserProfile = this.userProfileRepo.findByEmail( email );

        if ( optUserProfile.isPresent() ){
            UserProfile userProfile = optUserProfile.get();

            if ( userProfile.getPassword().equalsIgnoreCase( password ) ){
                userProfile.setUserActive( true );
                this.userProfileRepo.save( userProfile );
                return userProfile.getId();
            }
        }
        return null;
    }

    public String LoginUserByPhone(int tel, String password ){
        Optional<UserProfile> optUserProfile = this.userProfileRepo.findByTel( tel );
        if ( optUserProfile.isPresent() ){
            UserProfile userProfile = optUserProfile.get();
            if ( userProfile.getPassword().equalsIgnoreCase( password ) ){
                userProfile.setUserActive( true );
                this.userProfileRepo.save( userProfile );
                return userProfile.getId();
            }
        }
        return null;
    }

    public Optional<UserProfile> getUserProfileById( String id ){
        return this.userProfileRepo.findById( id );
    }

    public void logOut( String id ){
        Optional<UserProfile> optUserProfile = this.userProfileRepo.findById( id );
        if( optUserProfile.isEmpty() ){ return; }
        optUserProfile.get().setUserActive( false );
        this.userProfileRepo.save( optUserProfile.get() );
    }

    public Page<UserProfile> searchDbForUserProfile(ProfileSearchParameters profileSearchParameters, Pageable pageable  ){ // List<UserProfile>
        Query query = new Query();
        if( profileSearchParameters.getCity() != null ){ query.addCriteria( where("city").is( profileSearchParameters.getCity() ) ); }
        if( profileSearchParameters.getInterests() != null ){ query.addCriteria( where("interests").is( profileSearchParameters.getInterests() ) ); }
        if( profileSearchParameters.getLanguages() != null ){ query.addCriteria( where("languages").is( profileSearchParameters.getLanguages() ) ); }
        if( profileSearchParameters.getUserName() != null ){ query.addCriteria( where("userName").is( profileSearchParameters.getUserName() ) ); }
        query.addCriteria( where("userActive").is( true ) );

        long count = mongoTemplate.count(query.skip(-1).limit(-1), UserProfile.class);

        query.with( pageable );
        query.skip((long) pageable.getPageSize() * pageable.getPageNumber() );
        query.limit( pageable.getPageSize() );

        List<UserProfile> UserProfiles = mongoTemplate.find(query, UserProfile.class);
        return new PageImpl<UserProfile>(UserProfiles, pageable, count);
    }

    public List<UserProfile> getChatRoomUsers( String id ){
        Query query = new Query();
        query.addCriteria( where("userActive").is( true ) );
        query.addCriteria( where("chatRooms").is( id ) );
        return mongoTemplate.find(query, UserProfile.class);
    }

    public void removeChatRoomFromUser( String id, String userId ){
        Optional<UserProfile> optUserProfile = this.userProfileRepo.findById( userId );
        if( optUserProfile.isEmpty() ){ return; }
        optUserProfile.get().getChatRooms().remove( id );
        this.userProfileRepo.save( optUserProfile.get() );
    }

    public void modifyPassword( String id, String password ){
        Optional<UserProfile> optUserProfile = this.userProfileRepo.findById( id );
        if( optUserProfile.isEmpty() ){ return; }
        optUserProfile.get().setPassword( password );
        this.userProfileRepo.save( optUserProfile.get() );
    }

    public void modifyLastName( String id, String lastName ){
        Optional<UserProfile> optUserProfile = this.userProfileRepo.findById( id );
        if( optUserProfile.isEmpty() ){ return; }
        optUserProfile.get().setLastName( lastName );
        this.userProfileRepo.save( optUserProfile.get() );
    }

    public void modifyName( String id, String name ){
        Optional<UserProfile> optUserProfile = this.userProfileRepo.findById( id );
        if( optUserProfile.isEmpty() ){ return; }
        optUserProfile.get().setName( name );
        this.userProfileRepo.save( optUserProfile.get() );
    }

    public void modifyEmail( String id, String email ){
        Optional<UserProfile> optUserProfile = this.userProfileRepo.findById( id );
        if( optUserProfile.isEmpty() ){ return; }
        optUserProfile.get().setEmail( email );
        this.userProfileRepo.save( optUserProfile.get() );
    }

    public void modifyUserName( String id, String userName ){
        Optional<UserProfile> optUserProfile = this.userProfileRepo.findById( id );
        if( optUserProfile.isEmpty() ){ return; }
        optUserProfile.get().setUserName( userName );
        this.userProfileRepo.save( optUserProfile.get() );
    }

    public void modifyAbout( String id, String about ){
        Optional<UserProfile> optUserProfile = this.userProfileRepo.findById( id );
        if( optUserProfile.isEmpty() ){ return; }
        optUserProfile.get().setAbout( about );
        this.userProfileRepo.save( optUserProfile.get() );
    }

    public void removeLanguage( String id, String language ){
        Optional<UserProfile> optUserProfile = this.userProfileRepo.findById( id );
        if( optUserProfile.isEmpty() ){ return; }
        optUserProfile.get().getLanguages().remove( language );
        this.userProfileRepo.save( optUserProfile.get() );
    }

    public void removeInterest( String id, String interest ){
        Optional<UserProfile> optUserProfile = this.userProfileRepo.findById( id );
        if( optUserProfile.isEmpty() ){ return; }
        optUserProfile.get().getInterests().remove( interest );
        this.userProfileRepo.save( optUserProfile.get() );
    }

    public void setInterest( String id, String interest ){
        Optional<UserProfile> optUserProfile = this.userProfileRepo.findById( id );
        if( optUserProfile.isEmpty() ){ return; }
        if( !optUserProfile.get().getInterests().contains( interest ) ){
            optUserProfile.get().getInterests().add( interest );
            this.userProfileRepo.save( optUserProfile.get() );
        }
    }

    public void setCity( String id, String city ){
        Optional<UserProfile> optUserProfile = this.userProfileRepo.findById( id );
        if( optUserProfile.isEmpty() ){ return; }
        optUserProfile.get().setCity( city );
        this.userProfileRepo.save( optUserProfile.get() );
    }

    public void setLanguage( String id, String language  ){
        Optional<UserProfile> optUserProfile = this.userProfileRepo.findById( id );
        if( optUserProfile.isEmpty() ){ return; }
        if( !optUserProfile.get().getLanguages().contains( language ) ){
            optUserProfile.get().getLanguages().add( language );
            this.userProfileRepo.save( optUserProfile.get() );
        }
    }

}
