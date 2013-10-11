package com.neusipo.wee.cache.quartz;

import net.sf.ehcache.Cache;
import net.sf.ehcache.Element;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.LinkedList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.RandomAccessFile;

import org.springframework.stereotype.Component;

import org.apache.log4j.Logger;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.Validate;

import com.neusipo.wee.cache.mapping.DocumentSupport;
import com.neusipo.wee.core.scheduler.AbstractTask;
import com.neusipo.wee.core.scheduler.AutoScheduled;
import com.neusipo.wee.bizlog.domain.BizLog;
import com.neusipo.wee.bizlog.domain.SystemType;

/**
 * 
 * EhCache 2.7版本不能同步,改为2.6.6
 * 
 * @author 蒋远龙
 *
 */
@Component
public class QuartzJob extends AbstractTask{
	
	private static final long serialVersionUID = -6971050319883705295L;
	
	private Cache cache ;
	
	private String basePath = "E:"+File.separator;
	
	private final DocumentSupport support = new DocumentSupport();
	
	private final ExecutorService executor = Executors.newFixedThreadPool(10);
	
	private final static Logger LOG = Logger.getLogger(QuartzJob.class);
	
	private static final String ENDTAG = "</log></task></logs>";
	
	public QuartzJob() {
		this.setId(String.valueOf(System.currentTimeMillis()));
	}
	
	@SuppressWarnings("unchecked")
	@AutoScheduled(periodic = 1000)
	public void internalRun(){
		List<String> keys = (List<String>) cache.getKeys();
		if(keys.size() <= 0) return ;
		for(String key : keys){
			Element e = cache.removeAndReturnElement(key);
			if(e == null) continue;
			List<BizLog> copy = null;
			synchronized(e){
				List<BizLog> logs = (List<BizLog>) e.getObjectValue();
				if(logs == null || logs.size() <= 0) continue;
				copy = new LinkedList<BizLog>();
				copy.addAll(logs);
				logs.clear();
			}
			executor.execute(new LogTask(copy));
		}
	}
	
	private class LogTask extends Thread{
		
		private List<BizLog> logs ;
		
		public LogTask(List<BizLog> logs){
			this.logs = logs;
		}
		
		public void run(){
			BizLog log = logs.get(0);
			String path = log.getTaskID()+".xml";
			String taskTime = log.getTaskCreateTime();
			Calendar calendar = Calendar.getInstance();
			try{
				String content = null;
				File dir = null;
				File file;
				switch(log.getSystem()){
					case E :
						DateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
						calendar.setTime(format.parse(taskTime));
						dir = createDir(basePath, SystemType.E, calendar.getTime());
						break;
					case OTHER :
						Calendar sun = Calendar.getInstance();
						sun.add(Calendar.DAY_OF_WEEK, - sun.get(Calendar.DAY_OF_WEEK) + 1);
						dir = createDir(basePath, SystemType.OTHER, sun.getTime());
						break;
				}
				file = new File(dir,path);
				if(file.exists()){
					content = support.buildLog(logs);
					appendFile(dir, path, content);
					return ;
				}
				content = support.buildXML(logs);
				storeFile(dir,path,content);
			}catch (ParseException e) {
				LOG.error("the date transform error", e);
			}
		}
	}
	
	private void appendFile(File dir,String path,String content){
		if(!dir.isDirectory()){
			throw new IllegalArgumentException("the path of "+basePath+" is not dirctory");
		}
		File file = new File(dir,path);
		RandomAccessFile access = null;
		if(file.exists()){
			try{
				access = new RandomAccessFile(file,"rw");
				long start = access.length() - ENDTAG.length();
				access.seek(start);
				content += ENDTAG;
				access.write(content.getBytes());
			}catch (FileNotFoundException e) {
				LOG.error(e);
			}catch(IOException e){
				LOG.error(e);
			}finally{
				if(access != null){
					try{
						access.close();
					}catch (IOException e) {
						LOG.error(e);
					}
				}
			}
		}
	}
	
	private void storeFile(File dir,String path,String content){
		if(!dir.isDirectory()){
			throw new IllegalArgumentException("the path of "+basePath+" is not dirctory");
		}
		File file = new File(dir,path);
		FileOutputStream output = null;
		OutputStreamWriter writer = null;
		BufferedWriter buffer = null;
		try{
			if(file.createNewFile()){
				output = new FileOutputStream(file);
				writer = new OutputStreamWriter(output);
				buffer = new BufferedWriter(writer);
				buffer.write(content);
				buffer.flush();
			}
		}catch (IOException e) {
			LOG.error("create file "+path+" failure", e);
		}finally{
			IOUtils.closeQuietly(buffer);
			IOUtils.closeQuietly(writer);
			IOUtils.closeQuietly(output);
		}
	}
	
	private static File createDir(String basePath,SystemType type,Date date)throws IllegalArgumentException{
		StringBuffer sb = new StringBuffer();
		if(basePath.endsWith(File.separator)) sb.append(basePath);
		else sb.append(basePath).append(File.separator);
		sb.append("bizlog").append(File.separator);
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		DateFormat format;
		switch(type){
			case E:   //按月
				format = new SimpleDateFormat("yyyy-MM");
				sb.append("E").append(File.separator);
				break;
			case OTHER: //按周
				sb.append("OTHER").append(File.separator);
				format = new SimpleDateFormat("yyyy-MM-dd");
				break;
			default :
				throw new IllegalArgumentException("the type of system not exits");
		}
		sb.append(format.format(calendar.getTime()));
		File file = new File(sb.toString());
		if(!file.exists()){
			file.mkdirs();
		}
		return file;
	}

	public void setCache(Cache cache) {
		this.cache = cache;
	}

	public void setBasePath(String basePath) {
		Validate.notNull(basePath, "the log file base path cann't nulls");
		this.basePath = basePath;
	}
	
}