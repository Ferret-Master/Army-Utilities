//Only purpose is to relay time data to live_game
function SendArmyTime(){
	var CurrentTime = model.currentTimeInSeconds()
	//console.log("current time in time bar is "+CurrentTime)

	api.Panel.message(api.Panel.parentId, 'ArmyUtilTime',CurrentTime)
	setTimeout(SendArmyTime, 1000);
	return
	}
(function () {
    

    //update every second

    setTimeout(SendArmyTime, 1000);


})();
