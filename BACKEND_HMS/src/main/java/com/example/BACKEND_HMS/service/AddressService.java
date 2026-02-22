package com.example.BACKEND_HMS.service;

import com.example.BACKEND_HMS.DTO.AddressRequest;
import com.example.BACKEND_HMS.Entity.Address;
import com.example.BACKEND_HMS.Entity.User;
import com.example.BACKEND_HMS.repository.AddressRepository;
import com.example.BACKEND_HMS.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    public List<Address> getMyAddresses(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return addressRepository.findByUser(user);
    }

    @Transactional
    public Address addAddress(String email, AddressRequest req) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (Boolean.TRUE.equals(req.getIsDefault())) {
            addressRepository.findByUserAndIsDefaultTrue(user)
                    .ifPresent(old -> {
                        old.setIsDefault(false);
                        addressRepository.save(old);
                    });
        }

        Address address = Address.builder()
                .user(user)
                .fullName(req.getFullName())
                .phoneNumber(req.getPhoneNumber())
                .addressLine1(req.getAddressLine1())
                .addressLine2(req.getAddressLine2())
                .city(req.getCity())
                .state(req.getState())
                .pincode(req.getPincode())
                .isDefault(req.getIsDefault())
                .build();

        return addressRepository.save(address);
    }

    @Transactional
    public void deleteAddress(String email, Long addressId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        // ✅ FIX: id use karo userId nahi
        if (!address.getUser().getId().equals(user.getId()))
            throw new RuntimeException("Unauthorized");

        addressRepository.delete(address);
    }
}