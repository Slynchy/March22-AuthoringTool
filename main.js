

// This is filled with functions where the parameters are the complete nodes and complete edges, for any modifications.
// { func(), storedVariables[] }
var queuedActions = [];

function CompileNode(_scriptStr, _scriptStrPos, result)
{
    // this function compiles script lines until it reaches an IF statement or a checkpoint
    // returns the new script str pos
}

function HandleFiles()
{
	gl.nodes = [];
	gl.edges = [];
	for(i = 0; i < gl.scriptFileInput.files.length; i++)
	{
		ReadFileAsText(gl.scriptFileInput.files[i]);
	}
	gl.filesLoaded = true;
}

async function SaveScripts_Async()
{
	var resultFiles = [];
	var numOfFiles = 0;
	var files = [];
	var nodeIds = gl.nodesDataset.getIds();
	var length = nodeIds.length;
	for(i = 0; i < length; i++)
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












