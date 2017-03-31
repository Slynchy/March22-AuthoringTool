
var nodes = null;
var edges = null;
var network = null;
var scriptFileInput = document.getElementById("fileItem");
var scriptFiles = [];

function HandleFiles()
{
	console.log(scriptFileInput.files);
	
	nodes = [];
	for(i = 0; i < scriptFileInput.files.length; i++)
	{
		var reader = new FileReader();
		var textFile = scriptFileInput.files[i];
		reader.onload = function(e) {
			nodes.push({
				id: i,
				label: textFile.name
			});
			edges = [];
			
			var tempArray = e.target.result.split("\n");
			for (var n = 0, len = tempArray.length; n < len; n++) 
			{
				if(tempArray[n].length <= 1)
				{
					tempArray.splice(n, 1);
					n--;
					len = tempArray.length;
				}
			}
			scriptFiles.push(tempArray);
			
			draw();
		};
		reader.readAsText(textFile);
	}
	
	
}

function destroy() {
	if (network !== null) {
		network.destroy();
		network = null;
	}
}

function draw() {
	destroy();
	
	var data = {
		edges: edges,
		nodes: nodes
	}

	// create a network
	var container = document.getElementById('mynetwork');
	var options = {
		layout: {
			hierarchical: {
				enabled: true,
				sortMethod: "directed",
				direction: "UD",
				edgeMinimization: false,
				blockShifting: false
			}
		},
		physics: {
			enabled: false
		}
	};
	network = new vis.Network(container, data, options);

	// add event listeners
	network.on('select', function (params) {
		//console.log(nodes[parseInt(params.nodes[0])-1].script);
	});
}