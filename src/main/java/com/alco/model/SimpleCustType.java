package com.alco.model;

/**
 * Created by joeketcham on 6/24/2017.
 */
public class SimpleCustType {
    String type;
    String previousType;

    public String getPreviousType() {
        return previousType;
    }

    public void setPreviousType(String previousType) {
        this.previousType = previousType;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
