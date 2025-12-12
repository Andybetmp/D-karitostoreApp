package com.dkarito.authservice.config;

import com.dkarito.authservice.domain.User;
import com.dkarito.authservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Override
    public void run(String... args) throws Exception {
        seedUser("admin@dkarito.com", "admin", "Admin User", User.Role.ADMIN);
        seedUser("user@dkarito.com", "user", "Client User", User.Role.USER);
        seedUser("receptionist@dkarito.com", "receptionist", "Receptionist User", User.Role.RECEPTIONIST);
    }

    private void seedUser(String email, String password, String name, User.Role role) {
        if (userRepository.existsByEmail(email)) {
            // Update existing user to ensure password is correct (Reset mechanism)
            User user = userRepository.findByEmail(email).orElseThrow();
            user.setPassword(encoder.encode(password));
            userRepository.save(user);
            System.out.println("Updated user: " + email);
        } else {
            User user = new User(email, encoder.encode(password), name);
            user.setUsername(email);

            Set<User.Role> roles = new HashSet<>();
            roles.add(role);
            user.setRoles(roles);

            userRepository.save(user);
            System.out.println("Seeded user: " + email + " with role: " + role);
        }
    }
}
