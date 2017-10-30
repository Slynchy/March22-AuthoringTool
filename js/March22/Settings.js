var Settings = function()
{
    this.options = {};
}

Settings.types = {
    NONE : 0,
    CHECKBOX : 1,
    DROPDOWN : 2
}

Settings._findSettingFromId = function(id)
{
    for (var k in Settings.options) {
        if (Settings.options.hasOwnProperty(k)) {
            var element = Settings.options[k];
            var eId = element.name + "_SETTINGS";
            if(eId === id)
                return Settings.options[k];
        }
    }
}

Settings._onChange = function (dom) 
{
    console.log("You just changed id '%s' to %i", dom.id,dom.selectedIndex);

    var setting = Settings._findSettingFromId(dom.id);
    setting.selectedOption = dom.selectedIndex;
    setting = Settings._createOptionHTML(setting);
}

Settings._createOptionHTML = function(option) 
{
    switch(option.type)
    {
        case Settings.types.CHECKBOX:
            option.html = option.name + ': ' + '<input type="checkbox" id="'+ option.id +'" onchange="Settings._onChange(this)" style="vertical-align:middle;"></input><br>';
        break;
        case Settings.types.DROPDOWN:
            option.html = option.name + ': ' +'<select selectedIndex=0 id="'+ option.id +'" onchange="Settings._onChange(this)">';
            for (var i = 0; i < option.options.length; i++) {
                var optHTML = '<option value="'+ option.options[i] +'">'+ option.options[i] +'</option>';;
                option.html += optHTML;
            };
            option.html += '</select><br>';
        break;
        default:
        break;
    }

    return option;
}

Settings._createOption = function( props )
{
    var option = props;
    var options = option.options;
    
    option.id = (option.name + '_SETTINGS');
    option.selectedOption = 0; // non-zero for checkboxes == true, otherwise is index for selected option

    option = Settings._createOptionHTML(option);

    return option;
}

Settings.options = {};
Settings._optionParams = {
    funcNodeColour: { 
        name: "Function node colour",
        type: Settings.types.DROPDOWN,
        selectedOption: -1,
        options: [ "Red", "Green", "Blue" ] // first is default
    },
}
for (var k in Settings._optionParams) {
    if (Settings._optionParams.hasOwnProperty(k)) {
        Settings.options[k] = Settings._createOption(Settings._optionParams[k]);
    }
}

Settings._createModal = function(callback,createCallback)
{
	var list = '';
	for (var key in Settings.options) {
		if (Settings.options.hasOwnProperty(key)) {
            list += Settings.options[key].html;
		}
	}
	ModalManager.createModal('<center>'+list+'</center>',callback,createCallback);
}

Settings.CreateSettingsModal = function()
{
    this._createModal(function(){}, function(){});
}
