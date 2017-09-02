package com.alco.model;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.List;

/**
 * Created by joeketcham on 10/11/2016.
 */
@Entity
@Table(name = "ITEM_LINE")
public class ItemLine {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;
    private String item_category;
    private String item;
    private Boolean price_override;
    private long quantity;
    private BigDecimal price;

    @ManyToOne
    @JoinColumn(name="INVOICE_ID")
    private Invoice invoice;

    @OneToMany(mappedBy = "itemLine")
    private List<ItemLineUpcharge> itemlineupcharges;

    private Invoice getInvoice() {
        return invoice;
    }

    public void setInvoice(Invoice invoice) {
        this.invoice = invoice;
    }

    public List<ItemLineUpcharge> getItemlineupcharges() {
        return itemlineupcharges;
    }

    public void setItemlineupcharges(List<ItemLineUpcharge> itemlineupcharges) {
        this.itemlineupcharges = itemlineupcharges;
    }

    public ItemLine() {
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getItem_category() {
        return item_category;
    }

    public void setItem_category(String item_category) {
        this.item_category = item_category;
    }

    public String getItem() {
        return item;
    }

    public void setItem(String item) {
        this.item = item;
    }

    public Boolean getPrice_override() {
        return price_override;
    }

    public void setPrice_override(Boolean price_override) {
        this.price_override = price_override;
    }

    public long getQuantity() {
        return quantity;
    }

    public void setQuantity(long quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }
}
