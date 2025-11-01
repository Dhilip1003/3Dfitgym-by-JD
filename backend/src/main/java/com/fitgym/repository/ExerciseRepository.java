package com.fitgym.repository;

import com.fitgym.model.Exercise;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ExerciseRepository extends MongoRepository<Exercise, String> {
    List<Exercise> findByTargetBodyPart(String targetBodyPart);
    List<Exercise> findByDifficulty(String difficulty);
}

