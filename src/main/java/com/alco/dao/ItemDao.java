package com.alco.dao;

import com.alco.model.Category;
import com.alco.model.CustomerType;
import com.alco.model.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.math.BigInteger;
import java.util.Collection;

/**
 * Created by joeketcham on 10/13/2016.
 */

@RepositoryRestResource
public interface ItemDao extends JpaRepository<Item, Long> {
    Collection<Item> findByDescription(@Param("Description") String description);

    Collection<Item> findByCategoryAndCustomerType(Category category, CustomerType customerType);

    /*
    @Query("SELECT c FROM Category c inner join c.customerType ct WHERE ct.id = :customerTypeId")
    Collection<Category> findByCustomerTypeId(@Param("customerTypeId") Long customerTypeId);
     */
    @Query("SELECT i FROM Item i INNER JOIN i.customerType ct INNER JOIN i.category cat " +
            "WHERE ct.id = :CustomerTypeId AND cat.id = :CategoryId")
    Collection<Item> findByCatandCustType(@Param("CategoryId") Long catId,
                                          @Param("CustomerTypeId") Long customerTypeId);
}
