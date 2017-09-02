package com.alco.controller;

import com.alco.dao.CustomerDao;
import com.alco.dao.InvoiceDao;
import com.alco.model.Customer;
import com.alco.model.Invoice;
import com.alco.model.SimpleInvoice;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.List;
import java.util.StringJoiner;

/**
 * Created by joeketcham on 10/6/2016.
 */
@RestController
@RequestMapping("inv")
public class InvoiceController {

    @Autowired
    private InvoiceDao invoiceDao;

    @Autowired
    private CustomerDao customerDao;

    @PostMapping(value = "/create")
    public ResponseEntity<String> addInvoice(@RequestBody SimpleInvoice simpleInvoice) {

        Customer customer;
        Long customerId = simpleInvoice.getCustomerId();
        customer = customerDao.findOne(customerId);
        return saveInvoice(customer, new Invoice(), simpleInvoice);
    }

    @PutMapping(value = "/update")
    public ResponseEntity<String> updateInvoice(@RequestBody SimpleInvoice simpleInvoice) {
        Long customerId = simpleInvoice.getCustomerId();
        Customer customer = customerDao.findOne(customerId);
        Long invoiceId = simpleInvoice.getInvoiceId();
        Invoice invoice = invoiceDao.findOne(invoiceId);

        if (invoice == null || customer == null) {
            return new ResponseEntity<String>(HttpStatus.BAD_REQUEST);
        }
        return saveInvoice(customer, invoice, simpleInvoice);
    }

    private ResponseEntity<String> saveInvoice(Customer customer,
                                               Invoice invoice,
                                               SimpleInvoice simpleInvoice){
        invoice.setDropoff(simpleInvoice.getDropoff());
        invoice.setReady(simpleInvoice.getReady());
        invoice.setNote(simpleInvoice.getNote());
        invoice.setPaid(simpleInvoice.getPaid());

        invoice.setCustomer(customer);
        invoiceDao.save(invoice);
        return new ResponseEntity<String>(HttpStatus.OK);
    }
}
