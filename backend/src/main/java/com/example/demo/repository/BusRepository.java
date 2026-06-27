package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.model.Bus;

public interface BusRepository extends JpaRepository<Bus, Long> {

}