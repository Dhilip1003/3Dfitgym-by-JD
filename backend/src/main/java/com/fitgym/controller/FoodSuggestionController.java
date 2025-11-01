package com.fitgym.controller;

import com.fitgym.model.FoodSuggestion;
import com.fitgym.service.FoodSuggestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/food-suggestions")
@CrossOrigin(origins = "*")
public class FoodSuggestionController {
    
    @Autowired
    private FoodSuggestionService foodSuggestionService;
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<FoodSuggestion>> getFoodSuggestions(@PathVariable String userId) {
        return ResponseEntity.ok(foodSuggestionService.getFoodSuggestions(userId));
    }
    
    @GetMapping
    public ResponseEntity<List<FoodSuggestion>> getAllFoodSuggestions() {
        return ResponseEntity.ok(foodSuggestionService.getAllFoodSuggestions());
    }
    
    @PostMapping
    public ResponseEntity<FoodSuggestion> createFoodSuggestion(@RequestBody FoodSuggestion suggestion) {
        return ResponseEntity.ok(foodSuggestionService.createFoodSuggestion(suggestion));
    }
}

