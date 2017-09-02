package com.alco.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "INVOICE")
public class Invoice {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @DateTimeFormat(pattern = "MM/dd/yyyy")
    private Date dropoff;
    //@DateTimeFormat(pattern = "MM/dd/yyyy")
    private Date ready;
    private String note;
    private Boolean paid;
    private BigDecimal total_price;
    private Long total_quantity;

    public boolean isPaid() {
        return paid;
    }

    public void setPaid(boolean paid) {
        this.paid = paid;
    }

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="CUSTOMER_ID")
    @JsonManagedReference
    private Customer customer;

    @OneToMany(mappedBy = "invoice")
    @JsonBackReference
    private List<ItemLine> itemlines;

    public Invoice() {
    }

    public Boolean getPaid() {
        return paid;
    }

    public void setPaid(Boolean paid) {
        this.paid = paid;
    }

    public BigDecimal getTotal_price() {
        return total_price;
    }

    public void setTotal_price(BigDecimal total_price) {
        this.total_price = total_price;
    }

    public Long getTotal_quantity() {
        return total_quantity;
    }

    public void setTotal_quantity(Long total_quantity) {
        this.total_quantity = total_quantity;
    }

    public List<ItemLine> getItemlines() {
        return itemlines;
    }

    public void setItemlines(List<ItemLine> itemlines) {
        this.itemlines = itemlines;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public Date getDropoff() {
        return dropoff;
    }

    public void setDropoff(Date dropoff) {
        this.dropoff = dropoff;
    }

    public Date getReady() {
        return ready;
    }

    public void setReady(Date ready) {
        this.ready = ready;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}
