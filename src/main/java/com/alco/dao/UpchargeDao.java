package com.alco.dao;

import com.alco.model.Upcharge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

/**
 * Created by joeketcham on 10/13/2016.
 */

@RepositoryRestResource
public interface UpchargeDao extends JpaRepository<Upcharge, Long> {
}
