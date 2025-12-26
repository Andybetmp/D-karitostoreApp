package com.dkarito.productservice.config;

import com.dkarito.productservice.domain.Product;
import com.dkarito.productservice.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import jakarta.annotation.PostConstruct;

import java.math.BigDecimal;
import java.util.List;

@Component
public class DataSeeder {

        @Autowired
        private ProductRepository productRepository;

        @PostConstruct
        public void seedProducts() {
                List<Product> products = List.of(
                                createProduct("Cinturón de Cuero Clásico",
                                                "Cinturón de cuero genuino, con hebilla de acero inoxidable.",
                                                new BigDecimal("49.99"), "Cuero"),
                                createProduct("Bolso de Cuero Artesanal",
                                                "Bolso de cuero hecho a mano, con compartimentos internos.",
                                                new BigDecimal("129.99"), "Cuero"),
                                createProduct("Mochila de Cuero Premium",
                                                "Mochila resistente de cuero, ideal para viajes y uso diario.",
                                                new BigDecimal("199.99"), "Cuero"),
                                createProduct("Correa de Cuero Artesanal",
                                                "Correa de cuero con acabado liso, perfecta para relojes.",
                                                new BigDecimal("29.99"), "Cuero"),
                                createProduct("Billetera de Cuero Genuino",
                                                "Billetera compacta de cuero auténtico con múltiples compartimentos.",
                                                new BigDecimal("39.99"), "Cuero"),
                                createProduct("Tarjetero de Cuero Elegante",
                                                "Tarjetero de cuero fino, ideal para tarjetas de presentación.",
                                                new BigDecimal("19.99"), "Cuero"),
                                createProduct("Cinturón de Cuero con Hebilla Dorada",
                                                "Cinturón premium con hebilla dorada y cuero de alta calidad.",
                                                new BigDecimal("59.99"), "Cuero"),
                                createProduct("Bolso de Cuero con Detalles Metálicos",
                                                "Bolso de cuero con adornos metálicos y diseño moderno.",
                                                new BigDecimal("149.99"), "Cuero"));

                for (Product product : products) {
                        if (!productRepository.existsByTitle(product.getTitle())) {
                                productRepository.save(product);
                        }
                }
        }

        private Product createProduct(String title, String description, BigDecimal price, String category) {
                Product p = new Product();
                p.setTitle(title);
                p.setDescription(description);
                p.setPrice(price);
                p.setCategory(category);
                // img will be generated as placeholder by ProductService if empty
                p.setImg(generatePlaceholder(title));
                return p;
        }

        private String generatePlaceholder(String title) {
                try {
                        return "https://placehold.co/200x200?text="
                                        + URLEncoder.encode(title, StandardCharsets.UTF_8.toString());
                } catch (Exception e) {
                        return "https://placehold.co/200x200?text=No+Image";
                }
        }
}
