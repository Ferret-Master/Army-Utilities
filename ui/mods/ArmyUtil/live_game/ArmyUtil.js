(function() {
	
	function doCommand(world, id, command, planetnumber){ 
	
		
		var two = !_.isArray(id);
				if (two){
						id = [id];
				}
				
        if (world){ 

            world.getUnitState(id).then(function (ready) {
				var unitData = this.result;
				var one = !_.isArray(unitData);
				if (one){
						unitData = [unitData];
				}
				
				for(var i = 0; i<unitData.length;i++){

					
						switch (command){
							
						case 'worldreclaim':
						
							if (unitData[i].hasOwnProperty('orders') !== true){
								
								api.getWorldView(0).sendOrder({units: id[i],command: 'reclaim',location: {planet: planetnumber,pos: [0,0,0] ,radius: 1000}})
								
								}
							break
						
						case 'worldmetal':
						
							if (unitData[i].hasOwnProperty('orders') !== true){
									
									api.getWorldView(0).sendOrder({units: id[i],command: 'build',location: {planet: planetnumber,pos: [0,0,0] ,radius: 1000},spec:'/pa/units/land/metal_extractor/metal_extractor.json'})
									
							}	
								break	
								
								
						case 'worldscout':
						
							var scout_points = 6 //too few and it will idle, too many it clutters the screen, 10 lets you at elast see the path so you can change it if needed
							if (unitData[i].hasOwnProperty('orders') !== true){
									
									for(var points = 0; points<scout_points;points++){// queuing up many random movement commands, move doesnt have the pausing of patrol
										var pos1 = Math.floor(Math.random() * 501); 
										var pos2 = Math.floor(Math.random() * 501);
										var pos3 = Math.floor(Math.random() * 501);
										var posArray = [pos1,pos2,pos3]
										for(var count = 0; count<3;count++){
											var sign = Math.floor(Math.random() * 11);
											
											if (sign > 4){posArray[count] = posArray[count]*-1}
											
											
										}
										
										
										api.getWorldView(0).sendOrder({units: id[i],command: 'move',location: {planet: planetnumber,pos: posArray},queue: true})
										
										
									}
									
									
							}	
								break	
									
							
						}
							
				}
				
				
				
				
				if (typeof unitData !== "undefined" ){ return unitData;}//returns the function to prevent it running forever
            });
        }
        else
		_.delay(doCommand, 1000);
		
	};
	
	//setting what will be options in settings menu in future
	var automationSetting;
	var autoMetalAir;
	var autoMetalVehicle;
	var autoMetalBot;
	var autoMetalNaval;
	var autoReclaim;
	var autoMetalToggle = false //ingame
	var autoReclaimToggle = false//ingame
	var autoScoutToggle = false //ingame
	var runCounter = 0;
	
	var numberOfSettings = 7
	var SettingsList = []
	var Settings = ['Automation','Auto_Metal_Air','Auto_Metal_Bot','Auto_Metal_Vehicle','Auto_Metal_Naval','Auto_Reclaim_Combat_Fab','Auto_Scout']
	for (var i = 0;i < numberOfSettings;i++) {
			SettingsList[i] = api.settings.isSet('ArmyUtilities', Settings[i], true)==undefined?false:api.settings.isSet('ArmyUtilities', Settings[i], true);
			
			if(SettingsList[i] === "ON"){SettingsList[i] = true;}
			//console.log(SettingsList[i]);
			
		}
	
	automationSetting = SettingsList[0]
	autoMetalAir = SettingsList[1]
	autoMetalVehicle = SettingsList[3]
	autoMetalBot = SettingsList[2]
	autoMetalNaval = SettingsList[4]
	autoReclaim = SettingsList[5]
	autoScout = SettingsList[6]
	
	
	var automation = function () { 
		var planetnum = model.planetListState().planets.length-1;
		if(planetnum <1){_.delay(automation, 5000);}
	//console.log("ran automation");
        var worldView = api.getWorldView(0);
		var armyindex = model.armyIndex();
		var PlayerArmys = [];
		if (typeof armyindex == "undefined"){
			
			armyindex = model.armyId()
		}
	
		PlayerArmys.push([]);
		
			
	
			for(var planetid = 0;planetid<planetnum;planetid++){
				
				
				PlayerArmys[0][planetid] = worldView.getArmyUnits(armyindex,planetid);
				
			}
			
		Promise.all(PlayerArmys.map(Promise.all, Promise)).then(function (ready){
        if (worldView && automationSetting === true) {
			

			for(var i = 0; i<planetnum;i++){
				
            
				var army = ready
				//	console.log(ready)
				army = army[0][i]
				
				if(army.hasOwnProperty('/pa/units/air/air_scout/air_scout.json')&& autoScout && autoScoutToggle === true){
				doCommand(worldView, army['/pa/units/air/air_scout/air_scout.json'], 'worldscout',i)
				}
				
				if(army.hasOwnProperty('/pa/units/air/fabrication_aircraft/fabrication_aircraft.json') && autoMetalAir === true && autoMetalToggle === true){
				doCommand(worldView, army['/pa/units/air/fabrication_aircraft/fabrication_aircraft.json'], 'worldmetal',i)
				}
				if(army.hasOwnProperty('/pa/units/land/fabrication_bot/fabrication_bot.json') && autoMetalBot === true && autoMetalToggle === true){
				doCommand(worldView, army['/pa/units/land/fabrication_bot/fabrication_bot.json'], 'worldmetal',i)
				}
				if(army.hasOwnProperty('/pa/units/land/fabrication_vehicle/fabrication_vehicle.json') && autoMetalVehicle === true && autoMetalToggle === true){
				doCommand(worldView, army['/pa/units/land/fabrication_vehicle/fabrication_vehicle.json'], 'worldmetal',i)
				}
				if(army.hasOwnProperty('/pa/units/sea/fabrication_ship/fabrication_ship.json') && autoMetalAir === true && autoMetalToggle === true){
				doCommand(worldView, army['/pa/units/sea/fabrication_ship/fabrication_ship.json'], 'worldmetal',i)
				}
				if(army.hasOwnProperty('/pa/units/land/fabrication_bot_combat/fabrication_bot_combat.json') && autoReclaim === true && autoReclaimToggle === true){
				doCommand(worldView, army['/pa/units/land/fabrication_bot_combat/fabrication_bot_combat.json'], 'worldreclaim',i)
				}
                
			
		}
		_.delay(automation, 5000); // effectivly acts as a loop, this is the time between loops
        }
        else
			_.delay(automation, 5000);
		}).catch(function (error) {
			var reference_error = true; //just something to put in here
		});
    };
	
	handlers.Metal_bar = function(payload) {
    
        if(payload === 'false')
            autoMetalToggle = false;
        else if(payload === 'true')
            autoMetalToggle = true;
		
		
		console.log("Auto metal toggled " +autoMetalToggle)
    };
	handlers.Reclaim_bar = function(payload) {
       
        if(payload === 'false')
            autoReclaimToggle = false;
        else if(payload === 'true')
            autoReclaimToggle = true;
		

		console.log("Auto reclaim toggled "+ autoReclaimToggle)
    };
	handlers.Scout_bar = function(payload) {
       
        if(payload === 'false')
            autoScoutToggle = false;
        else if(payload === 'true')
            autoScoutToggle = true;
		

		console.log("Auto scout toggled "+ autoScoutToggle)
    };
	console.log("got past handlers");
    automation();
	
				
})();