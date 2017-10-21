

// This is filled with functions where the parameters are the complete nodes and complete edges, for any modifications.
// { func(), storedVariables[] }
var queuedActions = [];

function CompileNode(_scriptStr, _scriptStrPos, result)
{
    // this function compiles script lines until it reaches an IF statement or a checkpoint
    // returns the new script str pos
}

function ToggleButtons(onOrOff)
{
	document.getElementById("fileItem").disabled = !onOrOff;
	document.getElementById("fileItemSave").disabled = !onOrOff;
	document.getElementById("compileButton").disabled = !onOrOff;
	for (var index = 0; index < gl.nodeInfoBoxes.length; index++) {
		var element = gl.nodeInfoBoxes[index];
		if(element)
			element.disabled = !onOrOff;
	}
}

function FindNextNarrativeNode(srcNode)
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

function _GetPreviousNarrativeNode(parent)
{
	if(parent.nodeType.name == Node.NodeTypes.narrative.name)
	{
		return parent;	
	}
	else
	{
		if(parent.parents[0])
			return _GetPreviousNarrativeNode(gl.nodesDataset._data[parent.parents[0].from]);
		else
			return null;
	}
}

function _ShouldDeleteNode(node, useCode)
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

function _LinkParentToChildren(node, queuedEdgesForDeletion)
{
	if(node.nodeType.name == Node.NodeTypes.narrative.name) return;

	for (var x = 0; x < node.parents.length; x++) {
		var p = node.parents[x];
		for (var y = 0; y < node.children.length; y++) {
			var c = node.children[y];
			var parentNode = gl.nodesDataset._data[p.from];
			var childNode = gl.nodesDataset._data[c.to];

			if(_ShouldDeleteNode(childNode) === false && _ShouldDeleteNode(childNode,true) != 4)
			{
				queuedEdgesForDeletion.push(c.id);
			}

			if(parentNode && parentNode.nodeType.name != Node.NodeTypes.narrative.name)
			{
				// backpropogate 
				parentNode = _GetPreviousNarrativeNode(parentNode);
				p.from = parentNode.id;
			}
			else if(parentNode)
			{
				p.to = c.to;
				_LinkParentToChildren(gl.nodesDataset._data[c.to], queuedEdgesForDeletion);
			}
		};
	};
	return node;
}

function GetFirstNode()
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

function GetFinalNode()
{
	return ResolveNodeID(GetHighestNodeLevel());
}

function ResolveNodeID(id)
{
	for (var key in gl.nodesDataset._data) {
		if (gl.nodesDataset._data.hasOwnProperty(key)) {
			if(key === id)
				return gl.nodesDataset._data[key];
		}
	}
	return null;
}

function _CompressNodeLevel_Recursive(node, prevNode)
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
			_CompressNodeLevel_Recursive(gl.nodesDataset._data[node.children[i].to], node);
		}
	}
	else if(node.children.length != 0)
	{
		_CompressNodeLevel_Recursive(gl.nodesDataset._data[node.children[0].to], node);
	}
	else 
	{
		return;
	}
}

function CompressNodeLevels()
{
	var firstNode = GetFirstNode();
	
	_CompressNodeLevel_Recursive(firstNode);
}

