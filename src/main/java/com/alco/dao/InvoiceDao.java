package com.alco.dao;

import com.alco.model.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.Collection;

@RepositoryRestResource
public interface InvoiceDao extends JpaRepository<Invoice, Long> {
    //Collection<Invoice> findByLastname(@Param("ln") String ln);
}
