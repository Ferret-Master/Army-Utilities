(function() {


    var buildingBlacklist = ["/pa/units/air/air_factory/air_factory.json", "/pa/units/air/air_factory_adv/air_factory_adv.json", "/pa/units/land/air_defense/air_defense.json", "/pa/units/land/air_defense_adv/air_defense_adv.json", "/pa/units/land/anti_nuke_launcher/anti_nuke_launcher.json", "/pa/units/land/artillery_long/artillery_long.json", "/pa/units/land/artillery_short/artillery_short.json","/pa/units/land/bot_factory/bot_factory.json", "/pa/units/land/bot_factory_adv/bot_factory_adv.json", "/pa/units/land/control_module/control_module.json", "/pa/units/land/energy_plant/energy_plant.json", "/pa/units/land/energy_plant_adv/energy_plant_adv.json", "/pa/units/land/energy_storage/energy_storage.json", "/pa/units/land/land_barrier/land_barrier.json", "/pa/units/land/laser_defense/laser_defense.json", "/pa/units/land/laser_defense_adv/laser_defense_adv.json", "/pa/units/land/laser_defense_single/laser_defense_single.json", "/pa/units/land/metal_extractor/metal_extractor.json", "/pa/units/land/metal_extractor_adv/metal_extractor_adv.json", "/pa/units/land/metal_storage/metal_storage.json", "/pa/units/land/nuke_launcher/nuke_launcher.json", "/pa/units/land/radar/radar.json", "/pa/units/land/radar_adv/radar_adv.json", "/pa/units/land/tactical_missile_launcher/tactical_missile_launcher.json","/pa/units/land/teleporter/teleporter.json", "/pa/units/land/unit_cannon/unit_cannon.json", "/pa/units/land/vehicle_factory/vehicle_factory.json", "/pa/units/land/vehicle_factory_adv/vehicle_factory_adv.json", "/pa/units/orbital/deep_space_radar/deep_space_radar.json", "/pa/units/orbital/defense_satellite/defense_satellite.json", "/pa/units/orbital/delta_v_engine/delta_v_engine.json", "/pa/units/orbital/ion_defense/ion_defense.json", "/pa/units/orbital/mining_platform/mining_platform.json", "/pa/units/orbital/orbital_fabrication_bot/orbital_fabrication_bot.json", "/pa/units/orbital/orbital_factory/orbital_factory.json", "/pa/units/orbital/orbital_fighter/orbital_fighter.json", "/pa/units/orbital/orbital_lander/orbital_lander.json", "/pa/units/orbital/orbital_laser/orbital_laser.json", "/pa/units/orbital/orbital_launcher/orbital_launcher.json", "/pa/units/orbital/radar_satellite/radar_satellite.json", "/pa/units/orbital/radar_satellite_adv/radar_satellite_adv.json", "/pa/units/orbital/solar_array/solar_array.json", "/pa/units/sea/naval_factory/naval_factory.json", "/pa/units/sea/naval_factory_adv/naval_factory_adv.json","/pa/units/sea/torpedo_launcher/torpedo_launcher.json", "/pa/units/sea/torpedo_launcher_adv/torpedo_launcher_adv.json", "/pa/units/land/artillery_unit_launcher/artillery_unit_launcher.json", "/pa/units/land/titan_structure/titan_structure.json","/pa/units/orbital/orbital_battleship/orbital_battleship.json", "/pa/units/orbital/orbital_carrier/orbital_carrier.json", "/pa/units/orbital/orbital_probe/orbital_probe.json", "/pa/units/orbital/orbital_railgun/orbital_railgun.json", "/pa/units/orbital/titan_orbital/titan_orbital.json", "/pa/units/sea/drone_carrier/drone/drone.json"]


    function doCommand(world,Planet, id,ghostColor){ 
      
		var two = !_.isArray(id);
				if (two){
						id = [id];
				}
			
        if (world){ 
	
            world.getUnitState(id).then(function (ready) {
   
				var unitData = ready;
				var one = !_.isArray(unitData);
				if (one){
						unitData = [unitData];
				}
				
				for(var i = 0; i<unitData.length;i++){ 

                     var unitSpec = unitData[i].unit_spec
                
                     unitSpec = unitSpec.replace("json","papa")

                        
                        var puppetOrient = unitData[i].orient
                        
                        world.puppet([{

                            "model": {"filename": unitSpec},
                            
                            "location": {"planet":Planet,"pos": unitData[i].pos,"orient": puppetOrient,"scale": 1 ,"orient_rel": false}, 
                            
                            "material": {
                                            "shader": "pa_unit_ghost",   
                                            "constants": {
                                               "GhostColor": ghostColor, 
                                               "BuildInfo": [0,0,0,0]
                                           },
                                           "textures": {
                                              "Diffuse": "/pa/effects/diffuse.papa"     
                                           }
                                       }
                            
                            
                            }])
							
						}
							

				if (typeof unitData !== "undefined" ){ return unitData;}
            });
        }
        else
            _.delay(doCommand, 1000);
		
	}

var worldView = api.getWorldView(0);
var Ghost_Toggle = true //ingame

var counter = 0;
	var UnitGhosts = function () { 
	
        
        console.log(Ghost_Toggle+" "+ Unit_Ghosts)

        if(Ghost_Toggle === true && Unit_Ghosts === "ON"){//checks that the player wants ghost on


		var playerindex = model.armyIndex();
		if (typeof playerindex == "undefined"){
			
			playerindex = model.armyId();
		}
        var playercount = model.armyCount();
        
        var PlayerArmys = [];
        
        var planetnum = model.planetListState().planets.length-1;
        
		for(var playerid = 0;playerid<playercount;playerid++){
			PlayerArmys.push([]);
	
			for(var planetid = 0;planetid<planetnum;planetid++){
				
				PlayerArmys[playerid][planetid] = worldView.getArmyUnits(playerid,planetid);
				
			}
		
			
		}
		
		Promise.all(PlayerArmys.map(Promise.all, Promise)).then(function (ready){
			
		
			if (worldView) {
                counter++
			
				var allArmies = ready ;
				for (var i = 0;i<playercount;i++){
                    if(model.players()[i].stateToPlayer ==="hostile"){

                        var ghostColor = model.players()[i].primary_color

                        ghostColor.push(0.99)

                for(var j = 0;j<planetnum;j++){

             
                    var armySpecs = _.keys(allArmies[i][j])

                    armySpecs = _.difference(armySpecs, buildingBlacklist)
                    
                    for(var h = 0;h<armySpecs.length;h++){
                        
                        if(allArmies[i][j].hasOwnProperty(armySpecs[h])){
                            
                        doCommand(worldView,j,allArmies[i][j][armySpecs[h]],ghostColor);
                        
                        console.log(counter)
                        if (counter >2){
                            
                            worldView.clearPuppets()
                            counter = 0

                        }
                    }

                    }
                }
                }

				}
    
          
        }
		 else
            _.delay(UnitGhosts, 3000);
			
		}).catch(function (error) {
				console.log("Promise Rejected with : "+ error);
			});
		
        
       _.delay(UnitGhosts, 3000);
        }
        else{_.delay(UnitGhosts, 3000);}
    };
	Unit_Ghosts = api.settings.isSet('ArmyUtilities', 'Unit_Ghosts', true)==undefined?false:api.settings.isSet('ArmyUtilities', 'Unit_Ghosts', true);
    console.log("running UnitGhosts")
    UnitGhosts();//starting main loop
    handlers.Ghost_bar = function(payload) {
        
        if(payload === 'false'){
           Ghost_Toggle = false;
           api.getWorldView(0).clearPuppets();}
        else if(payload === 'true')
           Ghost_Toggle = true;
		

		console.log("Unit Ghosts toggled "+ Ghost_Toggle)
    };

})();
