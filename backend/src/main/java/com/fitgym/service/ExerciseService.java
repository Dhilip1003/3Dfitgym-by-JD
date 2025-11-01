package com.fitgym.service;

import com.fitgym.model.Exercise;
import com.fitgym.model.User;
import com.fitgym.repository.ExerciseRepository;
import com.fitgym.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExerciseService {
    
    @Autowired
    private ExerciseRepository exerciseRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public List<Exercise> getAllExercises() {
        return exerciseRepository.findAll();
    }
    
    public List<Exercise> getExercisesByBodyPart(String bodyPart) {
        return exerciseRepository.findByTargetBodyPart(bodyPart);
    }
    
    public List<Exercise> suggestExercises(String userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (user.getBodyModel() == null) {
            return exerciseRepository.findAll();
        }
        
        User.BodyModel.BodyMetrics metrics = user.getBodyModel().getMetrics();
        List<String> targetParts = identifyTargetBodyParts(metrics);
        
        return targetParts.stream()
            .flatMap(part -> exerciseRepository.findByTargetBodyPart(part).stream())
            .distinct()
            .collect(Collectors.toList());
    }
    
    private List<String> identifyTargetBodyParts(User.BodyModel.BodyMetrics metrics) {
        List<String> parts = new java.util.ArrayList<>();
        if (metrics.getChest() != null && metrics.getChest() < 40) parts.add("chest");
        if (metrics.getArms() != null && metrics.getArms() < 12) parts.add("arms");
        if (metrics.getWaist() != null && metrics.getWaist() > 35) parts.add("waist");
        if (parts.isEmpty()) parts.add("full-body");
        return parts;
    }
    
    public Exercise createExercise(Exercise exercise) {
        return exerciseRepository.save(exercise);
    }
}

