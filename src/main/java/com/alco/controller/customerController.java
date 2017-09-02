package com.alco.controller;

import com.alco.dao.CustomerDao;
import com.alco.dao.CustomerTypeDao;
import com.alco.model.Customer;
import com.alco.model.CustomerType;
import com.alco.model.SimpleCustomer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;

/**
 * Created by joeketcham on 5/27/2017.
 */

@RestController
@RequestMapping("cust")
public class customerController {
    @Autowired
    CustomerDao customerDao;

    @Autowired
    CustomerTypeDao customerTypeDao;
/*
@RequestMapping("category")
    public Collection<Category> getAllCategories() {
        return categoryDao.findMyCategories();
    }

 */

    @RequestMapping(value = "/all")
    public Collection<Customer> getAllCustomers() {
        return customerDao.findAll();
    }

    @PostMapping(value = "/create")
    public ResponseEntity<String> addCustomer(@RequestBody SimpleCustomer simpleCustomer) {
        Customer customer = new Customer();
        return saveCustomer(customer, simpleCustomer);
    }

    @PutMapping(value = "/update")
    public ResponseEntity<String> updateCustomer(@RequestBody SimpleCustomer simpleCustomer) {
        Customer customer;
        Long customerId = simpleCustomer.getCustomerId();
        customer = customerDao.findOne(customerId);
        return saveCustomer(customer, simpleCustomer);
    }

    private ResponseEntity<String> saveCustomer(Customer customer,
                         SimpleCustomer simpleCustomer) {
        CustomerType customerType;
        Long customerTypeId = simpleCustomer.getCustomerType();
        customerType = customerTypeDao.findOne(customerTypeId);

        customer.setCustomerType(customerType);

        customer.setFirstname(simpleCustomer.getFirstname());
        customer.setMi(simpleCustomer.getMi());
        customer.setLastname(simpleCustomer.getLastname());
        customer.setAddress1(simpleCustomer.getAddress1());
        customer.setAddress2(simpleCustomer.getAddress2());
        customer.setCity(simpleCustomer.getCity());
        customer.setState(simpleCustomer.getState());
        customer.setZip(simpleCustomer.getZip());
        customer.setPhone1(simpleCustomer.getPhone1());
        customer.setPhone2(simpleCustomer.getPhone2());
        customer.setEmail(simpleCustomer.getEmail());
        customer.setNote(simpleCustomer.getNote());

        customerDao.save(customer);
        return new ResponseEntity<String>(HttpStatus.OK);
    }
}