function HideFunctionNodes()
{
	var hideNodes = document.getElementById("settHideFunctions").checked;

	if(hideNodes)
	{
		ToggleButtons(false);
		// iterate through ALL nodes, stash the function nodes and edges, remove them and re-draw
		gl._STASHED_DATA = JSON.stringify(SaveNodesAndEdges())

		var queuedEdgesForDeletion = [];
		for (var key in gl.nodesDataset._data) {
			if (gl.nodesDataset._data.hasOwnProperty(key)) {
				var node = gl.nodesDataset._data[key];
				if(node.nodeType.name != Node.NodeTypes.narrative.name)
				{

					// We exclude these nodes because they are important :)
					if(node.children.length != 1 || node.parents.length == 0 || node.parents.length > 1)
					{
						continue;
					}

					node = _LinkParentToChildren(node, queuedEdgesForDeletion);
					
					delete gl.nodesDataset._data[key];
				}
				else 
				{
					continue;
				}
			}
		}
		
		queuedEdgesForDeletion = queuedEdgesForDeletion.filter(function(elem, index, self) {
			return index == self.indexOf(elem);
		})

		for (var i = 0; i < queuedEdgesForDeletion.length; i++) {
			for (var k in gl.edgesDataset._data) {
				if(k == queuedEdgesForDeletion[i])
				{
					delete gl.edgesDataset._data[k];
					break;
				}
			}
		}

		Node.UpdateNodeChildren();
		CompressNodeLevels();

		draw();
	}
	else
	{
		ToggleButtons(true);
		// restore stashed nodes
		if(!gl._STASHED_DATA)
		{
			// this should never happen
			return;
		}
		
		gl._STASHED_DATA = JSON.parse(gl._STASHED_DATA);
		// edit stashed data with edited nodes
		for (var i = 0; i < gl._STASHED_DATA["nodes"].length; i++) {
			var stashedNode = gl._STASHED_DATA["nodes"][i];

			for (var nKey in gl.nodesDataset._data) {
				if (gl.nodesDataset._data.hasOwnProperty(nKey)) {
					var realNode = gl.nodesDataset._data[nKey];
					if(nKey === stashedNode.id)
					{
						// Hack fix: stops misaligned nodes after revealing
						var cacheLevel = stashedNode.level;
							SetNode(stashedNode,realNode);
						stashedNode.level = cacheLevel;
						break;
					}
				}
			}
		}
		gl._STASHED_DATA = JSON.stringify(gl._STASHED_DATA);

		LoadProject(gl._STASHED_DATA);

		gl._STASHED_DATA = null;
	}
}

function SetNode(node,props)
{
	for (var key in props) {
		if (props.hasOwnProperty(key)) {
			node[key] = props[key];
		}
	}
}

function CreateLoadMenu()
{
	ModalManager.createModal('<input id="projectLoadButton" type="file" onchange="HandleFiles();" title="Select Script Files">');
}

function HandleFiles()
{
	var file = "";
	gl.scriptFileInput = document.getElementById("projectLoadButton");
	for(i = 0; i < gl.scriptFileInput.files.length; i++)
	{
		file = (gl.scriptFileInput.files[i]);
	}
	var reader = new FileReader();
	reader.onload = function(e) {
		var hashedName = file.name.hashCode();
		LoadProject(e.target.result);
	};
	reader.readAsText(file, "UTF-8");
}

function LoadProject(jsonStr)
{
	var temp = JSON.parse(jsonStr);
	gl.nodesDataset = new vis.DataSet(temp.nodes);
	gl.edgesDataset = new vis.DataSet(temp.edges);
	draw();
}

function SaveNodesAndEdges()
{
	var output = 
	{
		"nodes": [],
		"edges": []
	};
	
	var nodeIds = gl.nodesDataset.getIds();
	for(i = 0; i < nodeIds.length; i++)
	{
		output["nodes"].push(gl.nodesDataset._data[nodeIds[i]]);
	}

	var edgeIds = gl.edgesDataset.getIds();
	for(i = 0; i < edgeIds.length; i++)
	{
		output["edges"].push(gl.edgesDataset._data[edgeIds[i]]);
	}
	return output;
}

function SaveProject()
{
	var output = SaveNodesAndEdges();
	var blob = new Blob([JSON.stringify(output)], {type: "text/plain;charset=utf-8"});
	saveAs(blob, "test.m22proj");
}

async function SaveScripts_Async()
{
	var resultFiles = [];
	var numOfFiles = 0;
	var files = [];
	var nodeIds = gl.nodesDataset.getIds();

	var tempFile = {
		name: "OUTPUT.txt",
		nodes: []
	};
	files.push(tempFile);

	for(i = 0; i < nodeIds.length; i++)
	{
		files[0].nodes.push(gl.nodesDataset._data[nodeIds[i]]);
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
			result += files[i].nodes[n].startOfNode + "\n\n";
			result += files[i].nodes[n].SCRIPT_TXT + "\n\n";
			result += "\n\n" + files[i].nodes[n].endOfNode + "\n\n";
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












