package com.dkarito.inventoryservice.service;

import com.dkarito.inventoryservice.domain.Inventory;
import com.dkarito.inventoryservice.dto.InventoryDto;
import com.dkarito.inventoryservice.repository.InventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class InventoryService {

    @Autowired
    private InventoryRepository inventoryRepository;

    public Optional<InventoryDto> getInventoryByProductId(Long productId) {
        return inventoryRepository.findByProductId(productId).map(this::convertToDto);
    }

    @Transactional
    public InventoryDto createInventory(InventoryDto inventoryDto) {
        if (inventoryRepository.existsByProductId(inventoryDto.getProductId())) {
            throw new RuntimeException("Inventory already exists for product ID: " + inventoryDto.getProductId());
        }

        Inventory inventory = convertToEntity(inventoryDto);
        Inventory savedInventory = inventoryRepository.save(inventory);
        return convertToDto(savedInventory);
    }

    @Transactional
    public Optional<InventoryDto> updateInventory(Long productId, InventoryDto inventoryDto) {
        return inventoryRepository.findByProductId(productId).map(existingInventory -> {
            existingInventory.setStock(inventoryDto.getStock());
            existingInventory.setReservedStock(inventoryDto.getReservedStock());
            Inventory updatedInventory = inventoryRepository.save(existingInventory);
            return convertToDto(updatedInventory);
        });
    }

    @Transactional
    public boolean reserveStock(Long productId, Integer quantity) {
        Optional<Inventory> inventoryOpt = inventoryRepository.findByProductIdWithLock(productId);
        if (inventoryOpt.isPresent()) {
            Inventory inventory = inventoryOpt.get();
            int availableStock = inventory.getAvailableStock();
            if (availableStock >= quantity) {
                inventory.setReservedStock(inventory.getReservedStock() + quantity);
                inventoryRepository.save(inventory);
                return true;
            }
        }
        return false;
    }

    @Transactional
    public boolean releaseReservedStock(Long productId, Integer quantity) {
        Optional<Inventory> inventoryOpt = inventoryRepository.findByProductId(productId);
        if (inventoryOpt.isPresent()) {
            Inventory inventory = inventoryOpt.get();
            int currentReserved = inventory.getReservedStock();
            if (currentReserved >= quantity) {
                inventory.setReservedStock(currentReserved - quantity);
                inventoryRepository.save(inventory);
                return true;
            }
        }
        return false;
    }

    @Transactional
    public boolean deductStock(Long productId, Integer quantity) {
        Optional<Inventory> inventoryOpt = inventoryRepository.findByProductIdWithLock(productId);
        if (inventoryOpt.isPresent()) {
            Inventory inventory = inventoryOpt.get();
            int availableStock = inventory.getAvailableStock();
            if (availableStock >= quantity) {
                inventory.setStock(inventory.getStock() - quantity);
                inventory.setReservedStock(inventory.getReservedStock() - quantity);
                inventoryRepository.save(inventory);
                return true;
            }
        }
        return false;
    }

    @Transactional
    public boolean addStock(Long productId, Integer quantity) {
        Optional<Inventory> inventoryOpt = inventoryRepository.findByProductId(productId);
        if (inventoryOpt.isPresent()) {
            Inventory inventory = inventoryOpt.get();
            inventory.setStock(inventory.getStock() + quantity);
            inventoryRepository.save(inventory);
            return true;
        }
        return false;
    }

    public boolean isStockAvailable(Long productId, Integer quantity) {
        Optional<Inventory> inventoryOpt = inventoryRepository.findByProductId(productId);
        return inventoryOpt.map(inventory -> inventory.getAvailableStock() >= quantity).orElse(false);
    }

    private InventoryDto convertToDto(Inventory inventory) {
        return new InventoryDto(
                inventory.getId(),
                inventory.getProductId(),
                inventory.getStock(),
                inventory.getReservedStock()
        );
    }

    private Inventory convertToEntity(InventoryDto inventoryDto) {
        Inventory inventory = new Inventory();
        inventory.setProductId(inventoryDto.getProductId());
        inventory.setStock(inventoryDto.getStock());
        inventory.setReservedStock(inventoryDto.getReservedStock());
        return inventory;
    }
}
