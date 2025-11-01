package com.fitgym.service;

import com.fitgym.model.Product;
import com.fitgym.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProductService {
    
    @Autowired
    private ProductRepository productRepository;
    
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
    
    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategory(category);
    }
    
    public Product createProduct(Product product) {
        return productRepository.save(product);
    }
    
    public Product updateProduct(String id, Product product) {
        product.setId(id);
        return productRepository.save(product);
    }
    
    public void deleteProduct(String id) {
        productRepository.deleteById(id);
    }
    
    public Product getProductById(String id) {
        return productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Product not found"));
    }
}

