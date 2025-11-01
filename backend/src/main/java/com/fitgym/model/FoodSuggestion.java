package com.fitgym.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "food_suggestions")
@Data
public class FoodSuggestion {
    @Id
    private String id;
    private String userId;
    private String mealType;
    private String name;
    private String description;
    private Integer calories;
    private Double protein;
    private Double carbs;
    private Double fats;
    private String fitnessGoal;
}

