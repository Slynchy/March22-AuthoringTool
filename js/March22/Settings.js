var Settings = function()
{
    this.options = {};
}

Settings.types = {
    NONE : 0,
    CHECKBOX : 1,
    DROPDOWN : 2
}

Settings.options = {};
Settings._optionParams = {
    funcNodeColour: { 
        name: "Function node colour",
        desc: "Changes the default colour of function nodes to something else.",
        type: Settings.types.DROPDOWN,
        selectedOption: -1,
        options: [ "Red", "Green", "Blue" ] // first is default
    },
    disableSortByHierarchy: { 
        name: "Disable sorting nodes by hierarchy",
        desc: "Disables sorting nodes in the map by hierarchy, allowing freedom to position nodes as desired",
        type: Settings.types.CHECKBOX,
        selectedOption: 0,
    },
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
    var setting = Settings._findSettingFromId(dom.id);
    if('selectedIndex' in dom)
    {
        console.log("You just changed id '%s' to %s", dom.id, dom.selectedIndex.toString());
        setting.selectedOption = dom.selectedIndex;
    }
    else if('checked' in dom)
    {
        console.log("You just changed id '%s' to %s", dom.id, dom.checked.toString());
        setting.selectedOption = dom.checked ? 1 : 0;
    }

    setting = Settings._createOptionHTML(setting);
}

Settings._createOptionHTML = function(option) 
{
    switch(option.type)
    {
        case Settings.types.CHECKBOX:
            option.html = '<span title="' + option.desc + '">' + option.name + ': </span>' + '<input type="checkbox" id="'+ option.id +'" onchange="Settings._onChange(this)" style="vertical-align:middle;"></input><br>';
        break;
        case Settings.types.DROPDOWN:
            option.html = '<span title="' + option.desc + '">' + option.name + ': </span>' +'<select selectedIndex=0 id="'+ option.id +'" onchange="Settings._onChange(this)">';
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

Settings.UpdateSettingsModal = function()
{
    for (var k in Settings.options) {
        if (Settings.options.hasOwnProperty(k)) {
            var element = document.getElementById(Settings.options[k].id);

            switch(Settings.options[k].type)
            {
                case Settings.types.CHECKBOX:
                    element.checked = Settings.options[k].selectedOption == 1 ? true : false;
                break;
                case Settings.types.DROPDOWN:
                    element.selectedIndex = Settings.options[k].selectedOption;
                break;
                default:
                break;
            }
        }
    }

    return;
}

Settings.CreateSettingsModal = function()
{
    this._createModal(
        function(){

        },
        function(){
            Settings.UpdateSettingsModal();
        }
    );
}
