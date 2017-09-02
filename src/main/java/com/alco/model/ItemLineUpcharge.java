package com.alco.model;

import javax.persistence.*;
import java.math.BigDecimal;

/**
 * Created by joeketcham on 10/12/2016.
 */
@Entity
@Table(name="ITEM_LINE_UPCHARGE")
public class ItemLineUpcharge {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;
    private String upcharge;
    private BigDecimal price;

    @ManyToOne(fetch=FetchType.EAGER)
    @JoinColumn(name="ITEM_LINE_ID")
    private ItemLine itemLine;

    public ItemLineUpcharge() {
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getUpcharge() {
        return upcharge;
    }

    public void setUpcharge(String upcharge) {
        this.upcharge = upcharge;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public ItemLine getItemLine() {
        return itemLine;
    }

    public void setItemLine(ItemLine itemLine) {
        this.itemLine = itemLine;
    }
}
