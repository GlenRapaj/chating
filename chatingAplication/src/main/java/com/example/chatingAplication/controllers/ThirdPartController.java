package com.example.chatingAplication.controllers;

import com.example.chatingAplication.models.City;
import com.example.chatingAplication.models.Interest;
import com.example.chatingAplication.models.Language;
import com.example.chatingAplication.models.UserProfile;
import com.example.chatingAplication.repo.CityRepo;
import com.example.chatingAplication.repo.InterestRepo;
import com.example.chatingAplication.repo.LanguageRepo;
import com.example.chatingAplication.repo.UserProfileRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin("*") 
public class ThirdPartController {

    @Autowired
    private CityRepo cityRepo;
    @Autowired
    private com.example.chatingAplication.repo.InterestRepo interestRepo;
    @Autowired
    private LanguageRepo languageRepo;

    @Autowired
    private com.example.chatingAplication.repo.UserProfileRepo userProfileRepo;

    //  Duhet qe kur te fshihen te hiqen dhe nga lista e userProfile ku bejne pjese. delete

    @GetMapping("/get-cities")
    public List<City> getAllCities(){
        return this.cityRepo.findAll();
    }

    @PostMapping("/save-cities")
    public void createCity(@RequestBody City city){ this.cityRepo.save(city); }

    @DeleteMapping("/del-city/{id}")
    public void deleteCity(@PathVariable("id") String id ){ this.cityRepo.deleteById(id); }

    @GetMapping("/get-languages")
    public List<Language> getAllLanguages(){
        return this.languageRepo.findAll();
    }

    @PostMapping("/save-language")
    public void createLanguage(@RequestBody Language language ){ this.languageRepo.save(language); }

    @DeleteMapping("/del-language/{id}")
    public void deleteLanguage(@PathVariable("id") String id ){ this.languageRepo.deleteById(id); }

    @GetMapping("/get-interests")
    public List<Interest> getAllInterests(){
        return this.interestRepo.findAll();
    }

    @PostMapping("/save-interest")
    public void createInterest(@RequestBody Interest interest){ this.interestRepo.save(interest); }

    @DeleteMapping("/del-interest/{id}")
    public void deleteInterest(@PathVariable("id") String id){ this.interestRepo.deleteById(id); }

    /*
    @GetMapping("/populate-user-profiles")
    public void populate(){
        UserProfile userProfile = this.userProfileRepo.findById("6123679eecd6231602759050").get();
        userProfile.setCity("London");  //
        List<String> languageList = new ArrayList<>();

        languageList.add("English");
        languageList.add("French");
        userProfile.setLanguages( languageList );

        List<String> InterestList = new ArrayList<>();

        InterestList.add("Garden");
        userProfile.setInterests(InterestList);

        this.userProfileRepo.save( userProfile );
    }
    */

}
