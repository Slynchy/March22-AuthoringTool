
var nodes = null;
var edges = null;
var network = null;
var scriptFileInput = document.getElementById("fileItem");
var scriptFiles = [];

// scriptmusic/scriptBG/scriptSFX = { filename, positionsOfUse{ nodeid, pos } }
// checkpoints = { name, pos }
// links = { name, scriptfile_linked, pos }
// nodelinks = { from, to }
// nodes = { pos, text }
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
	SET_ACTIVE_TRANSITION: 8,
    M22IF: 9
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
	"SetActiveTransition",
    "m22IF"
];
var FunctionHashes = [];
for (var n = 0, len = FunctionNames.length; n < len; n++) 
{
	FunctionHashes.push(FunctionNames[n].hashCode());
}

function CheckLineType(_keyword)
{
    if (_keyword.length >= 3)
    {
        if(_keyword[0] == "-" && _keyword[0] == "-")
        {
            return LINETYPE.CHECKPOINT;
        }
    }
	return FunctionHashes.indexOf(_keyword.hashCode());
}

function FindLoadedAsset(name, myArray)
{
    for (var i=0; i < myArray.length; i++) 
    {
        if (myArray[i].filename === name) 
        {
            return myArray[i];
        }
    }
    return undefined;
}

function CompileLine(CURRENT_LINE_SPLIT, tempLine_c, result, nodeInfo, linePos)
{
    //Compile line
    switch (tempLine_c.linetype) {
        case LINETYPE.DRAW_BACKGROUND:
            tempLine_c.params_txt.push(CURRENT_LINE_SPLIT[1]);
            if (FindLoadedAsset(CURRENT_LINE_SPLIT[1], result.backgrounds) == undefined) {
                result.backgrounds.push(
                    {
                        filename: CURRENT_LINE_SPLIT[1],
                        positionsOfUse:
                        {
                            nodeid: (result.nodes.length),
                            pos: linePos
                        }
                    }
                );
            }
            break;
        case LINETYPE.SET_ACTIVE_TRANSITION:
            tempLine_c.params_txt.push(CURRENT_LINE_SPLIT[1]);
            break;
        case LINETYPE.NEW_PAGE:
            break;
        case LINETYPE.PLAY_MUSIC:
            tempLine_c.lineContents = (tempArray[linePos]);
            tempLine_c.params_txt.push(CURRENT_LINE_SPLIT[1]);
            if (FindLoadedAsset(CURRENT_LINE_SPLIT[1], result.music) == undefined) {
                result.music.push(
                    {
                        filename: CURRENT_LINE_SPLIT[1],
                        positionsOfUse:
                        {
                            nodeid: (result.nodes.length),
                            pos: linePos
                        }
                    }
                );
            }
            break;
        case LINETYPE.PLAY_STING:
            tempLine_c.params_txt.push(CURRENT_LINE_SPLIT[1]);
            if (FindLoadedAsset(CURRENT_LINE_SPLIT[1], result.sfx) == undefined) {
                result.sfx.push(
                    {
                        filename: CURRENT_LINE_SPLIT[1],
                        positionsOfUse:
                        {
                            nodeid: (result.nodes.length),
                            pos: linePos
                        }
                    }
                );
            }
            break;
        case LINETYPE.M22IF:
            var paramlinetype = CheckLineType(CURRENT_LINE_SPLIT[3]);
            result.nodes.push({ text: nodeInfo.currentNodeTxt, pos: linePos });
            result.nodelinks.push({ from: nodeInfo.currentNode, to: ++nodeInfo.currentNode });
            result.ifStatements.push({ checkpoint: CURRENT_LINE_SPLIT[4], pos: linePos, node: (nodeInfo.currentNode-1) });
            nodeInfo.currentNodeTxt = "";
            break;
    }
}

function CompileNode(_scriptStr, _scriptStrPos, result)
{
    // this function compiles script lines until it reaches an IF statement or a checkpoint
    
    // returns the new script str pos
}

