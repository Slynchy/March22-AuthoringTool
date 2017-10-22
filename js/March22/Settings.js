var Settings = function()
{
    this.options = {};
}

Settings.types = {
    NONE : 0,
    CHECKBOX : 1,
    DROPDOWN : 2
}

Settings._createOption = function( props )
{
    var option = props;
    var options = option.options;

    switch(option.type)
    {
        case Settings.types.CHECKBOX:
            option.html = option.name + ': ' + '<input type="checkbox" onchange="" style="vertical-align:middle;"></input><br>';
        break;
        case Settings.types.DROPDOWN:
            option.html = option.name + ': ' +'<select selectedIndex=0 onchange="">';
            for (var i = 0; i < options.length; i++) {
                var optHTML = '<option value="'+ options[i] +'">'+ options[i] +'</option>';;
                option.html += optHTML;
            };
            option.html += '</select><br>';
        break;
        default:
        break;
    }

    return option;
}

Settings.options = {};
Settings._optionParams = {
    nop: { 
        name: "Test",
        type: Settings.types.DROPDOWN,
        options: [ "lots", "of", "options" ]
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
