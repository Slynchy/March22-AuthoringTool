// https://ace.c9.io/#nav=embedding
// Use this for text editing?

var nodes = null;
var edges = null;
var network = null;
var scriptFileInput = document.getElementById("fileItem");
var scriptFiles = [];

var filesLoaded = false;
var selectedNode = null;
var edgesDataset;
var nodesDataset;

var nodeInfoBoxes = [];
nodeInfoBoxes.push( document.getElementById("nName") );
nodeInfoBoxes.push( document.getElementById("nID") );
nodeInfoBoxes.push( document.getElementById("nFile") );
nodeInfoBoxes.push( document.getElementById("nLevel") );
var nodeInfoBoxesIndex = {
	Name: 0,
	ID: 1,
	File: 2,
	Level: 3
};

// This is filled with functions where the parameters are the complete nodes and complete edges, for any modifications.
// { func(), storedVariables[] }
var queuedActions = [];

/* 
	scriptmusic/scriptBG/scriptSFX = { 
		filename, 
		positionsOfUse { 
			nodeid, 
			pos 
		} 
	}
	checkpoints = { 
		name, 
		pos 
	}
	links = { 
		name, 
		scriptfile_linked, 
		pos 
	}
	nodelinks = { 
		from, 
		to 
	}
	nodes = { 
		pos, 
		text 
	}
	compiled_lines = { 
		linetype, 
		params, 
		params_txt, 
		lineContents, 
		ID 
	} 

*/

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
    M22IF: 9,
	LOAD_SCRIPT: 10
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
    "m22IF",
	"LoadScript"
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
        if(_keyword[0] == "-" && _keyword[1] == "-") // we don't need to check for comments, since they're already removed
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

function CompileLine(CURRENT_LINE_SPLIT, tempLine_c, result, nodeInfo, linePos, hashedName)
{
    //Compile line
    switch (tempLine_c.linetype) {
        case LINETYPE.DRAW_BACKGROUND:
            tempLine_c.params_txt.push(CURRENT_LINE_SPLIT[1]);
            if (FindLoadedAsset(CURRENT_LINE_SPLIT[1], result.backgrounds) === undefined) {
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
            if (FindLoadedAsset(CURRENT_LINE_SPLIT[1], result.music) === undefined) {
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
            if (FindLoadedAsset(CURRENT_LINE_SPLIT[1], result.sfx) === undefined) {
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
			for (var n = 0; n < CURRENT_LINE_SPLIT.length; n++) 
			{
				tempLine_c.lineContents += CURRENT_LINE_SPLIT[n] + " ";
			}
            var paramlinetype = CheckLineType(CURRENT_LINE_SPLIT[3]);
            result.nodes.push({ text: nodeInfo.currentNodeTxt + tempLine_c.lineContents, pos: linePos });
            result.nodelinks.push({ from: hashedName + nodeInfo.currentNode, to: hashedName + ++nodeInfo.currentNode });
            result.ifStatements.push({ checkpoint: CURRENT_LINE_SPLIT[4], pos: linePos, node: (nodeInfo.currentNode-1) });
            nodeInfo.currentNodeTxt = "";
            break;
        case LINETYPE.LOAD_SCRIPT:
            result.nodelinks.push({ from: hashedName + nodeInfo.currentNode, to: (CURRENT_LINE_SPLIT[1] + ".txt").hashCode() });
			
			queuedActions.push(
				{
					func: function(completeNodes, completeEdges,storedVariables)
					{
						for (var n = 0; n < completeNodes.length; n++) 
						{
							if(completeNodes[n].id == storedVariables[0])
							{
								for (var y = 0; y < (completeNodes.length-n); y++) 
								{
									if(completeNodes[n+y].id != storedVariables[0]+y) break;
									completeNodes[n+y].level = storedVariables[1] + y;
								}
								break;
							};
						}
						for (var n = 0; n < completeEdges.length; n++) 
						{
							if(completeEdges[n].to == storedVariables[0])
							{
								completeEdges[n].smooth = undefined;
								break;
							}
						}
					},
					storedVariables: 
					[
						(CURRENT_LINE_SPLIT[1] + ".txt").hashCode(),
						nodeInfo.currentNode
					]
				}
			);
			
            break;
    }
}

function CompileNode(_scriptStr, _scriptStrPos, result)
{
    // this function compiles script lines until it reaches an IF statement or a checkpoint
    
    // returns the new script str pos
}

// returns object of node
function CompileScript(hashedName, _scriptStr)
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
		    result.nodelinks.push({ from: hashedName + nodeInfo.currentNode, to: hashedName + ++nodeInfo.currentNode });
		    nodeInfo.currentNodeTxt = "";
		}
		else
		{
		    CompileLine(CURRENT_LINE_SPLIT, tempLine_c, result, nodeInfo, n, hashedName);
		}
		if(tempLine_c.linetype != LINETYPE.M22IF) 
			nodeInfo.currentNodeTxt += tempArray[n] + "\n\n";
		result.__scriptCompiled__.push(tempLine_c);
	}
	result.nodes.push({ text: nodeInfo.currentNodeTxt, pos: n });
	result.nodelinks.push({ from: hashedName + nodeInfo.currentNode, to: hashedName + ++nodeInfo.currentNode });

	for (var i = 0; i < result.ifStatements.length; i++) 
	{
	    var tempLink = {
	        from: hashedName + result.ifStatements[i].node,
	        to: 0
	    }
	    for (var n = 0; n < result.checkpoints.length; n++) 
	    {
	        if(result.checkpoints[n].name == result.ifStatements[i].checkpoint)
	        {
	            tempLink.to = hashedName + result.checkpoints[n].node;
	            break;
	        }
	    }
	    result.nodelinks.push(tempLink);
	}

	console.log(result);
	return result;
}

