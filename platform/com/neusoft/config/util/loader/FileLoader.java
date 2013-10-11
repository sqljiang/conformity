package com.neusoft.config.util.loader;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.net.URLConnection;
import java.util.Properties;

import javax.servlet.ServletContext;

public class FileLoader {
	
	public static InputStream load(String path,Class<?> clazz){
		URL url = ClassLoaderUtil.getResource(path, clazz);
		if(null ==url) throw new RuntimeException("cann't find the file:"+path);
		try{
			URLConnection conn = url.openConnection();
			return conn.getInputStream();
		}catch (IOException e) {
			throw new RuntimeException("load file "+path+" fail");
		}
	}
	
	public static InputStream load(String path,ServletContext sc){
		if(sc != null){
			return sc.getResourceAsStream(path);
		}
		return null;
	}
	
	public static Properties loadProp(String path,Class<?> clazz){
		Properties prop = new Properties();
		try{
			prop.load(load(path, clazz));
		}catch (IOException e) {
		}
		return prop;
	}
}
