package com.alco.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;
import java.util.List;

/**
 * Created by joeketcham on 10/11/2016.
 */
@Entity
@Table(name = "CUSTOMER_TYPE")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class CustomerType {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;
    private String type;

    @OneToMany(mappedBy = "customerType")
    @JsonBackReference
    private List<Customer> customers;

    @OneToMany(mappedBy = "customerType")
    @JsonBackReference
    private List<Item> items;

    @OneToMany(mappedBy = "customerType")
    @JsonBackReference
    private List<Category> categories;

    public CustomerType() {
    }

    public List<Item> getItems() {
        return items;
    }

    public void setItems(List<Item> items) {
        this.items = items;
    }

    public List<Customer> getCustomers() {
        return customers;
    }

    public void setCustomers(List<Customer> customers) {
        this.customers = customers;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public List<Category> getCategories() {
        return categories;
    }

    public void setCategories(List<Category> categories) {
        this.categories = categories;
    }
}
