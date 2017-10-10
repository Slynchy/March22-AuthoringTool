Node.NodeTypes = {
	'nullop': '-',
	'narrative': 'Narrative/text',
	'drawcharacter': 'DrawCharacter',
	'transition': 'Transition',
};

Node.onSelectedFunctionChange = function()
{
	var e = document.getElementById("nodeFunctionSelect");
	var selectedFunction = e.options[e.selectedIndex].text;
	e = document.getElementById("additionalContent");
	e.innerHTML = "";

	switch(selectedFunction)
	{
		case Node.NodeTypes.narrative:
			e.innerHTML += '<label>Text: </label><textarea rows="4" cols="50" class="nodeItem" type="text" id="nNarrative"></textarea>';
		break;
		case Node.NodeTypes.drawcharacter:
			e.innerHTML += '<label>Character name: </label><input class="nodeItem" type="text" id="nCharName"></input><br>';
			e.innerHTML += '<label>Emotion name: </label><input class="nodeItem" type="text" id="nEmoName"></input><br>';
			e.innerHTML += '<label>X offset: </label><input class="nodeItem" type="number" id="nXOffset"></input><br>';
			e.innerHTML += '<label>Skip to next line?: </label><input class="nodeItem" type="checkbox" id="nLineSkip"></input><br>';
		break;
		case Node.NodeTypes.transition:
			e.innerHTML += '<label>Background name: </label><input class="nodeItem" type="text" id="nBackName"></input><br>';
			e.innerHTML += '<label>Transition name: </label><input class="nodeItem" type="text" id="nTransName"></input><br>';
			e.innerHTML += '<label>Speed: </label><input class="nodeItem" type="number" id="nSpeed" step="0.01" value="1.00"></input><br>';
			e.innerHTML += '<label>In or out?: </label><input class="nodeItem" type="checkbox" id="nInOrOut"></input><br>';
		break;
		default:
		break;
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
				if(element === nodeData.nodeType)
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
			list += '<option value="'+ key +'">'+ element +'</option>';
		}
	}
	ModalManager.createModal('<center><select id="nodeFunctionSelect" selectedIndex=0 onchange="Node.onSelectedFunctionChange()">'+ list +'</select><br><div id="additionalContent"></div<</center>',callback,createCallback);
}

Node._editNodeData = function(nodeData,callback)
{
	var e = document.getElementById("nodeFunctionSelect");
	var selectedFunction = e.options[e.selectedIndex].text;

	switch(selectedFunction)
	{
		case Node.NodeTypes.narrative:
			nodeData.label = 'NewNode';
			nodeData.SCRIPT_TXT = document.getElementById("nNarrative").value;
			nodeData.startOfNode = '';
			nodeData.endOfNode = '';
			nodeData.shape = 'ellipsis';
			nodeData.color = { background: '#D2E5FF'};
			nodeData.level = 0;
		break;
		case Node.NodeTypes.drawcharacter:
			nodeData.m22metadata = {
				charName: document.getElementById("nCharName").value,
				emoName: document.getElementById("nEmoName").value,
				xOffset: document.getElementById("nXOffset").value,
				skipToNextLine: document.getElementById("nLineSkip").checked
			};
			nodeData.label = 'DrawCharacter';
			nodeData.startOfNode = '';
			nodeData.endOfNode = '';
			nodeData.level = 0;
			nodeData.shape = 'diamond';
			nodeData.color = { background: '#BB1010'};
			nodeData.SCRIPT_TXT = 'DrawCharacter ' + (
				nodeData.m22metadata.charName + " " + 
				nodeData.m22metadata.emoName + " " + 
				nodeData.m22metadata.xOffset + " " +
				( nodeData.m22metadata.skipToNextLine ? "true" : "" )
			);
		break;
		case Node.NodeTypes.transition:
			nodeData.m22metadata = {
				backName: document.getElementById("nBackName").value,
				transName: document.getElementById("nTransName").value,
				speed: document.getElementById("nSpeed").value,
				inOrOut: document.getElementById("nInOrOut").checked
			};
			nodeData.label = 'Transition';
			nodeData.startOfNode = '';
			nodeData.endOfNode = '';
			nodeData.level = 0;
			nodeData.shape = 'diamond';
			nodeData.color = { background: '#BB1010'};
			nodeData.SCRIPT_TXT = 'Transition ' + (
				nodeData.m22metadata.backName + " " + 
				nodeData.m22metadata.transName + " " + 
				( nodeData.m22metadata.inOrOut ? "true" : "" ) + " " +
				( Number.parseFloat(nodeData.m22metadata.speed) !== 1.00 ? nodeData.m22metadata.speed : "")
			);
		break;
		case Node.NodeTypes.nullop:
		default:
			nodeData = null;
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
