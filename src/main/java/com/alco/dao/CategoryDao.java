package com.alco.dao;

import com.alco.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.persistence.NamedQuery;
import java.util.Collection;

/**
 * Created by joeketcham on 10/13/2016.
 */

@RepositoryRestResource
public interface CategoryDao extends JpaRepository<Category, Long> {
    /*
    @Query("SELECT p FROM Person p WHERE LOWER(p.lastName) = LOWER(:lastName)")
    public List<Person> find(@Param("lastName") String lastName);
     */

    @Query("SELECT c.id, c.description FROM Category c")
    Collection<Category> findMyCategories();

    Collection<Category> findByDescription(@Param("description") String description);

    @Query("SELECT c FROM Category c inner join c.customerType ct WHERE ct.id = :customerTypeId")
    Collection<Category> findByCustomerTypeId(@Param("customerTypeId") Long customerTypeId);
}
