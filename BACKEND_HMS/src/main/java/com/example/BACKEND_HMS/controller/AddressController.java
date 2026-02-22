package com.example.BACKEND_HMS.controller;

import com.example.BACKEND_HMS.DTO.AddressRequest;
import com.example.BACKEND_HMS.Entity.Address;
import com.example.BACKEND_HMS.service.AddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/addresses")
@RequiredArgsConstructor
public class AddressController {

    private final AddressService addressService;

    @GetMapping
    public ResponseEntity<List<Address>> getMyAddresses(Authentication auth) {
        return ResponseEntity.ok(addressService.getMyAddresses(auth.getName()));
    }

    @PostMapping("/add")
    public ResponseEntity<Address> addAddress(Authentication auth,
                                              @RequestBody AddressRequest req) {
        return ResponseEntity.ok(addressService.addAddress(auth.getName(), req));
    }

    @DeleteMapping("/delete/{addressId}")
    public ResponseEntity<String> deleteAddress(Authentication auth,
                                                @PathVariable Long addressId) {
        addressService.deleteAddress(auth.getName(), addressId);
        return ResponseEntity.ok("Address deleted");
    }
}