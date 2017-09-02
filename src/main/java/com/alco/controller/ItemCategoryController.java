package com.alco.controller;

import com.alco.dao.CategoryDao;
import com.alco.dao.CustomerTypeDao;
import com.alco.model.Category;
import com.alco.model.CustomerType;
import com.alco.model.SimpleItemCategory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;

/**
 * Created by joeketcham on 7/8/2017.
 */
@RestController
@RequestMapping("itemCategory")
public class ItemCategoryController {

    @Autowired
    CategoryDao categoryDao;

    @Autowired
    CustomerTypeDao customerTypeDao;

    @PostMapping(value = "/create")
    public ResponseEntity<String> addCustomer(@RequestBody SimpleItemCategory simpleItemCategory) {
        return saveItemCategory(simpleItemCategory);
    }

    @PutMapping(value = "/update")
    public ResponseEntity<String> updateCustomer(@RequestBody SimpleItemCategory simpleItemCategory) {
        Category category = new Category();
        Collection<Category> categories = categoryDao.findByDescription(simpleItemCategory.getPreviousDescription());
        if (categories.size() != 1) {
            return new ResponseEntity<String>(HttpStatus.BAD_REQUEST);
        }
        categories.forEach(category1 -> {
            category1.setDescription(simpleItemCategory.getDescription());
            CustomerType customerType = new CustomerType();
            customerType = customerTypeDao.findOne(simpleItemCategory.getCustomerTypeId());
            category1.setCustomerType(customerType);
            categoryDao.save(category1);
        });
        return new ResponseEntity<String>(HttpStatus.OK);
    }


    private ResponseEntity<String> saveItemCategory(SimpleItemCategory simpleItemCategory) {
        Category category = new Category();
        category.setDescription(simpleItemCategory.getDescription());

        CustomerType customerType = new CustomerType();
        customerType = customerTypeDao.findOne(simpleItemCategory.getCustomerTypeId());
        category.setCustomerType(customerType);

        categoryDao.save(category);
        return new ResponseEntity<String>(HttpStatus.OK);
    }
}
