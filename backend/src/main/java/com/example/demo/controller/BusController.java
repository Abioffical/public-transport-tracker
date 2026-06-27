package com.example.demo.controller;

import com.example.demo.model.Bus;
import com.example.demo.repository.BusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/buses")
public class BusController {

    @Autowired
    private BusRepository busRepository;

    @GetMapping
    public List<Bus> getAllBuses() {
        return busRepository.findAll();
    }

    @PostMapping
    public Bus addBus(@RequestBody Bus bus) {
        return busRepository.save(bus);
    }

    @GetMapping("/{id}")
    public Bus getBusById(@PathVariable Long id) {
        return busRepository.findById(id).orElse(null);
    }

    @PutMapping("/{id}")
    public Bus updateBus(@PathVariable Long id, @RequestBody Bus updatedBus) {

        Bus bus = busRepository.findById(id).orElse(null);

        if (bus != null) {
            bus.setBusNumber(updatedBus.getBusNumber());
            bus.setRoute(updatedBus.getRoute());
            bus.setCurrentLocation(updatedBus.getCurrentLocation());
            bus.setStatus(updatedBus.getStatus());
            return busRepository.save(bus);
        }

        return null;
    }

    @DeleteMapping("/{id}")
    public String deleteBus(@PathVariable Long id) {
        busRepository.deleteById(id);
        return "Bus deleted successfully";
    }
}