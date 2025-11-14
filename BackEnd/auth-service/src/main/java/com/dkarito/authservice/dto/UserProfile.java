package com.dkarito.authservice.dto;

import com.dkarito.authservice.domain.User;

import java.time.LocalDateTime;
import java.util.Set;

public class UserProfile {

    private Long id;
    private String email;
    private String name;
    private String picture;
    private User.Provider provider;
    private Set<User.Role> roles;
    private LocalDateTime createdAt;

    public UserProfile() {}

    public UserProfile(User user) {
        this.id = user.getId();
        this.email = user.getEmail();
        this.name = user.getName();
        this.picture = user.getPicture();
        this.provider = user.getProvider();
        this.roles = user.getRoles();
        this.createdAt = user.getCreatedAt();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPicture() {
        return picture;
    }

    public void setPicture(String picture) {
        this.picture = picture;
    }

    public User.Provider getProvider() {
        return provider;
    }

    public void setProvider(User.Provider provider) {
        this.provider = provider;
    }

    public Set<User.Role> getRoles() {
        return roles;
    }

    public void setRoles(Set<User.Role> roles) {
        this.roles = roles;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
