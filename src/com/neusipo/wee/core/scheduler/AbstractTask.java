/*
 * @(#)AbstractTask.java	#version# #builddate#
 * Copyright 2011 Neusoft, Inc. All rights reserved.
 * Neusoft PROPRIETARY/CONFIDENTIAL. 
 */
package com.neusipo.wee.core.scheduler;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.TimeZone;

import org.springframework.scheduling.support.CronSequenceGenerator;
import org.springframework.stereotype.Component;

/**
 * @name AbstractTask.java
 * @author xunxy@neusoft.com
 * @version wee2 2012-6-19
 */
public abstract class AbstractTask extends Task {

	/**
	 * @desc 描述描述
	 * @auyhor xunxy@neusoft.com
	 * @date 2012-11-26
	 */
	private static final long serialVersionUID = 1175442882462805559L;

	public static final String RUNNING = "1";

	public static final String NOT_RUNNING = "0";

	private String id = null;

	private String running = null;// running:1;else 0:

	private Date startTime = null;

	private Date lastStartTime = null;

	private Date lastCompleteTime = null;

	private int runCounts = 0;

	private String triggerType = null;

	private String expression = null;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getRunning() {
		return running;
	}

	public void setRunning(String running) {
		this.running = running;
	}

	public Date getStartTime() {
		return startTime;
	}

	public void setStartTime(Date startTime) {
		this.startTime = startTime;
	}

	public Date getLastStartTime() {
		return lastStartTime;
	}

	public void setLastStartTime(Date lastStartTime) {
		this.lastStartTime = lastStartTime;
	}

	public Date getLastCompleteTime() {
		return lastCompleteTime;
	}

	public void setLastCompleteTime(Date lastCompleteTime) {
		this.lastCompleteTime = lastCompleteTime;
	}

	public int getRunCounts() {
		return runCounts;
	}

	public void setRunCounts(int runCounts) {
		this.runCounts = runCounts;
	}

	public String getExpression() {
		return expression;
	}

	public void setExpression(String expression) {
		this.expression = expression;
	}

	public String getTriggerType() {
		return triggerType;
	}

	public void setTriggerType(String triggerType) {
		this.triggerType = triggerType;
	}

	protected void beforeRun() {
		if (this.startTime == null)
			this.startTime = new Date();
		this.lastStartTime = new Date();
		this.setRunning(RUNNING);
	}

	public void run() {
		beforeRun();
		this.internalRun();
		afterRun();
	}

	public Date getNextExecutionTime() {
		Date nextDate = null;
		if (this.getTriggerType().equals("cron")) {
			CronSequenceGenerator sequenceGenerator = new CronSequenceGenerator(this.expression, TimeZone.getDefault());
			Date date = this.lastStartTime;
			if (date == null) {
				return null;
			} else {
				return sequenceGenerator.next(date);
			}

		} else {
			if (this.lastCompleteTime == null) {
				return null;
			} else {
				SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
				nextDate = new Date(this.getLastCompleteTime().getTime() + Long.valueOf(expression));
			}
		}
		return nextDate;
	}

	protected void afterRun() {
		this.lastCompleteTime = new Date();
		this.runCounts = this.runCounts++;
	}

	public abstract void internalRun();

}
