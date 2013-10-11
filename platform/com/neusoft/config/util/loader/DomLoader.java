package com.neusoft.config.util.loader;

import java.io.IOException;
import java.io.InputStream;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.servlet.ServletContext;

import org.w3c.dom.Document;

import org.xml.sax.EntityResolver;
import org.xml.sax.SAXException;
import org.xml.sax.InputSource;
import org.xml.sax.helpers.DefaultHandler;

import org.apache.log4j.Logger;


public class DomLoader implements Loader {
	
	private static final Logger LOG = Logger.getLogger(DomLoader.class);
	
	public Document loadXML(String path,ServletContext sc){
		InputStream input = sc.getResourceAsStream(path);
		return loadXML(input);
	}
	
	public Document loadXML(String path,Class<?> clazz){
		return loadXML(FileLoader.load(path, clazz));
	}
	
	public Document loadXML(InputStream input){
		DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
		setSchema(factory);
		try{
			DocumentBuilder builder = factory.newDocumentBuilder();
			return builder.parse(input);
		}catch (IOException e) {
			LOG.error("XML transform failed", e);
		}catch (SAXException e) {
			LOG.error("XML contents have error", e);
		}catch (ParserConfigurationException e) {
			LOG.error(e);
		}
		return null;
	}
	
	protected void setSchema(DocumentBuilderFactory factory){
		
	}
	
	public Document loadXML(InputStream input,final String dtd,final Class<?> clazz){
		DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
		factory.setValidating(true);
		try{
			DocumentBuilder builder = factory.newDocumentBuilder();
			builder.setErrorHandler(new DefaultHandler());
			builder.setEntityResolver(new EntityResolver(){
				public InputSource resolveEntity(String publicId, String systemId){
					return new InputSource(FileLoader.load(dtd, clazz));
				}
			});
			return builder.parse(input);
		}catch (IOException e) {
			LOG.error("XML transform failed", e);
		}catch (SAXException e) {
			LOG.error("XML contents have error", e);
		}catch (ParserConfigurationException e) {
			LOG.error(e);
		}
		return null;
	}
	
}
