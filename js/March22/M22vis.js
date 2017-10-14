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
	});
}

onEditEdge = function(edgeData, callback)
{
	callback(edgeData);
}

Node._createNodeModal = function(callback,createCallback)
{
	var list = '';
	for (var key in Node.NodeTypes) {
		if (Node.NodeTypes.hasOwnProperty(key)) {
			var element = Node.NodeTypes[key];
			list += '<option value="'+ key +'">'+ element.name +'</option>';
		}
	}
	ModalManager.createModal('<center><select id="nodeFunctionSelect" selectedIndex=0 onchange="Node.onSelectedFunctionChange()">'+ list +'</select><br><div id="additionalContent"></div<</center>',callback,createCallback);
}

Node._editNodeData = function(nodeData,callback)
{
	var e = document.getElementById("nodeFunctionSelect");
	var selectedFunction = Node.FindNodeType(e.options[e.selectedIndex].text);
	var selectedFunctionKey = Node.FindNodeType(e.options[e.selectedIndex].text, true)

	var inputs = document.getElementById('additionalContent').getElementsByTagName('input');
	var labels = document.getElementById('additionalContent').getElementsByTagName('label');

	if(selectedFunctionKey !== 'narrative')
		nodeData.SCRIPT_TXT = selectedFunctionKey;
	else
		nodeData.SCRIPT_TXT = "";
	nodeData.label = selectedFunctionKey;
	nodeData.level = !nodeData.level ? GetHighestNodeLevel() + 1 : nodeData.level;
	nodeData.startOfNode = '';
	nodeData.endOfNode = '';
	for (var k in selectedFunction.nodeProps) {
		if (selectedFunction.nodeProps.hasOwnProperty(k)) {
			nodeData[k] = selectedFunction.nodeProps[k];
		}
	}

	nodeData.m22metadata = {};
	for (var i = 0; i < labels.length; i++) {
		switch(inputs[i].type)
		{
			case 'checkbox':
				nodeData.m22metadata[labels[i].innerHTML] = inputs[i].checked;
				nodeData.SCRIPT_TXT += " " + inputs[i].checked;
				break;
			default:
				nodeData.m22metadata[labels[i].innerHTML] = inputs[i].value;
				nodeData.SCRIPT_TXT += " " + inputs[i].value;
				break;
		}
	}

	if(selectedFunctionKey === 'narrative')
		nodeData.SCRIPT_TXT = nodeData.SCRIPT_TXT.substr(1);

	switch(selectedFunction)
	{
		case Node.NodeTypes.narrative:
			nodeData.label = 'NewNode';
			nodeData.color = { background: '#D2E5FF'};
		break;
		case Node.NodeTypes.nullop:
			nodeData = null;
		break;
		default:
		break;
	}

	if(nodeData)
	{
		nodeData.shadow = { enabled: false };
		nodeData.nodeType = selectedFunction;
	}

	callback(nodeData);
}

onAddNode = function(nodeData, callback)
{
	Node._createNodeModal(function(){Node._editNodeData(nodeData,callback)});
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
		toNode.startOfNode = "--" + edgeData.to + "\n\n";
	}
	else
	{
		fromNode.endOfNode = "\n\nLoadScript " + toNode.title;
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
	            direction: "UD",
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
