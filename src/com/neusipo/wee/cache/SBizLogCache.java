package com.neusipo.wee.cache;

import java.util.LinkedList;
import java.util.List;

import net.sf.ehcache.Cache;
import net.sf.ehcache.Element;

import org.apache.commons.lang.Validate;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.neusipo.wee.bizlog.domain.BizLog;

public class SBizLogCache {

	Log logger = LogFactory.getLog(SBizLogCache.class);

	private Cache cache = null;
	
	public void setLogCache(Cache cache) {
		this.cache = cache;
	}

	public void addBizLog(BizLog log) {
		Validate.notNull(log, "BizLog object should not be null");
		List<BizLog> logs = null;
		Element element = cache.get(log.getTaskID());
		if(element == null){
			logs = new LinkedList<BizLog>();
			logs.add(log);
			element = new Element(log.getTaskID(),logs);
		}else{
			synchronized(element){
				logs = (List<BizLog>) element.getObjectValue();
				logs.add(log);
			}
		}
		cache.put(element);
	}
	
}
