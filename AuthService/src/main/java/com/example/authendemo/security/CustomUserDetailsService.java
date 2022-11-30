package com.example.authendemo.security;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.authendemo.entity.User;
import com.example.authendemo.repository.UserRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService{
    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        User existingUser = userRepository.findByEmail(email).orElseThrow(() ->
                new UsernameNotFoundException("User not found"));

        return new org.springframework.security.core.userdetails.User(
                existingUser.getEmail(), existingUser.getPassword(), new ArrayList<>());
    }


    public boolean checkIfUserExist(String email){
        return userRepository.findByEmail(email) !=null ? true : false;
    }

}
