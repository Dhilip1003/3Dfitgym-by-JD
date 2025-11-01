package com.fitgym.service;

import com.fitgym.model.User;
import com.fitgym.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    public User createUser(User user) {
        user.setCreatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }
    
    public Optional<User> getUserById(String id) {
        return userRepository.findById(id);
    }
    
    public User updateBodyModel(String userId, User.BodyModel bodyModel) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        bodyModel.setLastUpdated(LocalDateTime.now());
        user.setBodyModel(bodyModel);
        return userRepository.save(user);
    }
    
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}

