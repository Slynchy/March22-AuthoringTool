

// This is filled with functions where the parameters are the complete nodes and complete edges, for any modifications.
// { func(), storedVariables[] }
var queuedActions = [];

function CompileNode(_scriptStr, _scriptStrPos, result)
{
    // this function compiles script lines until it reaches an IF statement or a checkpoint
    // returns the new script str pos
}

function HideFunctionNodes()
{
	var hideNodes = document.getElementById("settHideFunctions").checked;

	if(hideNodes)
	{
		// iterate through ALL nodes, stash the function nodes and edges, remove them and re-draw
		gl._STASHED_DATA = JSON.stringify(SaveNodesAndEdges())

		for (var key in gl.nodesDataset._data) {
			if (gl.nodesDataset._data.hasOwnProperty(key)) {
				var node = gl.nodesDataset._data[key];
				if(node.nodeType !== Node.NodeTypes.narrative)
				{
					var edgesToNode = [];
					var edgesFromNode = [];
					for (var eKey in gl.edgesDataset._data) {
						if (gl.edgesDataset._data.hasOwnProperty(eKey)) {
							var edge = gl.edgesDataset._data[eKey];
							if(edge.from === node.id)
							{
								edgesFromNode.push(edge);
							}
							else if( edge.to === node.id)
							{
								edgesToNode.push(edge);
							}
							else continue;
						}
					}

					if(edgesFromNode.length != 1)
					{
						// crap. This shouldn't happen.
						continue;
					}

					for (var i = 0; i < edgesToNode.length; i++) {
						var edge = edgesToNode[i];
						gl.edgesDataset._data[edge.id].to = edgesFromNode[0].to;
					}

					delete gl.nodesDataset._data[key];
				} else continue;
				delete gl.edgesDataset._data[edgesFromNode[0].id];
			}
		}

		draw();
	}
	else
	{
		// restore stashed nodes
		if(!gl._STASHED_DATA)
		{
			// this should never happen
			return;
		}
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
	for(i = 0; i < nodeIds.length; i++)
	{
		var fnameFound = -1;
		for(f = 0; f < files.length; f++)
		{
			if(files[f].name === gl.nodesDataset._data[nodeIds[i]].title)
			{
				fnameFound = f;
				break;
			}
		}
		if(fnameFound === -1)
		{
			numOfFiles++;
			
			var tempFile = {
				name: gl.nodesDataset._data[nodeIds[i]].title,
				nodes: []
			};
			tempFile.nodes.push(gl.nodesDataset._data[nodeIds[i]]);
			files.push(tempFile);
		}
		else
		{
			files[fnameFound].nodes.push(gl.nodesDataset._data[nodeIds[i]]);
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












