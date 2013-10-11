package com.neusoft.config.util.loader.validator;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.File;

import javax.xml.XMLConstants;
import javax.xml.transform.Source;
import javax.xml.transform.stream.StreamSource;
import javax.xml.validation.Schema;
import javax.xml.validation.SchemaFactory;
import javax.xml.validation.Validator;

import org.xml.sax.SAXException;

import org.apache.log4j.Logger;


public  class XMLSchemaValidator {
	
	private static final Logger LOG = Logger.getLogger(XMLSchemaValidator.class);
	
	public static boolean volidate(InputStream xml,File file){
		SchemaFactory factory = SchemaFactory.newInstance(XMLConstants.W3C_XML_SCHEMA_NS_URI);
		Schema schema = null;
		try{
			if(!file.exists()) throw new FileNotFoundException("the file not exist");
			schema = factory.newSchema(file);
			Validator validator = schema.newValidator();
			Source source = new StreamSource(xml);
			validator.validate(source);
			return true;
		}catch (IOException e) {
			LOG.error(e);
		}catch (SAXException e) {
			LOG.error(e);
		}
		return false;
	}
	
}
