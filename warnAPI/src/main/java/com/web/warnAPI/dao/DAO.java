package com.web.warnAPI.dao;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DAO {
	
	private String jdbcURL = "jdbc:mysql://localhost:3306/drowsiness_warning";
	private String jdbcUsername = "root";
	private String jdbcPassword = "a@#S2K(1O!&t4";
	
	protected Connection getConnection() {
		Connection connection = null;
		
		try {
			Class.forName("com.mysql.cj.jdbc.Driver");
			connection = DriverManager.getConnection(jdbcURL, jdbcUsername, jdbcPassword);
		} catch (SQLException e) {
			e.printStackTrace();
		}
		catch (ClassNotFoundException e) {
			e.printStackTrace();
		}
		
		return connection;
	}
	
}
