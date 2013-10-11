package com.neusipo.wee.bizlog.domain;

import java.io.Serializable;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.LinkedHashMap;

import org.apache.commons.lang.Validate;

public class BizLog implements Serializable  {

	private final String taskID;
	
	private final String userID;
	
	private final String checkDocID;
	
	private final String taskCreateTime;
	
	private final SystemType system;
	
	private boolean isEnd;

	private ArrayList<LinkedHashMap<String, Object>> bslList = new ArrayList<LinkedHashMap<String, Object>>();

	public BizLog(String taskID,String userID,String checkDocID,SystemType system){
		Validate.notNull(taskID, "the task id shold not be null");
		this.taskID = taskID;
		this.userID = userID;
		this.checkDocID = checkDocID;
		Calendar calendar = Calendar.getInstance();
		DateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
//		this.taskCreateTime = format.format(calendar.getTime());
		this.taskCreateTime = "2012-08-31 19:30:00";
		this.system = system;
	}

	public String getTaskID() {
		return taskID;
	}

	public ArrayList<LinkedHashMap<String, Object>> getBslList() {
		return bslList;
	}

	public void setBslList(ArrayList<LinkedHashMap<String, Object>> bslList) {
		this.bslList = bslList;
	}

	public String getUserID() {
		return userID;
	}

	public String getCheckDocID() {
		return checkDocID;
	}

	public String getTaskCreateTime() {
		return taskCreateTime;
	}

	public SystemType getSystem() {
		return system;
	}

	public boolean isEnd() {
		return isEnd;
	}

	public void setEnd(boolean isEnd) {
		this.isEnd = isEnd;
	}
	
}
