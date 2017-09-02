package com.alco.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import org.springframework.format.annotation.DateTimeFormat;

import java.math.BigDecimal;
import java.util.Date;

/**
 * Created by joeketcham on 1/21/2017.
 */
public class SimpleInvoice {

    @JsonFormat(pattern = "MM-dd-yyyy hh:mm a Z")
    private Date dropoff;
    @JsonFormat(pattern = "MM-dd-yyyy hh:mm a Z")
    private Date ready;
    private String note;
    private Boolean paid;
    private BigDecimal total_price;
    private long total_quantity;
    private long customerId;
    private long invoiceId;

    public long getInvoiceId() {
        return invoiceId;
    }

    public void setInvoiceId(long invoiceId) {
        this.invoiceId = invoiceId;
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

    public long getTotal_quantity() {
        return total_quantity;
    }

    public void setTotal_quantity(long total_quantity) {
        this.total_quantity = total_quantity;
    }

    public long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(long customerId) {
        this.customerId = customerId;
    }
}
