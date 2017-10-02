
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
					for(n = 0; n < GLOBALS.nodeInfoBoxes.length; n++)
					{
						if(GLOBALS.nodeInfoBoxes[n])
							GLOBALS.nodeInfoBoxes[n].value = "";
					}
				}
				edgeData.arrows = 'to';
				if(GLOBALS.nodesDataset === undefined)
					GLOBALS.nodesDataset = GLOBALS.network.body.data.nodes;
				
				if(GLOBALS.nodesDataset._data[edgeData.from].title == GLOBALS.nodesDataset._data[edgeData.to].title || GLOBALS.nodesDataset._data[edgeData.to].title === undefined || GLOBALS.nodesDataset._data[edgeData.from].title === undefined)
				{
					GLOBALS.nodesDataset._data[edgeData.from].SCRIPT_TXT += "\n\nGoto " + edgeData.to;
					GLOBALS.nodesDataset._data[edgeData.to].SCRIPT_TXT = "--" + edgeData.to + "\n\n" + GLOBALS.nodesDataset._data[edgeData.to].SCRIPT_TXT;
				}
				else
				{
				    GLOBALS.nodesDataset._data[edgeData.from].SCRIPT_TXT += "\n\nLoadScript " + GLOBALS.nodesDataset._data[edgeData.to].title;
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
		if(GLOBALS.nodesDataset == null)
			GLOBALS.nodesDataset = GLOBALS.network.body.data.nodes;
		if(GLOBALS.edgesDataset == null)
		{
			GLOBALS.edgesDataset = GLOBALS.network.body.data.edges;
			draw();
		}
		
		GLOBALS.nodesDataset.update([ { 
			id: GLOBALS.selectedNode.id, 
			label: GLOBALS.nodeInfoBoxes[GLOBALS.nodeInfoBoxesIndex.Name].value,
			title: GLOBALS.nodeInfoBoxes[GLOBALS.nodeInfoBoxesIndex.File].value,
			level: parseInt(GLOBALS.nodeInfoBoxes[GLOBALS.nodeInfoBoxesIndex.Level].value),
			SCRIPT_TXT: editor.getValue()
		} ]);
		
		if(parseInt(GLOBALS.nodeInfoBoxes[GLOBALS.nodeInfoBoxesIndex.Level].value) != temp)
		{
			draw();
		}
	}
}
