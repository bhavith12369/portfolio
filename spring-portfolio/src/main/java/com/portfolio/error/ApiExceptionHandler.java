package com.portfolio.error;

import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ApiExceptionHandler {

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<Map<String, Object>> handleValidation(
      MethodArgumentNotValidException ex) {
    var fieldErrors =
        ex.getBindingResult().getFieldErrors().stream()
            .collect(
                Collectors.toMap(
                    err -> err.getField(),
                    err -> err.getDefaultMessage() != null ? err.getDefaultMessage() : "Invalid",
                    (a, b) -> a));

    return ResponseEntity.badRequest().body(Map.of("errors", fieldErrors));
  }
}
