package com.dkarito.inventoryservice.controller;

import com.dkarito.inventoryservice.dto.InventoryDto;
import com.dkarito.inventoryservice.service.InventoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/inventory")
@Tag(name = "Inventory", description = "Inventory management APIs")
public class InventoryController {

    @Autowired
    private InventoryService inventoryService;

    @GetMapping("/{productId}")
    @Operation(summary = "Get inventory for a product")
    public ResponseEntity<InventoryDto> getInventory(@PathVariable Long productId) {
        return inventoryService.getInventoryByProductId(productId)
                .map(inventory -> ResponseEntity.ok(inventory))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Create inventory for a product")
    public ResponseEntity<InventoryDto> createInventory(@Valid @RequestBody InventoryDto inventoryDto) {
        try {
            InventoryDto createdInventory = inventoryService.createInventory(inventoryDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdInventory);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{productId}")
    @Operation(summary = "Update inventory for a product")
    public ResponseEntity<InventoryDto> updateInventory(@PathVariable Long productId, @Valid @RequestBody InventoryDto inventoryDto) {
        return inventoryService.updateInventory(productId, inventoryDto)
                .map(inventory -> ResponseEntity.ok(inventory))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{productId}/reserve")
    @Operation(summary = "Reserve stock for a product")
    public ResponseEntity<Void> reserveStock(
            @PathVariable Long productId,
            @Parameter(description = "Quantity to reserve") @RequestParam Integer quantity) {
        if (inventoryService.reserveStock(productId, quantity)) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.badRequest().build();
    }

    @PostMapping("/{productId}/release")
    @Operation(summary = "Release reserved stock for a product")
    public ResponseEntity<Void> releaseReservedStock(
            @PathVariable Long productId,
            @Parameter(description = "Quantity to release") @RequestParam Integer quantity) {
        if (inventoryService.releaseReservedStock(productId, quantity)) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.badRequest().build();
    }

    @PostMapping("/{productId}/deduct")
    @Operation(summary = "Deduct stock for a product (used after successful order)")
    public ResponseEntity<Void> deductStock(
            @PathVariable Long productId,
            @Parameter(description = "Quantity to deduct") @RequestParam Integer quantity) {
        if (inventoryService.deductStock(productId, quantity)) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.badRequest().build();
    }

    @PostMapping("/{productId}/add")
    @Operation(summary = "Add stock to a product")
    public ResponseEntity<Void> addStock(
            @PathVariable Long productId,
            @Parameter(description = "Quantity to add") @RequestParam Integer quantity) {
        if (inventoryService.addStock(productId, quantity)) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/{productId}/available")
    @Operation(summary = "Check if stock is available for a product")
    public ResponseEntity<Boolean> isStockAvailable(
            @PathVariable Long productId,
            @Parameter(description = "Quantity to check") @RequestParam Integer quantity) {
        boolean available = inventoryService.isStockAvailable(productId, quantity);
        return ResponseEntity.ok(available);
    }
}
