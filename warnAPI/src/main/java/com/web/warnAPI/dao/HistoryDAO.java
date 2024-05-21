package com.web.warnAPI.dao;

import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.sql.Time;
import java.util.ArrayList;
import java.util.List;

import com.web.warnAPI.model.History;

public class HistoryDAO extends DAO {

	private static final String SELECT_HISTORIES_BY_DATETIME = "SELECT *\r\n"
			+ "FROM tblHistory\r\n"
			+ "WHERE dateWarn = cast(? as date)\r\n"
			+ "AND startTime >= cast(? as time)\r\n"
			+ "AND endTime <= cast(? as time)\r\n"
			+ "ORDER BY startTime DESC;";
	private static final String INSERT_HISTORY = "INSERT INTO tblHistory VALUES (default, ?, ?, ?, ?, ?)";
	private static final String SELECT_ALL_HISTORIES = "SELECT * FROM tblHistory";
	
	public List<History> findHistoriesByTime(String date, String start, String end) {
		Connection connection = getConnection();
		PreparedStatement ps = null;
		ResultSet rs = null;
		List<History> histories = new ArrayList<History>();
		
		try {
			ps = connection.prepareStatement(SELECT_HISTORIES_BY_DATETIME);
			
			ps.setString(1, date);
			ps.setString(2, start);
			ps.setString(3, end);
			
            rs = ps.executeQuery();
            
			while (rs.next()) {
				int historyID = rs.getInt("historyID");
				String message = rs.getString("message");
				String typeWarn = rs.getString("typeWarn");
				Date dateWarn = rs.getDate("dateWarn");
				Time startTime = rs.getTime("startTime");
				Time endTime = rs.getTime("endTime");
				histories.add(new History(historyID, message, typeWarn, dateWarn, startTime, endTime));
			}
			
			connection.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return histories;
	}
	
	public boolean addNewHistory(History history) {
		Connection connection = getConnection();
		PreparedStatement ps = null;
		
		try {
			ps = connection.prepareStatement(INSERT_HISTORY);
			ps.setString(1, history.getMessage());
			ps.setString(2, history.getTypeWarn());
			ps.setDate(3, history.getDateWarn());
			ps.setTime(4, history.getStartTime());
			ps.setTime(5, history.getEndTime());
			ps.executeUpdate();
			connection.close();
			return true;
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return false;
	}
	
	public List<History> getAllHistories() {
		Connection connection = getConnection();
		Statement statement = null;
		ResultSet rs = null;
		List<History> histories = new ArrayList<History>();
		
		try {
			statement = connection.createStatement();
			rs = statement.executeQuery(SELECT_ALL_HISTORIES);
			while (rs.next()) {
				int historyID = rs.getInt("historyID");
				String message = rs.getString("message");
				String typeWarn = rs.getString("typeWarn");
				Date dateWarn = rs.getDate("dateWarn");
				Time starTime = rs.getTime("startTime");
				Time endTime = rs.getTime("endTime");
				histories.add(new History(historyID, message, typeWarn, dateWarn, starTime, endTime));
			}
			connection.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return histories;
	}
}
