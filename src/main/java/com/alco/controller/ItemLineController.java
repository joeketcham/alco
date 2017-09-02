package com.alco.controller;

import com.alco.dao.CategoryDao;
import com.alco.dao.InvoiceDao;
import com.alco.dao.ItemDao;
import com.alco.dao.ItemLineDao;
import com.alco.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by joeketcham on 5/6/2017.
 */
@RestController
public class ItemLineController {

    @Autowired
    private ItemLineDao itemLineDao;

    @Autowired
    private InvoiceDao invoiceDao;

    @Autowired
    private ItemDao itemDao;

    @Autowired
    private CategoryDao categoryDao;

    @PostMapping(value = "/createItemLine")
    public ResponseEntity<String> addInvoice(@RequestBody SimpleItemByCategory simpleItemByCategory) {
        Invoice invoice;
        Long invoiceId = simpleItemByCategory.getInvoiceId();
        invoice = invoiceDao.findOne(invoiceId);

        Item item;
        Long itemId = simpleItemByCategory.getItem();
        item = itemDao.findOne(itemId);

        Category category;
        Long categoryId = simpleItemByCategory.getCategory();
        category = categoryDao.findOne(categoryId);

        return saveItemLine(invoice,item,category, simpleItemByCategory,new ItemLine());
    }

    private ResponseEntity<String> saveItemLine(Invoice invoice,
                                                Item item,
                                                Category category,
                                                SimpleItemByCategory simpleItemByCategory,
                                                ItemLine itemLine) {
        itemLine.setInvoice(invoice);
        itemLine.setItem(item.getDescription());
        itemLine.setItem_category(category.getDescription());
        itemLine.setPrice(simpleItemByCategory.getPrice());
        itemLine.setQuantity(simpleItemByCategory.getQuantity());
        itemLine.setPrice_override(simpleItemByCategory.getPrice_override());
        itemLineDao.save(itemLine);
        return new ResponseEntity<String>(HttpStatus.OK);
    }

}
