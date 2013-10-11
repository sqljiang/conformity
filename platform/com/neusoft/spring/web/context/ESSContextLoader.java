package com.neusoft.spring.web.context;

import java.io.File;
import java.net.URL;

import javax.servlet.ServletContext;

import org.springframework.context.ApplicationContext;
import org.springframework.util.ObjectUtils;
import org.springframework.web.context.ConfigurableWebApplicationContext;
import org.springframework.web.context.ContextLoader;

import org.w3c.dom.Document;

import com.neusoft.config.util.loader.ClassLoaderUtil;
import com.neusoft.config.util.loader.DomLoader;
import com.neusoft.config.util.loader.FileLoader;
import com.neusoft.config.util.loader.Loader;
import com.neusoft.config.util.loader.validator.XMLFormatException;
import com.neusoft.config.util.loader.validator.XMLSchemaValidator;

public class ESSContextLoader extends ContextLoader {
	
	@Override
	protected void configureAndRefreshWebApplicationContext(ConfigurableWebApplicationContext wac, ServletContext sc){
		if (ObjectUtils.identityToString(wac).equals(wac.getId())) {
			String idParam = sc.getInitParameter(CONTEXT_ID_PARAM);
			if (idParam != null) {
				wac.setId(idParam);
			}
			else {
				if (sc.getMajorVersion() == 2 && sc.getMinorVersion() < 5) {
					wac.setId(ConfigurableWebApplicationContext.APPLICATION_CONTEXT_ID_PREFIX + ObjectUtils.getDisplayString(sc.getServletContextName()));
				}
				else {
					wac.setId(ConfigurableWebApplicationContext.APPLICATION_CONTEXT_ID_PREFIX + ObjectUtils.getDisplayString(sc.getContextPath()));
				}
			}
		}
		ApplicationContext parent = loadParentContext(sc);
		wac.setParent(parent);
		wac.setServletContext(sc);
		String initParameter = sc.getInitParameter(CONFIG_LOCATION_PARAM);
		if (initParameter != null) {
			String[] files = getConfigFiles(initParameter,sc);
			if(null != files) wac.setConfigLocations(files);
			else throw new RuntimeException("the configuration file "+initParameter+" not bean files");
		}
		customizeContext(sc, wac);
		wac.refresh();
	}
	
	protected String[] getConfigFiles(String initParameter,ServletContext sc){
		if(initParameter.contains(":")){
			initParameter = initParameter.split(":")[1];
		}
		Loader loader = new DomLoader();
		URL url = ClassLoaderUtil.getResource("spring-context-configuration.xsd",this.getClass());
		File file = new File(url.getFile());
		if(XMLSchemaValidator.volidate(FileLoader.load(initParameter, sc),file)){
			Document document = loader.loadXML(initParameter, sc);
			DocumentParser parser = new DocumentParser();
			return parser.parse(document);
		}
		throw new XMLFormatException(url.getFile()+" has a illage element or attribute");
	}
	
}
