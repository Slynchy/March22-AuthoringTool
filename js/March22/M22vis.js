Node.FindNodeType = function(nodeText,returnKey)
{
	if( typeof(returnKey) === "undefined") returnKey = false;
	for (var key in Node.NodeTypes) {
		if (Node.NodeTypes.hasOwnProperty(key)) {
			var element = Node.NodeTypes[key];
			if(element.name === nodeText) 
			{
				if(returnKey)
					return key;
				else
					return Node.NodeTypes[key];
			}
			else continue;
		}
	}
}

Node.onSelectedFunctionChange = function()
{
	var e = document.getElementById("nodeFunctionSelect");
	var selectedFunction = e.options[e.selectedIndex].text;
	selectedFunction = Node.FindNodeType(selectedFunction);
	e = document.getElementById("additionalContent");
	e.innerHTML = "";

	for (var i = 0; i < selectedFunction.params.length; i++) {
		var element = selectedFunction.params[i];
		e.innerHTML += '<label>'+ element.name +'</label><input class="nodeItem" type="'+ element.type +'" id="'+ element.name.hashCode() +'"></input><br>';		
	}
}

onEditNode = function(nodeData, callback)
{
	Node._createNodeModal(function()
	{
		Node._editNodeData(nodeData,callback);
		gl.aceEditor.setValue(nodeData.SCRIPT_TXT);
		Node.UpdateNodeChildren();
	},
	function()
	{
		var e = document.getElementById("nodeFunctionSelect");
		var i = 0;
		for (var key in Node.NodeTypes) {
			if (Node.NodeTypes.hasOwnProperty(key)) {
				var element = Node.NodeTypes[key];
				if(element.name === nodeData.nodeType.name)
				{
					e.selectedIndex = i;
					break;
				}
				else i++;
			}
		}
		Node.onSelectedFunctionChange();
		Node._populateNodeModalParameters(nodeData);
	});
}

onEditEdge = function(edgeData, callback)
{
	callback(edgeData);
	Node.UpdateNodeChildren();
}

onAddNode = function(nodeData, callback)
{
	Node._createNodeModal(function(){Node._editNodeData(nodeData, function(){ callback(nodeData); Node.UpdateNodeChildren(); })});
}

onDeleteNode = function(nodeData,callback)
{
	gl.aceEditor.setValue("");
	callback(nodeData);
	Node.UpdateNodeChildren();
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
	Node.UpdateNodeChildren();
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
	
	fromNode.endOfNode = "\n\nGoto " + edgeData.to;
	toNode.startOfNode = "--" + edgeData.to + "\n\n";
	
	UpdateSelectedNode();
	callback(edgeData);
	Node.UpdateNodeChildren();
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
	Node.UpdateNodeChildren();
	
	var data = {
		edges: gl.edgesDataset,
		nodes: gl.nodesDataset
	}

	for (var key in data.edges._data) {
		if (data.edges._data.hasOwnProperty(key)) {
			data.edges._data[key].title = key;
		}
	}

	// create a network
	var container = document.getElementById('mynetwork');
	gl.events.onAddEdge = onAddEdge;
	gl.events.onAddNode = onAddNode;
	gl.events.onDeleteEdge = onDeleteEdge;
	gl.events.onDeleteNode = onDeleteNode;
	gl.events.onEditEdge = onEditEdge;
	gl.events.onEditNode = onEditNode;
	gl.options = 
	{
	    layout: 
		{
	        hierarchical: 
			{
	            direction: "LR",
	            sortMethod: "directed",
	            nodeSpacing: 250
	        }
	    },
	    interaction: 
		{
			dragNodes: true,
			navigationButtons: true,
	    },
	    manipulation: 
		{
	        enabled: true,
			addNode: gl.events.onAddNode,
			deleteNode: gl.events.onDeleteNode,
			deleteEdge: gl.events.onDeleteEdge,
			addEdge: gl.events.onAddEdge,
			editEdge: false,
			editNode: gl.events.onEditNode,
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
				if(gl.selectedNode.nodeType !== Node.NodeTypes.narrative) gl.aceEditor.setReadOnly(true);
				else gl.aceEditor.setReadOnly(false);
				gl.nodeInfoBoxes[gl.nodeInfoBoxesIndex.Name].value = gl.selectedNode.label;
				if(gl.nodeInfoBoxes[gl.nodeInfoBoxesIndex.ID])
					gl.nodeInfoBoxes[gl.nodeInfoBoxesIndex.ID].value = gl.selectedNode.id;
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

function GetHighestNodeLevel()
{
	var highest = false;
	for (var key in gl.nodesDataset._data) {
		if (gl.nodesDataset._data.hasOwnProperty(key)) {
			if(typeof(highest) === 'boolean' || gl.nodesDataset._data[key].level > highest)
			{
				highest = gl.nodesDataset._data[key].level;
			}
		}
	}
	if(highest === false) return 0;
	else return highest;
}

function GetLowestNodeLevel()
{
	var lowest = false;
	for (var key in gl.nodesDataset._data) {
		if (gl.nodesDataset._data.hasOwnProperty(key)) {
			if(typeof(lowest) === 'boolean' || gl.nodesDataset._data[key].level < lowest)
			{
				lowest = gl.nodesDataset._data[key].level;
			}
		}
	}
	if(lowest === false) return 0;
	else return lowest;
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
			//title: gl.nodeInfoBoxes[gl.nodeInfoBoxesIndex.File].value,
			level: parseInt(gl.nodeInfoBoxes[gl.nodeInfoBoxesIndex.Level].value),
			SCRIPT_TXT: gl.aceEditor.getValue()
		} ]);
		
		if(parseInt(gl.nodeInfoBoxes[gl.nodeInfoBoxesIndex.Level].value) != temp)
		{
			draw();
		}
	}
}
