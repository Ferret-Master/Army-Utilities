//todo add a decription of how to use settings menu
(function () {
    model.settingGroups().push("ArmyUtilities");
    model.settingDefinitions().ArmyUtilities = {title:"ArmyUtilities",settings:{}};

    $(".option-list.keyboard").parent().append(
        $.ajax({
            type: "GET",
            url: 'coui://ui/mods/ArmyUtil/settings/ArmyUtilSettings.html',
            async: false
        }).responseText
    );
    
   model.settingGroups.notifySubscribers();
	


	//the following section of code used wondibles connect buttons mod as reference so is fairly similar; credit to him for making nice scalable settings
	
  var numberOfSettings = 8
  var SettingsList = ['Automation','Auto_Metal_Air','Auto_Metal_Bot','Auto_Metal_Vehicle','Auto_Metal_Naval','Auto_Reclaim_Combat_Fab','Auto_Scout','Unit_Ghosts']
  var groups = []

  for (var i = 0;i < numberOfSettings;i=i+1) {
    api.settings.definitions.ArmyUtilities.settings[SettingsList[i]] = {
      title: (SettingsList[i]),
      type: 'select',
	  options: ['ON', 'OFF'],
	  default: 'OFF'
    }
  }
  



  
  model.settingDefinitions(api.settings.definitions)

  model.SettingsGroups = []
  for (var j = 0;j < numberOfSettings;j++) {
    model.SettingsGroups[j] = {parts: [
      model.settingsItemMap()['ArmyUtilities.' + SettingsList[j]],
      
      
    ]}
  }
  

  var settingsHtml = 
    '<div class="form-group" data-bind="foreach: SettingsGroups">' +
      '<div class="sub-group" data-bind="foreach: parts">' +
        '<div class="option">' +
          '<label data-bind="text: title" >' +
            'title' +
          '</label>' +
          '<!-- ko if: $data.type() === "select" -->' +
          '<select class="selectpicker form-control" name="dropdown"' +
              'data-bind="options: $data.options,' +
              'optionsValue: function (item) { return item.value },' +
              'optionsText: function (item) { return item.text },' +
              'selectPicker: $data.value,' +
              'attr: { disabled: !$data.isEnabled }">' +
          '</select>' +
          '<!-- /ko -->' +
        '</div>' + 
      '</div>' + 
    '</div>'
	
  var $group = $(settingsHtml).appendTo('.option-list.ArmyUtilities')

})();

