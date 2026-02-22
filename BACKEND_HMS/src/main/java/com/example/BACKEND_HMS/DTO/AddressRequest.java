package com.example.BACKEND_HMS.DTO;

import lombok.Data;

@Data
public class AddressRequest {
    private String fullName;
    private String phoneNumber;
    private String addressLine1;
    private String addressLine2;
    private String city;
    private String state;
    private String pincode;
    private Boolean isDefault = false;
}