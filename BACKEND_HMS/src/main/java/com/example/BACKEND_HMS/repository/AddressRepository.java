package com.example.BACKEND_HMS.repository;

import com.example.BACKEND_HMS.Entity.Address;
import com.example.BACKEND_HMS.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface AddressRepository extends JpaRepository<Address, Long> {
    List<Address> findByUser(User user);
    Optional<Address> findByUserAndIsDefaultTrue(User user);
}