package com.neusoft.spring.web.context;

import java.util.ArrayList;
import java.util.List;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

class DocumentParser {

	public String[] parse(Document document){
		List<String> files = new ArrayList<String>();
		Element root = document.getDocumentElement();
		NodeList children = root.getElementsByTagName("files");
		for(int i = 0 ,len = children.getLength() ;i < len ;i++){
			Node child = children.item(i);
			String content = child.getTextContent();
			if(!isNull(content)){
				content = content.trim().replaceAll("\n\t+", ",");
				if(content.contains(",")){
					String[] fs = content.split(",");
					for(int j = 0 ,l = fs.length ; j < l ;j++ ){
						String file = fs[j];
						if(isNull(file)) continue;
						addConfigFile(files, file);
					}
				}else addConfigFile(files, content);
			}
		}
		
		return files.toArray(new String[]{});
	}
	
	private void addConfigFile(List<String> files,String file){
		if(suffix(file)){
			files.add(file.trim());
			return;
		}
		throw new FileSuffixException(file+" is not xml");
	}
	
	private boolean suffix(String file){
		if(isNull(file)) return false;
		return file.endsWith("xml");
	}
	
	private boolean isNull(String target){
		return null == target || null == target.trim() || "".equals(target);
	}
	
}
