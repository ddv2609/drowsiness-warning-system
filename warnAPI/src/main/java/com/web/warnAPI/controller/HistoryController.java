package com.web.warnAPI.controller;

import java.sql.Time;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.web.warnAPI.dao.HistoryDAO;
import com.web.warnAPI.model.History;

@CrossOrigin(origins= {"*"}, maxAge = 4800, allowCredentials = "false" )
@RestController
public class HistoryController {

	private HistoryDAO historyDAO = new HistoryDAO();
	
	private String standardizeDate(String date) {
		String newDate = date.replace('/', '-');
		String[] parts = newDate.split("-");
		return parts[2] + "-" + parts[1] + "-" + parts[0];
	}
	
	@GetMapping("/histories")
	public List<History> getHistoriesByDateTime(@RequestParam(value = "date", required = true) String date,
            @RequestParam(value = "start", required = true) String start,
            @RequestParam(value = "end", required = true) String end) {
		return historyDAO.findHistoriesByTime(standardizeDate(date), 
				Time.valueOf(start).toString(), 
				Time.valueOf(end).toString());
	}
	
	@RequestMapping(value="/histories/add-history", method=RequestMethod.POST)
	public ResponseEntity<?> AddHistory(@RequestBody History history) {
		boolean isSuccess = historyDAO.addNewHistory(history);
		
		return isSuccess ? ResponseEntity.ok().build() : ResponseEntity.badRequest().build();
	}
	
	@GetMapping("/all-histories")
	public List<Map<String, Object>> getAllHistories() throws ParseException {
		List<Map<String, Object>> fndFreqs = new ArrayList<Map<String,Object>>();
		
		List<Map<String, Object>> dwFreqs = new ArrayList<Map<String,Object>>();
		
		for (int hour = 0; hour < 24; hour++) {
            for (int minute = 0; minute < 60; minute++) {
                Time time = Time.valueOf(String.format("%02d:%02d:00", hour, minute));
				
				Map<String, Object> dw = new HashMap<>();
				dw.put("category", "Ngủ gật");
				dw.put("typeWarn", "dw");
				dw.put("time", time);
				dw.put("freq", 0);
				dwFreqs.add(dw);
				
				Map<String, Object> fnd = new HashMap<>();
				fnd.put("category", "Không phát hiện mặt");
				fnd.put("typeWarn", "fnd");
				fnd.put("time", time);
				fnd.put("freq", 0);
				fndFreqs.add(fnd);
            }
        }
		
//		for (Map<String, Object> fnd : fndFreqs) {
//			System.out.println(fnd.get("time") + " " + fnd.get("freq"));
//		}
		
		List<History> histories = historyDAO.getAllHistories();
		
		for (History history : histories) {
			Time startTime = history.getStartTime();
			startTime = Time.valueOf(
					String.format("%02d:%02d:00", startTime.getHours(), 
							startTime.getHours() > 29 ? startTime.getMinutes() + 1 : startTime.getMinutes())
					);
			Time endTime = history.getEndTime();
			endTime = Time.valueOf(
					String.format("%02d:%02d:00", endTime.getHours(), 
							endTime.getSeconds() > 29 ? endTime.getMinutes() + 1 : endTime.getMinutes())
					);
			if (history.getTypeWarn().equals("dw")) {
				for (Map<String, Object> freq : dwFreqs) {
					Time current = (Time) freq.get("time");
					
					if (current.compareTo(startTime) >= 0 && current.compareTo(endTime) <= 0) {
//						System.out.println("dw add " + current + " S: " + startTime + " E: " + endTime);
						freq.put("freq", (int) freq.get("freq") + 1);
					}
				}
			} else {
				for (Map<String, Object> freq : fndFreqs) {
					Time current = (Time) freq.get("time");
					
					if (current.compareTo(startTime) >= 0 && current.compareTo(endTime) <= 0) {
//						System.out.println("fnd add " + current + " S: " + startTime + " E:" + endTime);
						freq.put("freq", (int) freq.get("freq") + 1);
					}
				}
			}
		}
		
		ArrayList<Map<String, Object>> frequences = new ArrayList<>();
		frequences.addAll(dwFreqs);
		frequences.addAll(fndFreqs);
		
		return frequences;
	}
	
}
