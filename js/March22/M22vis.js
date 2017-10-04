
onAddNode = function(nodeData, callback)
{
	nodeData.label = 'NewNode';
	nodeData.SCRIPT_TXT = 'No text yet!';
	nodeData.startOfNode = '';
	nodeData.endOfNode = '';
	nodeData.level = 0;
	callback(nodeData);
}

onDeleteNode = function(nodeData,callback)
{
	gl.aceEditor.setValue("");
	callback(nodeData);
}

onDeleteEdge = function(edgeData,callback)
{
	var fromNode = gl.edgesDataset._data[edgeData.edges[0]].from;
	var toNode = gl.edgesDataset._data[edgeData.edges[0]].to;
	fromNode = gl.nodesDataset._data[fromNode];
	toNode = gl.nodesDataset._data[toNode];

	fromNode.endOfNode = "";
	toNode.startOfNode = "";

	callback(edgeData);
}

onAddEdge = function(edgeData,callback) 
{
	if (edgeData.from === edgeData.to) 
	{
		alert("You can't connect a node to itself!");
		callback(edgeData);
		return;
	}

	var fromNode = gl.nodesDataset._data[edgeData.from];
	var toNode = gl.nodesDataset._data[edgeData.to];

	if(gl.selectedNode != null)
	{
		gl.aceEditor.setValue("");
		gl.selectedNode = null;
		for(n = 0; n < gl.nodeInfoBoxes.length; n++)
		{
			if(gl.nodeInfoBoxes[n])
				gl.nodeInfoBoxes[n].value = "";
		}
	}
	edgeData.arrows = 'to';
	if(gl.nodesDataset === undefined)
		gl.nodesDataset = gl.network.body.data.nodes;
	
	if(fromNode.title == toNode.title || toNode.title === undefined || fromNode.title === undefined)
	{
		fromNode.endOfNode = "\n\nGoto " + edgeData.to;
		//fromNode.SCRIPT_TXT += "\n\nGoto " + edgeData.to;
		toNode.startOfNode = "--" + edgeData.to + "\n\n";
		//toNode.SCRIPT_TXT = "--" + edgeData.to + "\n\n" + toNode.SCRIPT_TXT;
	}
	else
	{
		//fromNode.SCRIPT_TXT += "\n\nLoadScript " + toNode.title;
		romNode.endOfNode = "\n\nLoadScript " + toNode.title;
	}
	
	UpdateSelectedNode();
	callback(edgeData);
}

function destroy() 
{
	if (gl.network !== null) {
		gl.network.destroy();
		gl.network = null;
	}
}

function draw() 
{
	destroy();
	
	var data = {
		edges: gl.edgesDataset,
		nodes: gl.nodesDataset
	}

	// create a network
	var container = document.getElementById('mynetwork');
	gl.options = 
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
			addNode: onAddNode,
			deleteNode: onDeleteNode,
			deleteEdge: onDeleteEdge,
			addEdge: onAddEdge,
	    },
	    physics: 
		{
	        enabled: false
	    }
	};

	gl.network = new vis.Network(container, data, gl.options);

	// add event listeners
	gl.network.on('select', function (params) {
	    if (params.nodes[0] != undefined)
		{
			if(typeof(gl.selectedNode) != undefined && gl.selectedNode != null)
			{
				gl.selectedNode.SCRIPT_TXT = gl.aceEditor.getValue();
			}
			for (var property in gl.network.body.data.nodes._data) 
			{
				if (property == params.nodes[0]) 
				{
					gl.selectedNode = gl.network.body.data.nodes._data[property];
					break;
				}
			}
			try
			{
				gl.aceEditor.setValue(gl.selectedNode.SCRIPT_TXT);
				gl.nodeInfoBoxes[gl.nodeInfoBoxesIndex.Name].value = gl.selectedNode.label;
				if(gl.nodeInfoBoxes[gl.nodeInfoBoxesIndex.ID])
					gl.nodeInfoBoxes[gl.nodeInfoBoxesIndex.ID].value = gl.selectedNode.id;
				if(typeof(gl.selectedNode.title) === undefined || gl.selectedNode.title === undefined || gl.selectedNode.title == null)
					gl.selectedNode.title = "NewScriptFile.txt";
				gl.nodeInfoBoxes[gl.nodeInfoBoxesIndex.File].value = gl.selectedNode.title;
				gl.nodeInfoBoxes[gl.nodeInfoBoxesIndex.Level].value = gl.selectedNode.level;
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
			if(typeof(gl.selectedNode) != undefined && gl.selectedNode != null)
			{
				gl.selectedNode.SCRIPT_TXT = gl.aceEditor.getValue();
			}
	        gl.aceEditor.setValue("");
			gl.selectedNode = null;
			for(n = 0; n < gl.nodeInfoBoxes.length; n++)
			{
				if(gl.nodeInfoBoxes[n])
					gl.nodeInfoBoxes[n].value = "";
			}
		}
	});
}

function UpdateSelectedNode()
{
	if(gl.selectedNode != null)
	{
		var temp = gl.selectedNode.level;
		if(gl.nodesDataset == null)
			gl.nodesDataset = gl.network.body.data.nodes;
		if(gl.edgesDataset == null)
		{
			gl.edgesDataset = gl.network.body.data.edges;
			draw();
		}
		
		gl.nodesDataset.update([ { 
			id: gl.selectedNode.id, 
			label: gl.nodeInfoBoxes[gl.nodeInfoBoxesIndex.Name].value,
			title: gl.nodeInfoBoxes[gl.nodeInfoBoxesIndex.File].value,
			level: parseInt(gl.nodeInfoBoxes[gl.nodeInfoBoxesIndex.Level].value),
			SCRIPT_TXT: gl.aceEditor.getValue()
		} ]);
		
		if(parseInt(gl.nodeInfoBoxes[gl.nodeInfoBoxesIndex.Level].value) != temp)
		{
			draw();
		}
	}
}
