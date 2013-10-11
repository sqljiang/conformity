package com.neusoft.spring.web.context;

@SuppressWarnings("serial")
public class FileSuffixException extends RuntimeException {

	public FileSuffixException(){
		super();
	}
	
	public FileSuffixException(String message){
		super(message);
	}
	
	public FileSuffixException(Throwable cause){
		super(cause);
	}
	
	public FileSuffixException(String message,Throwable cause){
		super(message,cause);
	}
	
}