// returns object of node
function CompileScript(_scriptStr)
{
	var result = {};
	result.checkpoints = [];
	result.backgrounds = [];
	result.sfx = [];
	result.music = [];
	result.nodes = [];
	result.nodelinks = [];
	result.ifStatements = []; // { checkpoint to jump to, pos, node }
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
	
	var nodeInfo = { currentNodeTxt: "", currentNode: 0 };
	var n = 0;
	for (n, len = tempArray.length; n < len; n++) 
	{
	    var CURRENT_LINE_SPLIT = tempArray[n].split(" ");
	    for (var i = 0; i < CURRENT_LINE_SPLIT.length; i++)
	    {
	        CURRENT_LINE_SPLIT[i] = CURRENT_LINE_SPLIT[i].trim();
	    }
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
		else if (tempLine_c.linetype == LINETYPE.CHECKPOINT)
		{
		    tempLine_c.params_txt = tempArray[n].substring(2);
		    result.checkpoints.push({ name: tempLine_c.params_txt, pos: n, node: (nodeInfo.currentNode+1) });
		    result.nodes.push({ text: nodeInfo.currentNodeTxt, pos: n });
		    result.nodelinks.push({ from: nodeInfo.currentNode, to: ++nodeInfo.currentNode });
		    nodeInfo.currentNodeTxt = "";
		}
		else
		{
		    CompileLine(CURRENT_LINE_SPLIT, tempLine_c, result, nodeInfo, n);
		}
		nodeInfo.currentNodeTxt += tempArray[n] + "\n\n";
		result.__scriptCompiled__.push(tempLine_c);
	}
	result.nodes.push({ text: nodeInfo.currentNodeTxt, pos: n });
	result.nodelinks.push({ from: nodeInfo.currentNode, to: ++nodeInfo.currentNode });

	for (var i = 0; i < result.ifStatements.length; i++) 
	{
	    var tempLink = {
	        from: result.ifStatements[i].node,
	        to: 0
	    }
	    for (var n = 0; n < result.checkpoints.length; n++) 
	    {
	        if(result.checkpoints[n].name == result.ifStatements[i].checkpoint)
	        {
	            tempLink.to = result.checkpoints[n].node;
	            break;
	        }
	    }
	    result.nodelinks.push(tempLink);
	}

	console.log(result);
	return result;
}

function HandleFiles()
{
	console.log(scriptFileInput.files);
	
	nodes = [];
	edges = [];
	for(i = 0; i < scriptFileInput.files.length; i++)
	{
		var reader = new FileReader();
		var textFile = scriptFileInput.files[i];
		reader.onload = function(e) {
			
		    scriptFiles.push(CompileScript(e.target.result));

		    //nodes.push(
            //    {
            //        id: 0,
            //        label: String(0)
            //    }
            //);
		    for (var n = 0; n < scriptFiles[0].nodes.length; n++)
		    {
		        for (var chkpnt = 0; chkpnt < scriptFiles[0].checkpoints.length; chkpnt++) {
    
		        }
		        nodes.push(
                    {
		                id: n,
		                label: String(n),
		                title: "lmao",
                        level: n
                    }
                );
		    }
		    var flipFlop = false;
		    for (var n = 0; n < scriptFiles[0].nodelinks.length; n++)
		    {
		        edges.push(
                    {
                        from: scriptFiles[0].nodelinks[n].from,
                        to: scriptFiles[0].nodelinks[n].to,
                        arrows: 'to',
                        smooth: 
                        {
                            type: (
                                scriptFiles[0].nodelinks[n].to == scriptFiles[0].nodelinks[n].from + 1 ? "continuous" : ((flipFlop = !flipFlop) ? "curvedCW" : "curvedCCW")
                            )
                        }
                    }
                );
		    }
			
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

var options;
function draw() {
	destroy();
	
	var data = {
		edges: edges,
		nodes: nodes
	}

	// create a network
	var container = document.getElementById('mynetwork');
	options = {
	    layout: {
	        hierarchical: {
	            direction: "UD",
	            sortMethod: "directed",
	            nodeSpacing: 300
	        }
	    },
	    interaction: {
	        dragNodes: true
	    },
	    manipulation: {
	        enabled: true
	    },
	    physics: {
	        enabled: false
	    }
	};

	network = new vis.Network(container, data, options);

	// add event listeners
	network.on('select', function (params) {
	    if (params.nodes[0] != undefined)
	        document.getElementById("textbox").value = scriptFiles[0].nodes[params.nodes[0]].text;
	    else
	        document.getElementById("textbox").value = "";
	});
}