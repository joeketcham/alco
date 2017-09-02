package com.alco.dao;

import com.alco.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.Collection;
import java.util.List;

/**
 * Created by joeketcham on 10/13/2016.
 */

@RepositoryRestResource
public interface CustomerDao extends JpaRepository<Customer, Long> {
    Collection<Customer> findByLastname(@Param("Lastname") String lastName);
    Collection<Customer> findByPhone1(@Param("Phone1") String phone);
}
