package com.alco;

import com.alco.model.*;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurerAdapter;

/**
 * Created by joeketcham on 6/4/2017.
 */
@Configuration
public class RepositoryConfig extends RepositoryRestConfigurerAdapter {
    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config) {
        config.exposeIdsFor(Customer.class);
        config.exposeIdsFor(CustomerType.class);
        config.exposeIdsFor(Category.class);
        config.exposeIdsFor(Item.class);
        config.exposeIdsFor(ItemLine.class);
        config.exposeIdsFor(Upcharge.class);
    }
}
