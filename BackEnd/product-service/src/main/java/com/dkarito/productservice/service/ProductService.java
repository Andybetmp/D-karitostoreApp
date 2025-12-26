package com.dkarito.productservice.service;

import com.dkarito.productservice.domain.Product;
import com.dkarito.productservice.dto.ProductDto;
import com.dkarito.productservice.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import jakarta.annotation.PostConstruct;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public List<ProductDto> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public Page<ProductDto> getProductsPaginated(int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name())
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Product> products = productRepository.findAll(pageable);
        return products.map(this::convertToDto);
    }

    public Optional<ProductDto> getProductById(Long id) {
        return productRepository.findById(id).map(this::convertToDto);
    }

    @Transactional
    public ProductDto createProduct(ProductDto productDto) {
        Product product = convertToEntity(productDto);
        Product savedProduct = productRepository.save(product);
        return convertToDto(savedProduct);
    }

    @Transactional
    public Optional<ProductDto> updateProduct(Long id, ProductDto productDto) {
        return productRepository.findById(id).map(existingProduct -> {
            existingProduct.setTitle(productDto.getTitle());
            existingProduct.setDescription(productDto.getDescription());
            existingProduct.setPrice(productDto.getPrice());
            // Set placeholder image if missing
            String img = productDto.getImg();
            if (img == null || img.trim().isEmpty()) {
                img = generatePlaceholder(productDto.getTitle());
            }
            existingProduct.setImg(img);
            existingProduct.setCategory(productDto.getCategory());
            Product updatedProduct = productRepository.save(existingProduct);
            return convertToDto(updatedProduct);
        });
    }

    @Transactional
    public boolean deleteProduct(Long id) {
        if (productRepository.existsById(id)) {
            try {
                productRepository.deleteById(id);
                return true;
            } catch (org.springframework.dao.DataIntegrityViolationException e) {
                throw new RuntimeException(
                        "No se puede eliminar el producto porque tiene registros relacionados (inventario, órdenes, etc.). Por favor, elimine primero los registros relacionados.");
            }
        }
        return false;
    }

    public List<ProductDto> searchProducts(String keyword) {
        return productRepository.searchByKeyword(keyword).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<ProductDto> getProductsByPriceRange(BigDecimal minPrice, BigDecimal maxPrice) {
        return productRepository.findByPriceBetween(minPrice, maxPrice).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<ProductDto> getNewArrivals() {
        return productRepository.findAllByOrderByCreatedAtDesc().stream()
                .limit(10)
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private ProductDto convertToDto(Product product) {
        return new ProductDto(
                product.getId(),
                product.getTitle(),
                product.getDescription(),
                product.getPrice(),
                product.getImg(),
                product.getCategory());
    }

    private Product convertToEntity(ProductDto productDto) {
        Product product = new Product();
        product.setTitle(productDto.getTitle());
        product.setDescription(productDto.getDescription());
        product.setPrice(productDto.getPrice());
        // Set placeholder image if missing
        String img = productDto.getImg();
        if (img == null || img.trim().isEmpty()) {
            img = generatePlaceholder(productDto.getTitle());
        }
        product.setImg(img);
        product.setCategory(productDto.getCategory());
        return product;
    }

    @PostConstruct
    public void ensureProductImages() {
        List<Product> products = productRepository.findAll();
        for (Product product : products) {
            if (product.getImg() == null || product.getImg().trim().isEmpty()) {
                String placeholder = generatePlaceholder(product.getTitle());
                product.setImg(placeholder);
                productRepository.save(product);
            }
        }
    }

    private String generatePlaceholder(String title) {
        try {
            return "https://placehold.co/200x200?text=" + URLEncoder.encode(title, StandardCharsets.UTF_8.toString());
        } catch (Exception e) {
            return "https://placehold.co/200x200?text=No+Image";
        }
    }

}
