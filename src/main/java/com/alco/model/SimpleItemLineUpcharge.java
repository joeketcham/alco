package com.alco.model;

import java.math.BigDecimal;

/**
 * Created by joeketcham on 7/26/2017.
 */
public class SimpleItemLineUpcharge {

    Long itemLineId;
    String description;
    BigDecimal price;

    public Long getItemLineId() {
        return itemLineId;
    }

    public void setItemLineId(Long itemLineId) {
        this.itemLineId = itemLineId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }
}
