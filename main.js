

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

function _LinkParentToChildren(node)
{
	if(node.nodeType.name == Node.NodeTypes.narrative.name) return;
	node.parents.forEach(function(p) {
		node.children.forEach(function(c) {
			p.to = c.to;
			_LinkParentToChildren(gl.nodesDataset._data[c.to]);
		}, this);
	}, this);
}

function HideFunctionNodes()
{
	var hideNodes = document.getElementById("settHideFunctions").checked;

	if(hideNodes)
	{
		ToggleButtons(false);
		// iterate through ALL nodes, stash the function nodes and edges, remove them and re-draw
		gl._STASHED_DATA = JSON.stringify(SaveNodesAndEdges())

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


					
					delete gl.nodesDataset._data[key];
				}
				else 
				{
					continue;
				}
				//delete gl.edgesDataset._data[edgesFromNode[0].id];
			}
		}

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
						SetNode(stashedNode,realNode);
						//stashedNode.SCRIPT_TXT = realNode.SCRIPT_TXT;
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












