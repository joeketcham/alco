package com.alco.dao;

import com.alco.model.ItemLine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

/**
 * Created by joeketcham on 10/12/2016.
 */

@RepositoryRestResource
public interface ItemLineDao extends JpaRepository<ItemLine, Long> {
}
