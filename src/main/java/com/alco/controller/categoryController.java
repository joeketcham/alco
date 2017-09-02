package com.alco.controller;

import com.alco.dao.CategoryDao;
import com.alco.model.Category;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.persistence.Query;
import java.util.Collection;

/*
This is required to get around the HATEOAS pagination
 */
@RestController
public class categoryController {

    @Autowired
    private CategoryDao categoryDao;

    @RequestMapping("category")
    public Collection<Category> getAllCategories() {
        return categoryDao.findMyCategories();
    }
}
