/*
    No, not that Node.js
*/

function visNode(props) {
    var node = props;
    //{ id, label, title, level, content }

    return node;
}
    
visNode.prototype.testFunc = function(something) {
    
};

// text, number, checkbox (string)
Node.Parameter = function(name, type, additionalData)
{
    var obj = {};
	obj.type = ( typeof(type) !== undefined ? type : '' );
    obj.name = ( typeof(name) !== undefined ? name : '' );
    obj.additionalData = ( typeof(additionalData) !== undefined ? additionalData : [] );
	return obj;
}

Node.Function = function(name, params, nodeProps)
{
    var obj = {};
	obj.name = ( typeof(name) !== undefined ? name : '' );
    obj.params = ( typeof(type) !== undefined ? params : [] );
    obj.nodeProps = ( typeof(nodeProps) !== undefined ? nodeProps : {} );
	return obj;
}

Node.Function.prototype._createFuncOptionsHTML = function()
{

}

Node._ShouldDeleteNode = function(node, useCode)
{
	var CODE = {
		NOPE: 0,
		GREATER_THAN_ONE_CHILD: 1,
		NO_PARENTS: 2,
		TOO_MANY_PARENTS: 3,
		NARRATIVE_NODE: 4,
		NO_CHILDREN: 5
	}
	var batman = false;

	if(node.children.length > 1)
	{
		batman = CODE.GREATER_THAN_ONE_CHILD;
	} 
	else if(node.children.length == 0)
	{
		batman = CODE.NO_CHILDREN;
	}
	else if(node.parents.length == 0)
	{
		batman = CODE.NO_PARENTS;
	} 
	else if(node.parents.length > 1) 
	{
		batman = CODE.TOO_MANY_PARENTS;
	}
	else if(node.nodeType.name == Node.NodeTypes.narrative.name)
	{
		batman = CODE.NARRATIVE_NODE;
	}

	if(useCode)
	{
		if(batman === false) return true;
		else return batman;	
	}
	else
	{
		if(batman === false) return true;
		else return false;	
	}

}

// DEPRECATED
Node.FindNextNarrativeNode = function(srcNode)
{
	for (var key in gl.nodesDataset._data) {
		if (gl.nodesDataset._data.hasOwnProperty(key)) {
			if(gl.nodesDataset._data[key].nodeType.name == Node.NodeTypes.narrative.name)
			{
				gl.nodesDataset._data[key];
				return 
			}
		}
	}
	return 0;
}

Node._GetPreviousNarrativeNode = function(parent)
{
	if(parent.nodeType.name == Node.NodeTypes.narrative.name)
	{
		return parent;	
	}
	else
	{
		if(parent.parents[0])
			return Node._GetPreviousNarrativeNode(gl.nodesDataset._data[parent.parents[0].from]);
		else
			return null;
	}
}

Node._LinkParentToChildren = function(node, queuedEdgesForDeletion)
{
	if(node.nodeType.name == Node.NodeTypes.narrative.name) return;

	for (var x = 0; x < node.parents.length; x++) {
		var p = node.parents[x];
		for (var y = 0; y < node.children.length; y++) {
			var c = node.children[y];
			var parentNode = gl.nodesDataset._data[p.from];
			var childNode = gl.nodesDataset._data[c.to];

			if(Node._ShouldDeleteNode(childNode) === false && Node._ShouldDeleteNode(childNode,true) != 4)
			{
				queuedEdgesForDeletion.push(c.id);
			}

			if(parentNode && parentNode.nodeType.name != Node.NodeTypes.narrative.name)
			{
				// backpropogate 
				parentNode = Node._GetPreviousNarrativeNode(parentNode);
				p.from = parentNode.id;
			}
			else if(parentNode)
			{
				p.to = c.to;
				Node._LinkParentToChildren(gl.nodesDataset._data[c.to], queuedEdgesForDeletion);
			}
		};
	};
	return node;
}

Node.GetFirstNode = function()
{
	var level = GetLowestNodeLevel();
	var nodes = [];

	for (var key in gl.nodesDataset._data) {
		if (gl.nodesDataset._data.hasOwnProperty(key)) {
			if( gl.nodesDataset._data[key].level === level)
			{
				nodes.push(gl.nodesDataset._data[key]);
			}
		}
	}

	if(nodes.length >= 1)
		return nodes[0];
	else
		return null;
}

// DEPRECATED/NON-WORKING
Node.GetFinalNode = function()
{
	return Node.ResolveNodeID(GetHighestNodeLevel());
}

Node.ResolveNodeID = function(id)
{
	for (var key in gl.nodesDataset._data) {
		if (gl.nodesDataset._data.hasOwnProperty(key)) {
			if(key === id)
				return gl.nodesDataset._data[key];
		}
	}
	return null;
}

Node._CompressNodeLevel_Recursive = function(node, prevNode)
{
	if(prevNode && node && node.level != prevNode.level + 1)
	{
		node.level = prevNode.level+1;
	}
	else if(!node) 
	{
		return;
	}

	if(node.children.length > 1)
	{
		for (var i = 0; i < node.children.length; i++) {
			Node._CompressNodeLevel_Recursive(gl.nodesDataset._data[node.children[i].to], node);
		}
	}
	else if(node.children.length != 0)
	{
		Node._CompressNodeLevel_Recursive(gl.nodesDataset._data[node.children[0].to], node);
	}
	else 
	{
		return;
	}
}

Node.CompressNodeLevels = function()
{
	var firstNode = Node.GetFirstNode();
	Node._CompressNodeLevel_Recursive(firstNode);
}

Node.SetNode = function(node,props)
{
	for (var key in props) {
		if (props.hasOwnProperty(key)) {
			node[key] = props[key];
		}
	}
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

Node._populateNodeModalParameters = function(nodeData)
{
	var inputs = document.getElementById('additionalContent').getElementsByTagName('input');
	var labels = document.getElementById('additionalContent').getElementsByTagName('label');

	for (var i = 0; i < labels.length; i++) {
		var e = labels[i];
		
		switch(inputs[i].type)
		{
			case 'checkbox':
				inputs[i].checked = nodeData.m22metadata[e.innerHTML];
				break;
			default:
				inputs[i].value = nodeData.m22metadata[e.innerHTML];
				break;
		}
	}
}

Node.UpdateNodeChildren = function()
{
	console.log("Updating node children");

	for (var nKey in gl.nodesDataset._data) {
		if (gl.nodesDataset._data.hasOwnProperty(nKey)) {
			gl.nodesDataset._data[nKey].children = [];
			gl.nodesDataset._data[nKey].parents = [];
			for (var eKey in gl.edgesDataset._data) {
				if (gl.edgesDataset._data.hasOwnProperty(eKey)) {
					if(gl.edgesDataset._data[eKey].from === gl.nodesDataset._data[nKey].id)
					{
						gl.nodesDataset._data[nKey].children.push(gl.edgesDataset._data[eKey]);
					}

					if(gl.edgesDataset._data[eKey].to === gl.nodesDataset._data[nKey].id)
					{
						gl.nodesDataset._data[nKey].parents.push(gl.edgesDataset._data[eKey]);
					}
				}
			}
		}
	}
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
				if(inputs[i].checked === true)
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