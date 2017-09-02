package com.alco.dao;

import com.alco.model.CustomerType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.Collection;

/**
 * Created by joeketcham on 10/13/2016.
 */

@RepositoryRestResource
public interface CustomerTypeDao extends JpaRepository<CustomerType, Long>{
    Collection<CustomerType> findByType(@Param("Type") String type);
}
