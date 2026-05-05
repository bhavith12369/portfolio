package com.portfolio.contact;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ContactRequest(
    @NotBlank @Size(min = 2, max = 80) String name,
    @NotBlank @Email String email,
    @Size(max = 120) String subject,
    @NotBlank @Size(min = 10, max = 2000) String message) {

  public ContactRequest {
    subject = subject == null ? "" : subject.trim();
  }
}
