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

	var autoMetalAir;
	var autoMetalVehicle;
	var autoMetalBot;
	var autoMetalNaval;
	var autoReclaim;
	var autoMetalToggle = false //ingame
	var autoReclaimToggle = false//ingame
	var autoScoutToggle = false //ingame

	

	var t1metal = 0;
	var t1power = 0;
	var t2metal = 0;
	var t2power = 0;

	model.t1metal = ko.observable(0);
	model.t2metal = ko.observable(0);
	model.t1power = ko.observable(0);
	model.t2power = ko.observable(0);
	model.armyCount = ko.observable(0);
	model.fabCount = ko.observable(0);
	model.facCount = ko.observable(0);
	model.TimeSinceLanding = ko.observable(0);
	model.RealTimeSinceLanding = ko.observable(0);


	var numberOfSettings = 6
	var SettingsList = []
	var Settings = ['Auto_Metal_Air','Auto_Metal_Bot','Auto_Metal_Vehicle','Auto_Metal_Naval','Auto_Reclaim_Combat_Fab','Auto_Scout']
	for (var i = 0;i < numberOfSettings;i++) {
			SettingsList[i] = api.settings.isSet('ArmyUtilities', Settings[i], true)==undefined?false:api.settings.isSet('ArmyUtilities', Settings[i], true);
			
			if(SettingsList[i] === "ON"){SettingsList[i] = true;}
		
			
		}
	
	
	autoMetalAir = SettingsList[1]
	autoMetalVehicle = SettingsList[3]
	autoMetalBot = SettingsList[2]
	autoMetalNaval = SettingsList[4]
	autoReclaim = SettingsList[5]
	autoScout = SettingsList[6]
	
	var landTime = 200000;
	var automation = function () { 
		var planetnum = model.planetListState().planets.length-1;
		if(planetnum <1){_.delay(automation, 5000);}
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
        if (worldView) {
			
			

			t1metal = 0;
			t1power = 0;
			t2metal = 0;
			t2power = 0;

			armyCount = 0;
			fabCount = 0;
			facCount = 0;

			TimeSinceLanding = 0;
			if(model.maxEnergy() > 0){if(model.TimeSinceLanding<landTime && model.TimeSinceLanding !== 0){landTime = model.TimeSinceLanding}}
			
			for(var i = 0; i<planetnum;i++){
				
				
				var army = ready
	
				army = army[0][i]
				armyKeys = _.keys(army)
				for(var j = 0;j<armyKeys.length;j++){
					var temp = model.unitSpecs[armyKeys[j]];
					if(_.contains(temp.types,"UNITTYPE_Mobile") && _.contains(temp.commands,"Attack")){armyCount += army[armyKeys[j]].length}
					if(_.contains(temp.types,"UNITTYPE_Fabber")){fabCount += army[armyKeys[j]].length}
					if(_.contains(temp.types,"UNITTYPE_Factory")){facCount += army[armyKeys[j]].length}


				}

				if(army.hasOwnProperty('/pa/units/land/metal_extractor/metal_extractor.json')){
					t1metal += army['/pa/units/land/metal_extractor/metal_extractor.json'].length;
					}
				if(army.hasOwnProperty('/pa/units/land/energy_plant/energy_plant.json')){
						t1power += army['/pa/units/land/energy_plant/energy_plant.json'].length;
					}
				if(army.hasOwnProperty('/pa/units/land/metal_extractor_adv/metal_extractor_adv.json')){
					t2metal += army['/pa/units/land/metal_extractor_adv/metal_extractor_adv.json'].length;
					}
				if(army.hasOwnProperty('/pa/units/land/energy_plant_adv/energy_plant_adv.json')){
						t2power += army['/pa/units/land/energy_plant_adv/energy_plant_adv.json'].length;
					}			
					
			

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
		model.t1metal(t1metal);
		model.t1power(t1power);
		model.t2metal(t2metal);
		model.t2power(t2power);

		model.armyCount(armyCount);
		model.fabCount(fabCount);
		model.facCount(facCount);

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
	handlers.ArmyUtilTime = function(payload) {
		console.log("time handler called with "+ payload)
		model.TimeSinceLanding = payload;
		if(landTime != 200000){

			var realtime = model.TimeSinceLanding - landTime;
			model.RealTimeSinceLanding(realtime);
		}
		
		 };
    automation();
	
				
})();
