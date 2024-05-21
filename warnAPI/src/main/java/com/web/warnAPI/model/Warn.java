package com.web.warnAPI.model;

import java.io.Serializable;

public class Warn implements Serializable {
	private String message;
	private String typeWarn;
	private String dateWarn;
	private String timeWarn;
	
	public Warn() { }
	public Warn(String message, String typeWarn, String dateWarn, String timeWarn) {
		this.message = message;
		this.typeWarn = typeWarn;
		this.dateWarn = dateWarn;
		this.timeWarn = timeWarn;
	}
	
	public String getMessage() {
		return message;
	}
	
	public String getTypeWarn() {
		return typeWarn;
	}
	
	public String getDateWarn() {
		return dateWarn;
	}
	
	public String getTimeWarn() {
		return timeWarn;
	}
	
	public void setMessage(String message) {
		this.message = message;
	}
	
	public void setTypeWarn(String typeWarn) {
		this.typeWarn = typeWarn;
	}
	
	public void setDateWarn(String dateWarn) {
		this.dateWarn = dateWarn;
	}
	
	public void setTimeWarn(String timeWarn) {
		this.timeWarn = timeWarn;
	}
	
	@Override
	public String toString() {
		return String.format("Message: %s - Type of warn: %s - Date: %s - Time: %s", 
				message, typeWarn, 
				dateWarn, timeWarn);
	}
}
