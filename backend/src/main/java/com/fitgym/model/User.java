package com.fitgym.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "users")
@Data
public class User {
    @Id
    private String id;
    private String username;
    private String email;
    private String password;
    private BodyModel bodyModel;
    private List<String> fitnessGoals;
    private LocalDateTime createdAt;
    
    @Data
    public static class BodyModel {
        private String modelUrl;
        private BodyMetrics metrics;
        private LocalDateTime lastUpdated;
        
        @Data
        public static class BodyMetrics {
            private Double chest;
            private Double waist;
            private Double hips;
            private Double arms;
            private Double thighs;
            private Double shoulders;
        }
    }
}

