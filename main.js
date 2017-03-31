
var nodes = null;
var edges = null;
var network = null;
var scriptFileInput = document.getElementById("fileItem");
var scriptFiles = [];

// scriptmusic/scriptBG/scriptSFX = { filename, positionsOfUse{ nodeid, pos } }
// checkpoints = { name, pos }
// links = { name, scriptfile_linked, pos }
// nodes = { pos, text, compiled_lines }
	// compiled_lines = { linetype, params, params_txt, lineContents, ID } 

var LINETYPE = {
	NARRATIVE : -1,
	NEW_PAGE : 1,
	NONE : 2,
	DRAW_BACKGROUND : 3,
	PLAY_MUSIC : 4,
	PLAY_STING : 5,
	CHECKPOINT : 6,
	COMMENT : 7,
	SET_ACTIVE_TRANSITION : 8
}

// from: http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
String.prototype.hashCode = function(){
	var hash = 0;
	if (this.length == 0) return hash;
	for (i = 0; i < this.length; i++) {
		char = this.charCodeAt(i);
		hash = ((hash<<5)-hash)+char;
		hash = hash & hash; // Convert to 32bit integer
	}
	return hash;
}

var FunctionNames = [
	"thIsIssNarraTIVE", //<- This should never be returned!
	"NewPage",
	"ABSOLUTELYNOTHINGIGNORETHIS!!!", // Nor this!
	"DrawBackground",
	"PlayMusic",
	"PlaySting",
	"--",
	"//", // Nor this, but is set up to handle it
	"SetActiveTransition"
];
var FunctionHashes = [];
for (var n = 0, len = FunctionNames.length; n < len; n++) 
{
	FunctionHashes.push(FunctionNames[n].hashCode());
}

function CheckLineType(_keyword)
{
	return FunctionHashes.indexOf(_keyword.hashCode());
}

// returns object of nod
function CompileScript(_scriptStr)
{
	var result = {};
	result.checkpoints = [];
	result.backgrounds = [];
	result.sfx = [];
	result.music = [];
	result.nodes = [];
	result.__scriptCompiled__ = [];
	
	// Split the string into array of lines
	var tempArray = _scriptStr.split("\n");
	for (var n = 0, len = tempArray.length; n < len; n++) 
	{
		tempArray[n] = tempArray[n].trim();
		// If empty line, remove
		if(tempArray[n].length <= 1 || (tempArray[n][0] == "/" && tempArray[n][1] == "/"))	
		{
			tempArray.splice(n, 1);
			n--;
			len = tempArray.length;
		}
	}
	
	for (var n = 0, len = tempArray.length; n < len; n++) 
	{
		var CURRENT_LINE_SPLIT = tempArray[n].split(" ");
		CURRENT_LINE_SPLIT[0] = CURRENT_LINE_SPLIT[0].trim();
		var tempLine_c = { 
			linetype: LINETYPE.NONE,
			params: [],
			params_txt: [],
			lineContents: "",
			ID: 0
		};
		tempLine_c.linetype = CheckLineType(CURRENT_LINE_SPLIT[0]);

		if (tempLine_c.linetype == LINETYPE.NARRATIVE)
		{
			tempLine_c.lineContents = tempArray[n];
		}
		else
		{
			//Compile line
		}
		result.__scriptCompiled__.push(tempLine_c);
	}
	
	return result;
}

function HandleFiles()
{
	console.log(scriptFileInput.files);
	
	nodes = [];
	for(i = 0; i < scriptFileInput.files.length; i++)
	{
		var reader = new FileReader();
		var textFile = scriptFileInput.files[i];
		reader.onload = function(e) {
			nodes.push({
				id: i,
				label: textFile.name
			});
			edges = [];
			
			scriptFiles.push(CompileScript(e.target.result));
			
			draw();
		};
		reader.readAsText(textFile);
	}
	
	
}

function destroy() {
	if (network !== null) {
		network.destroy();
		network = null;
	}
}

function draw() {
	destroy();
	
	var data = {
		edges: edges,
		nodes: nodes
	}

	// create a network
	var container = document.getElementById('mynetwork');
	var options = {
		layout: {
			hierarchical: {
				enabled: true,
				sortMethod: "directed",
				direction: "UD",
				edgeMinimization: false,
				blockShifting: false
			}
		},
		physics: {
			enabled: false
		}
	};
	network = new vis.Network(container, data, options);

	// add event listeners
	network.on('select', function (params) {
		//console.log(nodes[parseInt(params.nodes[0])-1].script);
	});
}