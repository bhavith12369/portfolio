package com.portfolio.contact;

import jakarta.validation.Valid;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class ContactController {

  private static final Logger log = LoggerFactory.getLogger(ContactController.class);

  @PostMapping("/contact")
  public ResponseEntity<Map<String, String>> contact(@Valid @RequestBody ContactRequest body) {
    log.info(
        "Contact message from {} <{}> subject={}: {}",
        body.name(),
        body.email(),
        body.subject().isEmpty() ? "(none)" : body.subject(),
        body.message().replaceAll("\\s+", " ").trim());

    return ResponseEntity.ok(
        Map.of("message", "Thanks — your message was received. I'll get back to you soon."));
  }
}
