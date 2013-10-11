package com.neusoft.spring.web.context;

import org.springframework.web.context.ContextLoader;
import org.springframework.web.context.ContextLoaderListener;

public class ESSContextLoaderListener extends ContextLoaderListener {
	
	@Override
	protected ContextLoader createContextLoader() {
		return new ESSContextLoader();
	}
	
}
