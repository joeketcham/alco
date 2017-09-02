package com.alco.controller;

import com.alco.dao.CategoryDao;
import com.alco.dao.CustomerDao;
import com.alco.dao.CustomerTypeDao;
import com.alco.dao.ItemDao;
import com.alco.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;

/**
 * Created by joeketcham on 6/3/2017.
 */
@RestController
@RequestMapping("itemByCategory")
public class ItemByCategoryController {
    @Autowired
    ItemDao itemDao;

    @Autowired
    CustomerDao customerDao;

    @Autowired
    CategoryDao categoryDao;

    @Autowired
    CustomerTypeDao customerTypeDao;

    @PostMapping(value = "items")
    public Collection<Item> getItems(@RequestBody SimpleItemByCategory simpleItemByCategory) {
        System.out.println("this category: " + simpleItemByCategory.getCategory() + " this type: " );

        Category category;
        category = categoryDao.findOne(simpleItemByCategory.getCategory());

        Customer customer;
        customer = customerDao.findOne(simpleItemByCategory.getCustomerId());

        CustomerType customerType;
        customerType = customer.getCustomerType();

        Collection<Item> items;

        items = itemDao.findByCategoryAndCustomerType(category, customerType);
        return items;
    }
    // http://keenformatics.blogspot.com/2013/08/how-to-solve-json-infinite-recursion.html
    // https://stackoverflow.com/questions/24994440/no-serializer-found-for-class-org-hibernate-proxy-pojo-javassist-javassist
    // https://stackoverflow.com/questions/44379892/traverse-simple-javascript-object

    // JSON.parse(data)

}