function ReadFileAsText(file)
{
	var reader = new FileReader();
	var textFile = file;
	var complete = false;
	reader.onload = function(e) {
		var hashedName = file.name.hashCode();
		var temp = CompileScript(hashedName, e.target.result);
		for (var n = 0; n < temp.nodes.length; n++)
		{
			for (var chkpnt = 0; chkpnt < temp.checkpoints.length; chkpnt++) {

			}
			nodes.push(
				{
					id: hashedName + n,
					label: String(n),
					title: file.name,
					level: n,
					SCRIPT_PTR: temp.nodes[n],
					SCRIPT_TXT: temp.nodes[n].text
				}
			);
		}
		var flip = false;
		for (var n = 0; n < temp.nodelinks.length; n++)
		{
			edges.push(
				{
					from: temp.nodelinks[n].from,
					to: temp.nodelinks[n].to,
					arrows: 'to',
					smooth: 
					{
						type: (
							temp.nodelinks[n].to == temp.nodelinks[n].from + 1 ? "continuous" : ((flip = !flip) ? "curvedCW" : "curvedCCW")
						)
					}
				}
			);
		}
		
		for (var n = 0; n < queuedActions.length; n++)
		{
			queuedActions[n].func(nodes,edges,queuedActions[n].storedVariables);
		}
		
		scriptFiles.push(temp);
		scriptFiles[scriptFiles.length -1].name = file.name;
		scriptFiles[scriptFiles.length -1].hashedName = hashedName;
	
		nodesDataset = new vis.DataSet(nodes);
		edgesDataset = new vis.DataSet(edges);
		
		draw();
		complete = true;
	};
	reader.readAsText(file, "UTF-8");
}

function HandleFiles()
{
	nodes = [];
	edges = [];
	for(i = 0; i < scriptFileInput.files.length; i++)
	{
		ReadFileAsText(scriptFileInput.files[i]);
	}
	filesLoaded = true;
}

function destroy() 
{
	if (network !== null) {
		network.destroy();
		network = null;
	}
}

