package com.example.authendemo.controller;

import com.example.authendemo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.example.authendemo.entity.User;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private UserRepository userRepo;

    @PostMapping("/login")
    public ResponseEntity<HttpStatus> login(@RequestBody User user) throws Exception {

        Authentication authObject = null;
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword()));
            SecurityContextHolder.getContext().setAuthentication(authObject);
            System.out.println("OK");
        } catch (BadCredentialsException e) {
            throw new Exception("Invalid credentials");
        }

        return new ResponseEntity<HttpStatus>(HttpStatus.OK);
    }

    @PostMapping("/register")
    public ResponseEntity<HttpStatus> register(@RequestBody User user) throws Exception{

        try {
            if (userRepo.existsByEmail(user.getEmail())) {
                return new ResponseEntity<HttpStatus>(HttpStatus.BAD_REQUEST);
            }
            user = userRepo.save(user);
            System.out.print("Created: ");
            System.out.print(user);
        }catch (BadCredentialsException e){
            throw new Exception("Invalid credentials");
        }
        return new ResponseEntity<HttpStatus>(HttpStatus.OK);
    }
}
