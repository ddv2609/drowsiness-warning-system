package com.web.warnAPI.handler;

import java.io.ByteArrayInputStream;
import java.io.ObjectInputStream;
import java.nio.ByteBuffer;
import java.sql.Date;
import java.sql.Time;

import org.springframework.util.SerializationUtils;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.google.gson.Gson;
import com.web.warnAPI.dao.HistoryDAO;
import com.web.warnAPI.model.History;
import com.web.warnAPI.model.Warn;

public class WarnHandler extends TextWebSocketHandler{
	private static History history;
	private static final HistoryDAO historyDAO = new HistoryDAO();
	private static WebSocketSession clientSession;
	
	@Override
	public void handleMessage(WebSocketSession session, WebSocketMessage<?> message) throws Exception {
		if (message.getPayload().toString().compareToIgnoreCase("client-session") == 0) {
			clientSession = session;
		} else {
			System.out.println(message.getPayload());
//			ByteBuffer bb = (ByteBuffer)message.getPayload();
//			byte[] buf = new byte[bb.remaining()];
//			bb.get(buf);
//			ByteArrayInputStream bais = new ByteArrayInputStream(buf);
//			ObjectInputStream ois = new ObjectInputStream(bais);
//			Warn warn = (Warn)ois.readObject();
			Gson gson = new Gson();
			Warn warn = gson.fromJson(message.getPayload().toString(), Warn.class);

			String typeWarn = warn.getTypeWarn();
			if (typeWarn.compareToIgnoreCase("fnd") == 0 || typeWarn.compareToIgnoreCase("dw") == 0) {
				history = new History();
				history.setMessage(warn.getMessage());
				history.setTypeWarn(warn.getTypeWarn());
				history.setDateWarn(Date.valueOf(warn.getDateWarn()));
				history.setStartTime(Time.valueOf(warn.getTimeWarn()));
			} else {
				history.setEndTime(Time.valueOf(warn.getTimeWarn()));
				if (history.getMessage() != null) {
					historyDAO.addNewHistory(history);
				}
			}
			if (clientSession != null)
				clientSession.sendMessage(new TextMessage(typeWarn));
		}
	}
	
}