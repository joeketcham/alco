package com.alco.controller;

import com.alco.dao.CategoryDao;
import com.alco.dao.CustomerTypeDao;
import com.alco.dao.ItemDao;
import com.alco.model.Category;
import com.alco.model.CustomerType;
import com.alco.model.Item;
import com.alco.model.SimpleItem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Created by joeketcham on 7/8/2017.
 */

@RestController
@RequestMapping("item")
public class ItemController {
    @Autowired
    ItemDao itemDao;
    @Autowired
    CategoryDao categoryDao;
    @Autowired
    CustomerTypeDao customerTypeDao;

    @PostMapping(value = "/create")
    public ResponseEntity<String> addItem(@RequestBody SimpleItem simpleItem) {

        Item item = new Item();

        item.setDescription(simpleItem.getDescription());
        item.setPrice(simpleItem.getPrice());

        Category category = new Category();
        category = categoryDao.findOne(simpleItem.getCategoryId());
        item.setCategory(category);

        CustomerType customerType = new CustomerType();
        customerType = customerTypeDao.findOne(simpleItem.getCustomerTypeId());
        item.setCustomerType(customerType);

        itemDao.save(item);
        return new ResponseEntity<String>(HttpStatus.OK);
    }

    /*
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
     */
    @PutMapping(value = "/update")
    public ResponseEntity<String> updateItem(@RequestBody SimpleItem simpleItem) {
        Item item = new Item();
        item = itemDao.findOne(simpleItem.getId());

        if (item == null) {
            return new ResponseEntity<String>(HttpStatus.NOT_FOUND);
        }
        item.setPrice(simpleItem.getPrice());
        item.setDescription(simpleItem.getDescription());
        itemDao.save(item);
        return new ResponseEntity<String>(HttpStatus.OK);
    }
}
