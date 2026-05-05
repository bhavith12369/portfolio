package com.portfolio.config;

import java.util.Arrays;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

  @Value("${portfolio.cors.allowed-origins:}")
  private String allowedOrigins;

  @Override
  public void addCorsMappings(CorsRegistry registry) {
    if (allowedOrigins == null || allowedOrigins.isBlank()) {
      return;
    }
    String[] origins =
        Arrays.stream(allowedOrigins.split(","))
            .map(String::trim)
            .filter(s -> !s.isEmpty())
            .toArray(String[]::new);
    if (origins.length == 0) {
      return;
    }
    registry
        .addMapping("/api/**")
        .allowedOrigins(origins)
        .allowedMethods("GET", "POST", "OPTIONS")
        .allowedHeaders("*");
  }
}
