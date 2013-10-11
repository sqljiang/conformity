package com.neusipo.wee.bizlog.mina;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;

import org.apache.mina.core.session.IoSession;
import org.apache.log4j.Logger;

import com.neusoft.trans.command.Request;
import com.neusoft.trans.command.Response;
import com.neusoft.trans.command.impl.DefaultResponse;
import com.neusipo.wee.bizlog.domain.BizLog;
import com.neusipo.wee.cache.SBizLogCache;

public class ReceiveMessageCommandHandler extends AbstractCustomCommandHandler {

	private static final String message = "BIZLOG";
	
	private static final Logger LOG = Logger.getLogger(ReceiveMessageCommandHandler.class);
	
	private SBizLogCache cache;
	
	@Override
	public Response execute(Request request, IoSession session) throws Exception {
		BizLog log = (BizLog)request.getParameter(message);
		if(log != null){
			cache.addBizLog(log);
		}else {
			Calendar calendar = Calendar.getInstance();
			DateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			LOG.info("the mina message empty at "+format.format(calendar.getTime()));
		}
		DefaultResponse response = newDefaultResponse(Response.RC_OK);
		return response;
	}

	public void setCache(SBizLogCache cache) {
		this.cache = cache;
	}
	
}
