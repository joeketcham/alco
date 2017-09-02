package com.alco;

import com.alco.dao.InvoiceDao;
import com.alco.model.Invoice;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;

import java.text.SimpleDateFormat;
import java.util.Arrays;

@SpringBootApplication
public class AlcoApplication {

	public static void main(String[] args) {
		SpringApplication.run(AlcoApplication.class, args);
	}

	@Bean
	CommandLineRunner runner(InvoiceDao invoiceDao) {
		return args -> {
			int i = 0;
			/*while (i < 100) {

				Invoice invoice = new Invoice("joe", "k", "ketcham", 37);
				invoiceDao.save(invoice);
				invoice = new Invoice("tiffany", "d", "ketcham", 36);
				invoiceDao.save(invoice);
				invoice = new Invoice("aiden", "u", "ketcham", 7);
				invoiceDao.save(invoice);
				invoice = new Invoice("kaleb", "g", "ketcham", 5);
				invoiceDao.save(invoice);
				invoice = new Invoice("jake", "", "ketcham", 16);
				invoiceDao.save(invoice);
				i++;
			};*/
		};
	}

	@Bean
	public Jackson2ObjectMapperBuilder jacksonBuilder() {
		Jackson2ObjectMapperBuilder b = new Jackson2ObjectMapperBuilder();
		b.indentOutput(true).dateFormat(new SimpleDateFormat("yyyy-MM-dd HH:mm"));
		return b;
	}
}
