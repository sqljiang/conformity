package com.neusipo.wee.cache.mapping;

import java.io.ByteArrayOutputStream;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Set;
import java.util.Map.Entry;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Source;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerConfigurationException;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.stream.StreamResult;

import org.apache.commons.lang.Validate;
import org.apache.log4j.Logger;
import org.w3c.dom.Document;

import com.neusipo.wee.bizlog.domain.BizLog;

public class DocumentSupport {
	
	private  static DocumentBuilder builder;
	
	private static Transformer transformer ; 	
	
	private final static Logger LOG = Logger.getLogger(DocumentSupport.class);
	
	private final static String HEAD = "<?xml version='1.0' encoding='UTF-8'?>";
	
	static {
		DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
		TransformerFactory tFactory = TransformerFactory.newInstance();
		try{
			builder = factory.newDocumentBuilder();
			transformer = tFactory.newTransformer();
			transformer.setOutputProperty(OutputKeys.ENCODING, "UTF-8");
		}catch (ParserConfigurationException e) {
			LOG.error("document builder create failure", e);
			builder = null;
		}catch (TransformerConfigurationException e) {
			LOG.error("document transformer create failure", e);
			transformer = null;
		}
	}
	
	
	public Document create(){
		return builder.newDocument();
	}
	
	public String buildXML(List<BizLog> logs){
		BizLog log = logs.get(0);
		StringBuffer sb = new StringBuffer();
		sb.append(HEAD);
		sb.append("<logs>");
		sb.append("<task>");
		sb.append("<taskId>").append(log.getTaskID()).append("</taskId>");
		sb.append("<userId>").append(replace(log.getUserID())).append("</userId>");
		sb.append("<checkDocId>").append(replace(log.getCheckDocID())).append("</checkDocId>");
		sb.append("<taskCreateTime>").append(log.getTaskCreateTime()).append("</taskCreateTime>");
		sb.append(buildLog(logs));
		sb.append("</task>");
		sb.append("</logs>");
		return sb.toString();
	}
	
	public String buildLog(List<BizLog> logs){
		StringBuffer sb = new StringBuffer();
		BizLog log = null;
		List<BizLog> bls = Collections.synchronizedList(logs);
		synchronized(bls){
			for(int i = 0,len = bls.size() ; i < len ; i++){
				log = bls.remove(i);
				if(log == null) continue;
				List<LinkedHashMap<String, Object>> bl = log.getBslList();
				for(LinkedHashMap<String, Object> map : bl){
					sb.append("<log>");
					Set<Entry<String,Object>> results = map.entrySet();
					for(Entry<String,Object> result : results){
						sb.append("<").append(result.getKey()).append(">").append(replace(result.getValue().toString())).append("</").append(result.getKey()).append(">");
					}
					sb.append("</log>");
				}
			}
		}
		return sb.toString();
	}
	
	private String replace(String content){
		if(content != null){ 
			content = content.replace("&", "&amp");
			content = content.replace("<", "&lt");
			content = content.replace(">", "&gt");
			content = content.replace("'", "&apos");
			content = content.replace("\"", "&quot");
		}
		return content;
	}
	
	
	public String transform(Document document){
		Validate.notNull(document);
		Source source = new DOMSource(document);
		ByteArrayOutputStream output = new ByteArrayOutputStream();
		StreamResult result = new StreamResult(output);
		try{
			transformer.transform(source, result);
		}catch (TransformerException e) {
			LOG.error("document transform to string failure", e);
		}
		return output.toString();
	}
	
}
