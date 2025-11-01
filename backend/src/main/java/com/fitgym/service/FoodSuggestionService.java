package com.fitgym.service;

import com.fitgym.model.FoodSuggestion;
import com.fitgym.model.User;
import com.fitgym.repository.FoodSuggestionRepository;
import com.fitgym.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class FoodSuggestionService {
    
    @Autowired
    private FoodSuggestionRepository foodSuggestionRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public List<FoodSuggestion> getFoodSuggestions(String userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        String goal = user.getFitnessGoals() != null && !user.getFitnessGoals().isEmpty()
            ? user.getFitnessGoals().get(0)
            : "general";
        
        return foodSuggestionRepository.findByFitnessGoal(goal);
    }
    
    public FoodSuggestion createFoodSuggestion(FoodSuggestion suggestion) {
        return foodSuggestionRepository.save(suggestion);
    }
    
    public List<FoodSuggestion> getAllFoodSuggestions() {
        return foodSuggestionRepository.findAll();
    }
}

