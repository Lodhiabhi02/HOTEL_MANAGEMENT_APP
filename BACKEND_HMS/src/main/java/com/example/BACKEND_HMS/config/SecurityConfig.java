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

                        // ── Public ──────────────────────────────────────
                        .requestMatchers("/api/auth/**").permitAll()

                        // ── Categories / SubCategories / Products ────────
                        // USER + ADMIN dono GET kar sakte hain
                        .requestMatchers(HttpMethod.GET,
                                "/api/categories/**",
                                "/api/subcategories/**",
                                "/api/products/**"
                        ).hasAnyRole("ADMIN", "USER")

                        // Sirf ADMIN create/update/delete kar sakta hai
                        .requestMatchers(
                                "/api/categories/**",
                                "/api/subcategories/**",
                                "/api/products/**"
                        ).hasRole("ADMIN")

                        // ── Cart ─────────────────────────────────────────
                        // USER + ADMIN dono cart use kar sakte hain
                        .requestMatchers("/api/cart/**")
                        .hasAnyRole("USER", "ADMIN")

                        // ── Orders ───────────────────────────────────────
                        // Sirf ADMIN ke liye admin endpoints
                        .requestMatchers("/api/orders/admin/**")
                        .hasRole("ADMIN")

                        // USER + ADMIN dono orders place/view kar sakte hain
                        .requestMatchers("/api/orders/**")
                        .hasAnyRole("USER", "ADMIN")

                        // ── Payments ─────────────────────────────────────
                        .requestMatchers("/api/payments/**")
                        .hasAnyRole("USER", "ADMIN")

                        // ── Addresses ────────────────────────────────────
                        .requestMatchers("/api/addresses/**")
                        .hasAnyRole("USER", "ADMIN")

                        // ── User Profile ─────────────────────────────────
                        .requestMatchers("/api/user/**")
                        .hasAnyRole("USER", "ADMIN")

                        // ── Baaki sab authenticated ───────────────────────
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