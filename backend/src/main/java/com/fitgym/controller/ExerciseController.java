package com.fitgym.controller;

import com.fitgym.model.Exercise;
import com.fitgym.service.ExerciseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/exercises")
@CrossOrigin(origins = "*")
public class ExerciseController {
    
    @Autowired
    private ExerciseService exerciseService;
    
    @GetMapping
    public ResponseEntity<List<Exercise>> getAllExercises() {
        return ResponseEntity.ok(exerciseService.getAllExercises());
    }
    
    @GetMapping("/body-part/{bodyPart}")
    public ResponseEntity<List<Exercise>> getExercisesByBodyPart(@PathVariable String bodyPart) {
        return ResponseEntity.ok(exerciseService.getExercisesByBodyPart(bodyPart));
    }
    
    @GetMapping("/suggest/{userId}")
    public ResponseEntity<List<Exercise>> suggestExercises(@PathVariable String userId) {
        return ResponseEntity.ok(exerciseService.suggestExercises(userId));
    }
    
    @PostMapping
    public ResponseEntity<Exercise> createExercise(@RequestBody Exercise exercise) {
        return ResponseEntity.ok(exerciseService.createExercise(exercise));
    }
}

