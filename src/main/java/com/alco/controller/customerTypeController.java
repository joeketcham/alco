package com.alco.controller;

import com.alco.dao.CustomerTypeDao;
import com.alco.model.CustomerType;
import com.alco.model.SimpleCustType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;

/**
 * Created by joeketcham on 6/24/2017.
 */

@RestController
@RequestMapping("custType")
public class customerTypeController {

    @Autowired
    CustomerTypeDao customerTypeDao;

    @PostMapping(value = "/create")
    public ResponseEntity<String> addCustomer(@RequestBody SimpleCustType simpleCustType) {
       return saveCustType(simpleCustType);
    }

    @PutMapping(value = "/update")
    public ResponseEntity<String> updateCustomer(@RequestBody SimpleCustType simpleCustType) {
        CustomerType customerType = new CustomerType();
        Collection<CustomerType> customerTypes = customerTypeDao.findByType(simpleCustType.getPreviousType());
        if (customerTypes.size() != 1) {
            return new ResponseEntity<String>(HttpStatus.BAD_REQUEST);
        }
        customerTypes.forEach(customerType1 -> {
            customerType1.setType(simpleCustType.getType());
            customerTypeDao.save(customerType1);
        });
        return new ResponseEntity<String>(HttpStatus.OK);
    }

    private ResponseEntity<String> saveCustType(SimpleCustType simpleCustType) {
        CustomerType customerType = new CustomerType();
        customerType.setType(simpleCustType.getType());
        customerTypeDao.save(customerType);
        return new ResponseEntity<String>(HttpStatus.OK);
    }
}
