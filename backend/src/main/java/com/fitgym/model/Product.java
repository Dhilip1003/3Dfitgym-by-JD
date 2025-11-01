package com.fitgym.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "products")
@Data
public class Product {
    @Id
    private String id;
    private String name;
    private String description;
    private Double price;
    private String category;
    private String imageUrl;
    private Integer stock;
    private String status;
}

