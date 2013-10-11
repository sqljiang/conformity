package com.neusoft.config.util.loader.validator;

import java.io.IOException;
import java.util.Map;

import javax.xml.parsers.ParserConfigurationException;
import javax.xml.parsers.SAXParser;
import javax.xml.parsers.SAXParserFactory;

import org.xml.sax.InputSource;
import org.xml.sax.SAXException;
import org.xml.sax.helpers.DefaultHandler;

import org.apache.log4j.Logger;

public class XMLSAXValidator {
	
	private static final Logger LOG = Logger.getLogger(XMLSAXValidator.class);
	
	public XMLSAXValidator(){
		
	}
	
	public  boolean validate(InputSource inputSource,Map<String, String> dtdMappings){
		SAXParserFactory factory = SAXParserFactory.newInstance();
		try{
			SAXParser parser = factory.newSAXParser();
			parser.parse(inputSource,new ValidateHandler());
			return true;
		}catch (ParserConfigurationException e) {
			LOG.error(e);
		}catch (SAXException e) {
			LOG.error(e);
		}catch (IOException e) {
			LOG.error(e);
		}
		return false;
	}
	
	public class ValidateHandler extends DefaultHandler{
		
	}
	
}
