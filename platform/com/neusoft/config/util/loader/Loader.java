package com.neusoft.config.util.loader;

import java.io.InputStream;

import javax.servlet.ServletContext;

import org.w3c.dom.Document;

public interface Loader {
	/**
	 * 上下文加载指定路径的XML文档
	 * @param path 文档路径
	 * @param sc javax.servlet.ServletContext
	 * @return
	 */
	public Document loadXML(String path,ServletContext sc);
	/**
	 * 直接加载XML文档
	 * @param path	文档路径
	 * @param clazz 加载类
	 * @return
	 */
	public Document loadXML(String path,Class<?> clazz);
	/**
	 * 加载通过验证的XML文档
	 * @param input 文件流
	 * @return
	 */
	public Document loadXML(InputStream input);
	/**
	 * 加载通过验证的XML文档
	 * @param input
	 * @param resolver
	 * @return
	 */
	public Document loadXML(InputStream input,String dtd,Class<?> clazz);
	
}
