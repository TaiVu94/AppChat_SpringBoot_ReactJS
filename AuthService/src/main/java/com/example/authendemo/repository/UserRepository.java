package com.example.authendemo.repository;

import com.example.authendemo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.web.savedrequest.SavedRequest;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Boolean existsByEmail(String email);
    Optional<User> findByEmail(String email);

}
