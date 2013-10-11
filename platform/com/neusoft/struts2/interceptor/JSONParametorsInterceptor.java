package com.neusoft.struts2.interceptor;

import java.util.Iterator;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import com.opensymphony.xwork2.ActionContext;
import com.opensymphony.xwork2.ActionInvocation;
import com.opensymphony.xwork2.interceptor.NoParameters;
import com.opensymphony.xwork2.interceptor.ParametersInterceptor;
import com.opensymphony.xwork2.util.ValueStack;
import com.opensymphony.xwork2.util.logging.Logger;
import com.opensymphony.xwork2.util.logging.LoggerFactory;
import com.opensymphony.xwork2.util.reflection.ReflectionContextState;

public class JSONParametorsInterceptor extends ParametersInterceptor{

	private static final long serialVersionUID = 1L;
	
	private static final Logger LOG = LoggerFactory.getLogger(ParametersInterceptor.class);
	
	@Override
    public String doIntercept(ActionInvocation invocation) throws Exception {
        Object action = invocation.getAction();
        if (!(action instanceof NoParameters)) {
            ActionContext ac = invocation.getInvocationContext();
            final Map<String, Object> parameters = retrieveParameters(ac);

            if (LOG.isDebugEnabled()) {
                LOG.debug("Setting params " + getParameterLogMap(parameters));
            }

            if (parameters != null) {
            	dealWithParameters(parameters);
                Map<String, Object> contextMap = ac.getContextMap();
                try {
                    ReflectionContextState.setCreatingNullObjects(contextMap, true);
                    ReflectionContextState.setDenyMethodExecution(contextMap, true);
                    ReflectionContextState.setReportingConversionErrors(contextMap, true);

                    ValueStack stack = ac.getValueStack();
                    setParameters(action, stack, parameters);
                } finally {
                    ReflectionContextState.setCreatingNullObjects(contextMap, false);
                    ReflectionContextState.setDenyMethodExecution(contextMap, false);
                    ReflectionContextState.setReportingConversionErrors(contextMap, false);
                }
            }
        }
        return invocation.invoke();
    }
	
	protected void dealWithParameters(Map<String,Object> parameters){
	   Set<Entry<String, Object>> entries = parameters.entrySet();
	   for(Entry<String, Object> entry : entries){
		  if(!(entry.getValue() instanceof String[])) continue;
		  String[] entryTemp = (String[]) entry.getValue();
		  JSONObject jsonObject = null;
		  JSONArray jsonArray = null;
		  if(entryTemp != null){
			  if(entryTemp.length == 1){
				  if(isJSONObject(entryTemp[0])){
					  jsonObject = JSONObject.fromObject(entryTemp[0]);
					  parseJSONObject(entry.getKey(), jsonObject, parameters);
					  parameters.remove(entry.getKey());
				  }else if(isJSONArray(entryTemp[0])){
					  jsonArray = JSONArray.fromObject(entryTemp[0]);
					  parseJSONArray(entry.getKey(), jsonArray, parameters);
					  parameters.remove(entry.getKey());
				  }
			  }else if (entryTemp.length > 1) {
				for(int i = 0; i < entryTemp.length; i++){
					if(isJSONObject(entryTemp[i])){
						jsonObject = JSONObject.fromObject(entryTemp[i]);
						parseJSONObject(entry.getKey()+"["+i+"]", jsonObject, parameters);
						parameters.remove(entry.getKey());
					}else if (isJSONArray(entryTemp[i])) {
						jsonArray = JSONArray.fromObject(entryTemp[i]);
						parseJSONArray(entry.getKey()+"["+i+"]", jsonArray, parameters);
						parameters.remove(entry.getKey());
					}
				}
			  }
		  }
	   }
	}
	
	private void parseJSONObject(String oldKey,JSONObject jsonObject ,Map<String, Object> parameters){
	   Iterator<?> iterator = jsonObject.keys();
	   while(iterator.hasNext()){
		   String key = String.valueOf(iterator.next());
		   String jsonKey = new StringBuilder().append(oldKey).append(".").append(key).toString();
		   String json = String.valueOf(jsonObject.get(key));
		   if(isJSONObject(json)){
			   JSONObject object = JSONObject.fromObject(json);
			   parseJSONObject(jsonKey.trim(), object, parameters);
		   }else if(isJSONArray(json)){
			   JSONArray array = JSONArray.fromObject(json);
			   parseJSONArray(jsonKey.trim(), array, parameters);
		   }else {
			   parameters.put(jsonKey.trim(), new String[]{json});
		   }
	   }
	}
	
	private void parseJSONArray(String oldKey,JSONArray jsonArray,Map<String, Object> parameters){
		for(int i = 0; i < jsonArray.size(); i++){
			Object val = jsonArray.get(i);
			String temp = String.valueOf(val);
			if(isJSONObject(temp)){
				JSONObject object = JSONObject.fromObject(temp);
				parseJSONObject(new StringBuilder().append(oldKey).append("[").append(i).append("]").toString(), object, parameters);
			}else if(isJSONArray(temp)){
				JSONArray array = JSONArray.fromObject(temp);
				parseJSONArray(new StringBuilder().append(oldKey).append("[").append(i).append("]").toString(), array, parameters);
			}else {
				parameters.put(oldKey.trim(), jsonArray.toArray());
			}
		}
	}
	
	private boolean isJSONObject(String json){
		return json != null && json.startsWith("{") && json.endsWith("}");
	}
	
	private boolean isJSONArray(String json){
		return json != null && json.startsWith("[") && json.endsWith("]");
	}
	
	
}
