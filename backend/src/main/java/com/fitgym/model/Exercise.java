package com.fitgym.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Document(collection = "exercises")
@Data
public class Exercise {
    @Id
    private String id;
    private String name;
    private String description;
    private String targetBodyPart;
    private String videoUrl;
    private String articleUrl;
    private String difficulty;
    private List<String> equipment;
}

