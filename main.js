

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

					node = Node._LinkParentToChildren(node, queuedEdgesForDeletion);
					
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
		Node.CompressNodeLevels();

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
		for (var i = 0; i < gl._STASHED_DATA["nodes"].length; i++) 
		{
			var stashedNode = gl._STASHED_DATA["nodes"][i];

			for (var nKey in gl.nodesDataset._data) 
			{
				if (gl.nodesDataset._data.hasOwnProperty(nKey)) 
				{
					var realNode = gl.nodesDataset._data[nKey];
					if(nKey === stashedNode.id)
					{
						// Hack fix: stops misaligned nodes after revealing
						var cacheLevel = stashedNode.level;
							Node.SetNode(stashedNode,realNode);
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

	var result = "";
	var firstNode = Node.GetFirstNode();
	result += firstNode.startOfNode + "\n\n";
	result += firstNode.SCRIPT_TXT + "\n\n";
	result += "\n\n" + firstNode.endOfNode + "\n\n";
	for(i = 0; i < files.length; i++)
	{
		for(n = 0; n < files[i].nodes.length; n++)
		{ 
			if(files[i].nodes[n].id == firstNode.id)
				continue;
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

