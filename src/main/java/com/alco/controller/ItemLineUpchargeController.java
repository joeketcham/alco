package com.alco.controller;

import com.alco.dao.ItemLineDao;
import com.alco.dao.ItemLineUpchargeDao;
import com.alco.model.ItemLine;
import com.alco.model.ItemLineUpcharge;
import com.alco.model.SimpleItemLineUpcharge;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by joeketcham on 7/26/2017.
 */
@RestController
public class ItemLineUpchargeController {
    @Autowired
    private ItemLineDao itemLineDao;

    @Autowired
    private ItemLineUpchargeDao itemLineUpchargeDao;


    @PostMapping(value = "/createItemLineUpcharge")
    public ResponseEntity<String> addItemLineUpcharge(
            @RequestBody SimpleItemLineUpcharge simpleItemLineUpcharge) {

        ItemLine itemLine = new ItemLine();
        itemLine = itemLineDao.findOne(simpleItemLineUpcharge.getItemLineId());

        ItemLineUpcharge itemLineUpcharge = new ItemLineUpcharge();
        itemLineUpcharge.setItemLine(itemLine);
        itemLineUpcharge.setPrice(simpleItemLineUpcharge.getPrice());
        itemLineUpcharge.setUpcharge(simpleItemLineUpcharge.getDescription());

        itemLineUpchargeDao.save(itemLineUpcharge);

        return new ResponseEntity<String>(HttpStatus.OK);
    }
}
