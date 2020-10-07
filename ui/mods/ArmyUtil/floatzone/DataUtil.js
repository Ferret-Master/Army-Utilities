(function() {
	createFloatingFrame("data_util_frame", 240, 50, {"offset": "topRight", "left": -240});
	
	model.enemyMetalDestroyed = ko.observable(0);
	model.metalLost = ko.observable(0);
	model.t1metal = ko.observable(0);
	model.t2metal = ko.observable(0);
	model.t1power = ko.observable(0);
	model.t2power = ko.observable(0);
	model.armyCount = ko.observable(0);
	model.fabCount = ko.observable(0);
	model.facCount = ko.observable(0);
	model.RealTimeSinceLanding = ko.observable(0);

	addLinkageLiveGame("model.enemyMetalDestroyed()", "model.enemyMetalDestroyed");
	addLinkageLiveGame("model.metalLost()", "model.metalLost");
	addLinkageLiveGame("model.t1metal()","model.t1metal");
	addLinkageLiveGame("model.t2metal()","model.t2metal");
	addLinkageLiveGame("model.t1power()","model.t1power");
	addLinkageLiveGame("model.t2power()","model.t2power");

	addLinkageLiveGame("model.armyCount()","model.armyCount");
	addLinkageLiveGame("model.fabCount()","model.fabCount");
	addLinkageLiveGame("model.facCount()","model.facCount");

	addLinkageLiveGame("model.RealTimeSinceLanding()","model.RealTimeSinceLanding");

	
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
	

	var oldTrade = metalTrade
	var recentmetalTrade = 0;
	var minutes = 3;
	var milMin = minutes*1000*60

	
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


	model.displayedMinute = ko.computed(function() {
		
		var displayedMinutesSinceLanding = Math.floor(model.RealTimeSinceLanding()/60)
		
		
		return displayedMinutesSinceLanding
	});

	model.displayedSecond = ko.computed(function() {
		var displayedSecondsSinceLanding = Math.round(model.RealTimeSinceLanding()%60);
		if(displayedSecondsSinceLanding < 10){displayedSecondsSinceLanding =  "0"+displayedSecondsSinceLanding}
		
		
		return displayedSecondsSinceLanding;
	});



function makeDiv(name,modelname){

	return "<div class=data_util_trade'>"+"<p style= color:DodgerBlue;font-weight: bold;font-size:200%;>" +name+"</p>"+"</div>" +
	"<div style=color:lime;>" +"<span data-bind='text: "+modelname+"' ></span>"+"</div>";											
							
}

	var nameList = ["recent metal trade","time since landing","fabricator count","army count","factory count","metal spots"];
	var varList = ['parseInt(model.recentTrade())','model.displayedMinute() + ":" + model.displayedSecond()','parseInt(model.fabCount())','parseInt(model.armyCount())','parseInt(model.facCount())','parseInt(model.t1metal())'];


var body = "";

for(var i = 0;i<nameList.length;i++){
	body += makeDiv(nameList[i],varList[i])
}



	$("#data_util_frame_content").append(
		"<div class='div_data_util_bar' data-bind=''>" +
			"<div class='div_data_util_bar_cont'>" +
				"<table>" +
					"<tbody>" +
						"<tr>" +
							"<td>" +
								body
									+
							"</td>" +
						"</tr>" +
					"</tbody>" +
				"</table>" +
				"<img id='data_util_lock' src='' data-bind='click: function() { model.dataUtilLockEvent(); }' class='lock_icon'/>" +
			"</div>" +
		"</div>");
	
	if (localStorage["frames_data_util_frame_lockStatus"] == "true") {
		$("#data_util_lock").attr("src", "coui://ui/mods/ArmyUtil/floatzone/lock-icon.png");
	} else  {
		$("#data_util_lock").attr("src", "coui://ui/mods/ArmyUtil/floatzone/unlock-icon.png");
	}
})();

model.dataUtilLockEvent = function() {
	if (localStorage["frames_data_util_frame_lockStatus"] == "true") {
		$("#data_util_lock").attr("src", "coui://ui/mods/ArmyUtil/floatzone/unlock-icon.png");
		unlockFrame("data_util_frame");
	} else  {
		$("#data_util_lock").attr("src", "coui://ui/mods/ArmyUtil/floatzone/lock-icon.png");
		lockFrame("data_util_frame");
	}
};
