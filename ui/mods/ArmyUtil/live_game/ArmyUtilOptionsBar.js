var Reclaim_bar = (function () {
		console.log("reclaim bar set")
		var Reclaim_bar = {};
		Reclaim_bar.active = ko.observable(true);

	    return Reclaim_bar;
})();
var Metal_bar = (function () {
		console.log("metal bar set")
		var Metal_bar = {};
		Metal_bar.active = ko.observable(true);

	    return Metal_bar;
})();
var Scout_bar = (function () {
		console.log("Scout bar set")
		var Scout_bar = {};
		Scout_bar.active = ko.observable(true);

	    return Scout_bar;
})();

var Ghost_bar = (function () {
	console.log("Ghost bar set")
	var Ghost_bar = {};
	Ghost_bar.active = ko.observable(true);

	return Ghost_bar;
})();

(function () {
    "use strict";
	console.log("made it here")
    

    //visible to knockout
    model.Reclaim_bar = Reclaim_bar;
	model.Metal_bar = Metal_bar;
	model.Scout_bar = Scout_bar;
	model.Ghost_bar = Ghost_bar;

    //add toggle to live_game bottom bar
	$(".div_ingame_options_bar_cont").prepend("<div class=\"btn_ingame_options div_metal_bar_cont\"><a href=\"#\" data-bind=\"click: function () { Metal_bar.active(!Metal_bar.active()); api.Panel.message(api.Panel.parentId, 'Metal_bar', Metal_bar.active()?'false':'true'); }\"><!-- ko if: Metal_bar.active() --><img src=\"coui://ui/mods/ArmyUtil/live_game/autometaloff.png\" /><!-- /ko --><!-- ko ifnot: Metal_bar.active() --><img src=\"coui://ui/mods/ArmyUtil/live_game/autometal.png\" /><!-- /ko --></a></div>");
	
	$(".div_ingame_options_bar_cont").prepend("<div class=\"btn_ingame_options div_Reclaim_bar_cont\"><a href=\"#\" data-bind=\"click: function () { Reclaim_bar.active(!Reclaim_bar.active()); api.Panel.message(api.Panel.parentId, 'Reclaim_bar', Reclaim_bar.active()?'false':'true'); }\"><!-- ko if: Reclaim_bar.active() --><img src=\"coui://ui/mods/ArmyUtil/live_game/autoreclaimoff.png\" /><!-- /ko --><!-- ko ifnot: Reclaim_bar.active() --><img src=\"coui://ui/mods/ArmyUtil/live_game/autoreclaim.png\" /><!-- /ko --></a></div>");
	
	$(".div_ingame_options_bar_cont").prepend("<div class=\"btn_ingame_options div_Scout_bar_cont\"><a href=\"#\" data-bind=\"click: function () { Scout_bar.active(!Scout_bar.active()); api.Panel.message(api.Panel.parentId, 'Scout_bar', Scout_bar.active()?'false':'true'); }\"><!-- ko if: Scout_bar.active() --><img src=\"coui://ui/mods/ArmyUtil/live_game/autoscoutoff.png\" /><!-- /ko --><!-- ko ifnot: Scout_bar.active() --><img src=\"coui://ui/mods/ArmyUtil/live_game/autoscout.png\" /><!-- /ko --></a></div>");

	$(".div_ingame_options_bar_cont").prepend("<div class=\"btn_ingame_options div_Ghost_bar_cont\"><a href=\"#\" data-bind=\"click: function () { Ghost_bar.active(!Ghost_bar.active()); api.Panel.message(api.Panel.parentId, 'Ghost_bar', Ghost_bar.active()?'true':'false'); }\"><!-- ko if: Ghost_bar.active() --><img src=\"coui://ui/mods/ArmyUtil/live_game/Ghost.png\" /><!-- /ko --><!-- ko ifnot: Ghost_bar.active() --><img src=\"coui://ui/mods/ArmyUtil/live_game/Ghostoff.png\" /><!-- /ko --></a></div>");

})();