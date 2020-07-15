(function() {
	createFloatingFrame("data_util_frame", 240, 50, {"offset": "topRight", "left": -240});
	
	model.enemyMetalDestroyed = ko.observable(0);
	model.metalLost = ko.observable(0);
	addLinkageLiveGame("model.enemyMetalDestroyed()", "model.enemyMetalDestroyed");
	addLinkageLiveGame("model.metalLost()", "model.metalLost");
	
	model.commanderHealth = ko.observable(0);
	addLinkageLiveGame("model.commanderHealth()", "model.commanderHealth");
	model.commander_hp_DoPanic = ko.computed(function() {
		
		if (model.commanderHealth() <= .5) {
			return true;
		} else {
			return false;
		}
	});
	var metalTrade = model.enemyMetalDestroyed() - model.metalLost()
	
	//var PreviousTime = 2000000000000
	var oldTrade = metalTrade
	var recentmetalTrade = 0;
	var minutes = 3;
	var milMin = minutes*1000*60
	//if(Date.now()<landTime){landTime = Date.now();}
	
	function metalTradeOld(metaltradecurrent){
		
		oldTrade = metaltradecurrent
		
		
	}
	model.recentTrade = ko.computed(function() {
		metalTrade = model.enemyMetalDestroyed() - model.metalLost() 
		
		
		
		
		if (metalTrade < oldTrade){recentmetalTrade = metalTrade - oldTrade}
		if (metalTrade > oldTrade){recentmetalTrade = Math.abs(metalTrade - oldTrade)}
		_.delay(metalTradeOld, milMin, metalTrade);
		return recentmetalTrade
	});


/*




"<div class='data_util_select_opponent' data-bind='click: function() { api.select.commander(); api.camera.track(true); }'>" +
									"<img src='coui://ui/mods/ArmyUtil/floatzone/icon_si_commander.png'/>" +
									
								"</div>" +
								
								
								"<div class='status_bar_frame_commanderHP'>" +
										"<div class='status_bar_commanderHP' data-bind='style: {width: \"\" + (model.commanderHealth() * 158) + \"px\"}'></div>" +
									"</div>" +


*/
	$("#data_util_frame_content").append(
		"<div class='div_data_util_bar' data-bind=''>" +
			"<div class='div_data_util_bar_cont'>" +
				"<table>" +
					"<tbody>" +
						"<tr>" +
							"<td>" +
								"<div class=data_util_trade'>" +
										"<a> recent metal trade</a>" +
									"</div>" +
				
								"<div class='div_status_bar_display'>" +
									
									"<div class='status_stats'>" +
										"<span data-bind='text: parseInt(model.recentTrade())'></span>" +
									 
									"</div>" +
								"</div>" +
							"</td>" +
						"</tr>" +
					"</tbody>" +
				"</table>" +
				"<img id='commander_info_lock' src='' data-bind='click: function() { model.commanderFrameLockEvent(); }' class='lock_icon'/>" +
			"</div>" +
		"</div>");
	
	if (localStorage["frames_data_util_frame_lockStatus"] == "true") {
		$("#commander_info_lock").attr("src", "coui://ui/mods/ArmyUtil/floatzone/lock-icon.png");
	} else  {
		$("#commander_info_lock").attr("src", "coui://ui/mods/ArmyUtil/floatzone/unlock-icon.png");
	}
})();

model.commanderFrameLockEvent = function() {
	if (localStorage["frames_data_util_frame_lockStatus"] == "true") {
		$("#commander_info_lock").attr("src", "coui://ui/mods/ArmyUtil/floatzone/unlock-icon.png");
		unlockFrame("data_util_frame");
	} else  {
		$("#commander_info_lock").attr("src", "coui://ui/mods/ArmyUtil/floatzone/lock-icon.png");
		lockFrame("data_util_frame");
	}
};