var options;
function draw() 
{
	destroy();
	
	var data = {
		edges: edgesDataset,
		nodes: nodesDataset
	}

	// create a network
	var container = document.getElementById('mynetwork');
	options = 
	{
	    layout: 
		{
	        hierarchical: 
			{
	            direction: "UD",
	            sortMethod: "directed",
	            nodeSpacing: 250
	        }
	    },
	    interaction: 
		{
	        dragNodes: true
	    },
	    manipulation: 
		{
	        enabled: true,
			addNode: function(nodeData,callback)
			{
				nodeData.label = 'NewNode';
				//nodeData.id 
				nodeData.SCRIPT_TXT = 'No text yet!';
				nodeData.level = 0;
				callback(nodeData);
			},
			deleteNode: function(nodeData,callback)
			{
				editor.setValue("");
				callback(nodeData);
			},
			addEdge: function(edgeData,callback) 
			{
				if(selectedNode != null)
				{
					editor.setValue("");
					selectedNode = null;
					for(n = 0; n < nodeInfoBoxes.length; n++)
					{
						nodeInfoBoxes[n].value = "";
					}
				}
				edgeData.arrows = 'to';
				if(nodesDataset === undefined)
					nodesDataset = network.body.data.nodes;
				
				if(nodesDataset._data[edgeData.from].title == nodesDataset._data[edgeData.to].title)
				{
					nodesDataset._data[edgeData.from].SCRIPT_TXT += "\n\nGoto " + edgeData.to;
					nodesDataset._data[edgeData.to].SCRIPT_TXT = "--" + edgeData.to + "\n\n" + nodesDataset._data[edgeData.to].SCRIPT_TXT;
				}
				else
				{
					nodesDataset._data[edgeData.from].SCRIPT_TXT += "\n\nLoadScript " + nodesDataset._data[edgeData.to].title;
				}
				debugger;
				
				UpdateSelectedNode();
				if (edgeData.from === edgeData.to) 
				{
					var r = confirm("Do you want to connect the node to itself?");
					if (r === true) 
					{
					  callback(edgeData);
					}
				}
				else 
				{
					callback(edgeData);
				}
			}
	    },
	    physics: 
		{
	        enabled: false
	    }
	};

	network = new vis.Network(container, data, options);

	// add event listeners
	network.on('select', function (params) {
	    if (params.nodes[0] != undefined)
		{
			if(typeof(selectedNode) != undefined && selectedNode != null)
			{
				selectedNode.SCRIPT_TXT = editor.getValue();
			}
			for (var property in network.body.data.nodes._data) 
			{
				if (property == params.nodes[0]) 
				{
					selectedNode = network.body.data.nodes._data[property];
					break;
				}
			}
			try
			{
				editor.setValue(selectedNode.SCRIPT_TXT);
				nodeInfoBoxes[nodeInfoBoxesIndex.Name].value = selectedNode.label;
				nodeInfoBoxes[nodeInfoBoxesIndex.ID].value = selectedNode.id;
				if(typeof(selectedNode.title) === undefined || selectedNode.title === undefined || selectedNode.title == null)
					selectedNode.title = "NewScriptFile.txt";
				nodeInfoBoxes[nodeInfoBoxesIndex.File].value = selectedNode.title;
				nodeInfoBoxes[nodeInfoBoxesIndex.Level].value = selectedNode.level;
			}
			catch(err)
			{
				alert("Failed to find node data!");
				console.log(err);
				console.log(params);
			}
	    }
		else
		{
			if(typeof(selectedNode) != undefined && selectedNode != null)
			{
				selectedNode.SCRIPT_TXT = editor.getValue();
			}
	        editor.setValue("");
			selectedNode = null;
			for(n = 0; n < nodeInfoBoxes.length; n++)
			{
				nodeInfoBoxes[n].value = "";
			}
		}
	});
}

function UpdateSelectedNode()
{
	if(selectedNode != null)
	{
		// nodeInfoBoxes[nodeInfoBoxesIndex.Name].value = selectedNode.label;
		// nodeInfoBoxes[nodeInfoBoxesIndex.ID].value = selectedNode.id;
		// nodeInfoBoxes[nodeInfoBoxesIndex.File].value = selectedNode.title;
		// nodeInfoBoxes[nodeInfoBoxesIndex.Level].value = selectedNode.level;
		var temp = selectedNode.level;
		if(nodesDataset == null)
			nodesDataset = network.body.data.nodes;
		if(edgesDataset == null)
		{
			edgesDataset = network.body.data.edges;
			draw();
		}
		
		nodesDataset.update([ { 
			id: selectedNode.id, 
			label:nodeInfoBoxes[nodeInfoBoxesIndex.Name].value,
			title: nodeInfoBoxes[nodeInfoBoxesIndex.File].value,
			level: parseInt(nodeInfoBoxes[nodeInfoBoxesIndex.Level].value),
			SCRIPT_TXT: editor.getValue()
		} ]);
		
		if(parseInt(nodeInfoBoxes[nodeInfoBoxesIndex.Level].value) != temp)
		{
			draw();
		}
	}
}

async function SaveScripts_Async()
{
	var resultFiles = [];
	var numOfFiles = 0;
	var files = [];
	var nodeIds = nodesDataset.getIds();
	var length = nodeIds.length;
	for(i = 0; i < length; i++)
	{
		var fnameFound = -1;
		for(f = 0; f < files.length; f++)
		{
			if(files[f].name === nodesDataset._data[nodeIds[i]].title)
			{
				fnameFound = f;
				break;
			}
		}
		if(fnameFound === -1)
		{
			numOfFiles++;
			
			var tempFile = {
				name: nodesDataset._data[nodeIds[i]].title,
				nodes: []
			};
			tempFile.nodes.push(nodesDataset._data[nodeIds[i]]);
			files.push(tempFile);
		}
		else
		{
			files[fnameFound].nodes.push(nodesDataset._data[nodeIds[i]]);
		}
	}
	
	for(i = 0; i < files.length; i++)
	{
		files[i].nodes.sort(
			function(a,b)
			{
				return parseInt(a.level) - parseInt(a.level);
			}
		);
	}
	
	for(i = 0; i < files.length; i++)
	{
		var result = "";
		for(n = 0; n < files[i].nodes.length; n++)
		{ 
			result += files[i].nodes[n].SCRIPT_TXT + "\n\n";
		}
		//resultFiles[files[i].name] = result;
		var blob = new Blob([result], {type: "text/plain;charset=utf-8"});
		saveAs(blob, files[i].name);
	}
	
}

function SaveScripts()
{
	SaveScripts_Async();
	alert("Saving scripts, please be patient!");
}












