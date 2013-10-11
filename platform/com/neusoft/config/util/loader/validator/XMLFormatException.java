package com.neusoft.config.util.loader.validator;

@SuppressWarnings("serial")
public class XMLFormatException extends RuntimeException {
	
	public XMLFormatException(){
		super();
	}
	
	public XMLFormatException(String message){
		super(message);
	}
	
	public XMLFormatException(Throwable cause){
		super(cause);
	}
	
	public XMLFormatException(String message,Throwable cause){
		super(message,cause);
	}
	
}
