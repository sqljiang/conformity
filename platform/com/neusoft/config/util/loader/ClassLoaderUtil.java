package com.neusoft.config.util.loader;

import java.net.URL;

import java.lang.reflect.Method;
import java.lang.reflect.InvocationTargetException;

public class ClassLoaderUtil {
	
	private static boolean jdkOne = true;
	
	static{
		String version = System.getProperty("java.version");
		int index = version.indexOf(".");
		if(index > -1){
			char num = version.charAt(index + 1);
			if(num != 1) jdkOne = false;
		}
	}
	
	public static Class<?> loadClass(String clazz)throws ClassNotFoundException{
		if(!jdkOne){
			try{
				return getTCL().loadClass(clazz);
			}catch (Throwable t) {
			}
		}
		return Class.forName(clazz);
	}
	
	public static URL getResource(String name){
		try{
			ClassLoader loader = null;
			URL url = null;
			if(!jdkOne){
				loader = getTCL();
				if(loader != null){
					url = loader.getResource(name);
					if(url != null) return url;
				}
			}
			loader = ClassLoaderUtil.class.getClassLoader();
			if(loader != null){
				url = loader.getResource(name);
				if(url != null) return url;
			}
			url = ClassLoaderUtil.class.getResource(name);
			if(url != null) return url;
			loader = ClassLoader.getSystemClassLoader();
		}catch (InvocationTargetException e) {
		}catch (IllegalAccessException e) {
		}
		return ClassLoader.getSystemResource(name);
	}

	
	public static URL getResource(String name,Class<?> clazz){
		URL url = getResource(name);
		if(url == null && clazz != null){
			ClassLoader loader = clazz.getClassLoader();
			url = loader.getResource(name);
			if(url == null){
				url = clazz.getResource(name);
			}
		}
		return url;
	}
	
	private static ClassLoader getTCL() throws IllegalAccessException,IllegalArgumentException,InvocationTargetException{
		Method method = null;
		try{
			method = Thread.class.getMethod("getContextClassLoader");
		}catch (NoSuchMethodException e) {
			return null;
		}
		return (ClassLoader)method.invoke(Thread.currentThread());
	}
	
}
