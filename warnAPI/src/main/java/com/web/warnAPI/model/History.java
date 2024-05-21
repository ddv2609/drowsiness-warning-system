package com.web.warnAPI.model;

import java.sql.Date;
import java.sql.Time;

public class History {
	
	private int historyID;
	private String message;
	private String typeWarn;
	private Date dateWarn;
	private Time startTime;
	private Time endTime;
	
	public History() {}
	
	public History(int historyID, String message, String typeWarn, 
			Date dateWarn, Time startTime, Time endTime) {
		this.historyID = historyID;
		this.message = message;
		this.typeWarn = typeWarn;
		this.dateWarn = dateWarn;
		this.startTime = startTime;
		this.endTime = endTime;
	}
	
	public int getHistoryID() {
		return historyID;
	}
	
	public void setHistoryID(int historyID) {
		this.historyID = historyID;
	}
	
	public String getMessage() {
		return message;
	}
	
	public void setMessage(String message) {
		this.message = message;
	}
	
	public String getTypeWarn() {
		return typeWarn;
	}
	
	public void setTypeWarn(String typeWarn) {
		this.typeWarn = typeWarn;
	}
	
	public Date getDateWarn() {
		return dateWarn;
	}
	
	public void setDateWarn(Date dateWarn) {
		this.dateWarn = dateWarn;
	}
	
	public Time getStartTime() {
		return startTime;
	}
	
	public void setStartTime(Time startTime) {
		this.startTime = startTime;
	}
	
	public Time getEndTime() {
		return endTime;
	}
	
	public void setEndTime(Time endTime) {
		this.endTime = endTime;
	}
	
}
