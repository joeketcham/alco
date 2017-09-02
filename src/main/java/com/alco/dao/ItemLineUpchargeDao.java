package com.alco.dao;

import com.alco.model.ItemLineUpcharge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

/**
 * Created by joeketcham on 10/13/2016.
 */

@RepositoryRestResource
public interface ItemLineUpchargeDao extends JpaRepository<ItemLineUpcharge, Long>{
}
