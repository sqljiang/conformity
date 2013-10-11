/*
 * @(#)AutoScheduled.java	#version# #builddate#
 * Copyright 2011 Neusoft, Inc. All rights reserved.
 * Neusoft PROPRIETARY/CONFIDENTIAL. 
 */
package com.neusipo.wee.core.scheduler;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * @name AutoScheduled.java
 * @author xunxy@neusoft.com
 * @version wee2 2012-6-20
 */
@Target( { ElementType.METHOD, ElementType.ANNOTATION_TYPE })
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface AutoScheduled {

	String cron() default "";

	long periodic() default -1;


}
