package com.fitgym.repository;

import com.fitgym.model.FoodSuggestion;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface FoodSuggestionRepository extends MongoRepository<FoodSuggestion, String> {
    List<FoodSuggestion> findByUserId(String userId);
    List<FoodSuggestion> findByFitnessGoal(String fitnessGoal);
}

