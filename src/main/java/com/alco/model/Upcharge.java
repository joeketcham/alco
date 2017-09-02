package com.alco.model;

import javax.persistence.*;
import java.math.BigDecimal;

/**
 * Created by joeketcham on 10/13/2016.
 */

@Entity
@Table(name = "UPCHARGE")
public class Upcharge {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;
    private String description;
    private BigDecimal price;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
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

    private Upcharge() {

    }
}
