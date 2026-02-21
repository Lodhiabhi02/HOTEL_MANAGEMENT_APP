package com.example.BACKEND_HMS.config;



import com.example.BACKEND_HMS.jwtfilter.JwtAuthenticationEntryPoint;
import com.example.BACKEND_HMS.jwtfilter.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth

                        // Public or Auth
                        .requestMatchers("/api/auth/**").permitAll()

                        // USER + ADMIN dono dekh sakte hain (GET only)
                        .requestMatchers(HttpMethod.GET,
                                "/api/subcategories/**",
                                "/api/products/**",
                                "/api/categories/**"
                        ).hasAnyRole("ADMIN", "USER")

                        // Sirf ADMIN create/update/delete kare
                        .requestMatchers(
                                "/api/subcategories/**",
                                "/api/products/**",
                                "/api/categories/**"
                        ).hasRole("ADMIN")

                        .requestMatchers("/api/user/**").hasRole("USER")

                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint(jwtAuthenticationEntryPoint)
                );

        return http.build();
    }
}