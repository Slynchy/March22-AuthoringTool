

// This is filled with functions where the parameters are the complete nodes and complete edges, for any modifications.
// { func(), storedVariables[] }
var queuedActions = [];

function CompileNode(_scriptStr, _scriptStrPos, result)
{
    // this function compiles script lines until it reaches an IF statement or a checkpoint
    // returns the new script str pos
}

function HandleFiles()
{
	GLOBALS.nodes = [];
	GLOBALS.edges = [];
	for(i = 0; i < GLOBALS.scriptFileInput.files.length; i++)
	{
		ReadFileAsText(GLOBALS.scriptFileInput.files[i]);
	}
	GLOBALS.filesLoaded = true;
}

function destroy() 
{
	if (GLOBALS.network !== null) {
		GLOBALS.network.destroy();
		GLOBALS.network = null;
	}
}

function draw() 
{
	destroy();
	
	var data = {
		edges: GLOBALS.edgesDataset,
		nodes: GLOBALS.nodesDataset
	}

	// create a network
	var container = document.getElementById('mynetwork');
	GLOBALS.options = 
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
			    if (edgeData.from === edgeData.to) 
			    {
			        alert("You can't connect a node to itself!");
			        callback(edgeData);
			        return;
			    }
				if(GLOBALS.selectedNode != null)
				{
					editor.setValue("");
					GLOBALS.selectedNode = null;
					for(n = 0; n < nodeInfoBoxes.length; n++)
					{
						nodeInfoBoxes[n].value = "";
					}
				}
				edgeData.arrows = 'to';
				if(nodesDataset === undefined)
					nodesDataset = network.body.data.nodes;
				
				if(nodesDataset._data[edgeData.from].title == nodesDataset._data[edgeData.to].title || nodesDataset._data[edgeData.to].title === undefined || nodesDataset._data[edgeData.from].title === undefined)
				{
					nodesDataset._data[edgeData.from].SCRIPT_TXT += "\n\nGoto " + edgeData.to;
					nodesDataset._data[edgeData.to].SCRIPT_TXT = "--" + edgeData.to + "\n\n" + nodesDataset._data[edgeData.to].SCRIPT_TXT;
				}
				else
				{
				    debugger;
				    nodesDataset._data[edgeData.from].SCRIPT_TXT += "\n\nLoadScript " + nodesDataset._data[edgeData.to].title;
				}
				
				UpdateSelectedNode();
				callback(edgeData);
			}
	    },
	    physics: 
		{
	        enabled: false
	    }
	};

	GLOBALS.network = new vis.Network(container, data, GLOBALS.options);

	// add event listeners
	GLOBALS.network.on('select', function (params) {
	    if (params.nodes[0] != undefined)
		{
			if(typeof(GLOBALS.selectedNode) != undefined && GLOBALS.selectedNode != null)
			{
				GLOBALS.selectedNode.SCRIPT_TXT = editor.getValue();
			}
			for (var property in GLOBALS.network.body.data.nodes._data) 
			{
				if (property == params.nodes[0]) 
				{
					GLOBALS.selectedNode = GLOBALS.network.body.data.nodes._data[property];
					break;
				}
			}
			try
			{
				editor.setValue(GLOBALS.selectedNode.SCRIPT_TXT);
				GLOBALS.nodeInfoBoxes[GLOBALS.nodeInfoBoxesIndex.Name].value = GLOBALS.selectedNode.label;
				if(GLOBALS.nodeInfoBoxes[GLOBALS.nodeInfoBoxesIndex.ID])
					GLOBALS.nodeInfoBoxes[GLOBALS.nodeInfoBoxesIndex.ID].value = GLOBALS.selectedNode.id;
				if(typeof(GLOBALS.selectedNode.title) === undefined || GLOBALS.selectedNode.title === undefined || GLOBALS.selectedNode.title == null)
					GLOBALS.selectedNode.title = "NewScriptFile.txt";
				GLOBALS.nodeInfoBoxes[GLOBALS.nodeInfoBoxesIndex.File].value = GLOBALS.selectedNode.title;
				GLOBALS.nodeInfoBoxes[GLOBALS.nodeInfoBoxesIndex.Level].value = GLOBALS.selectedNode.level;
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
			if(typeof(GLOBALS.selectedNode) != undefined && GLOBALS.selectedNode != null)
			{
				GLOBALS.selectedNode.SCRIPT_TXT = editor.getValue();
			}
	        editor.setValue("");
			GLOBALS.selectedNode = null;
			for(n = 0; n < GLOBALS.nodeInfoBoxes.length; n++)
			{
				if(GLOBALS.nodeInfoBoxes[n])
					GLOBALS.nodeInfoBoxes[n].value = "";
			}
		}
	});
}

function UpdateSelectedNode()
{
	if(GLOBALS.selectedNode != null)
	{
		// nodeInfoBoxes[nodeInfoBoxesIndex.Name].value = GLOBALS.selectedNode.label;
		// nodeInfoBoxes[nodeInfoBoxesIndex.ID].value = GLOBALS.selectedNode.id;
		// nodeInfoBoxes[nodeInfoBoxesIndex.File].value = GLOBALS.selectedNode.title;
		// nodeInfoBoxes[nodeInfoBoxesIndex.Level].value = GLOBALS.selectedNode.level;
		var temp = GLOBALS.selectedNode.level;
		if(nodesDataset == null)
			nodesDataset = network.body.data.nodes;
		if(edgesDataset == null)
		{
			edgesDataset = network.body.data.edges;
			draw();
		}
		
		nodesDataset.update([ { 
			id: GLOBALS.selectedNode.id, 
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












