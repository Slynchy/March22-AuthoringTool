Globals = function()
{
	this.aceEditor = ace.edit("textbox");
	this.aceEditor.$blockScrolling = Infinity;

	this.nodes = null;
	this.edges = null;
	this.network = null;
	this.scriptFileInput = null;//document.getElementById("fileItem");
	this.scriptFiles = [];
	this.nodeInfoBoxes = [];
	
	this.filesLoaded = false;
	this.selectedNode = null;
	this.nodesDataset = new vis.DataSet();
	this.edgesDataset = new vis.DataSet();
	
	this.nodeInfoBoxesIndex = {
		Name: 0,
		ID: 1,
		File: 2,
		Level: 3
	};
	this.options =
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
	        dragNodes: true
	    },
	    manipulation: 
		{
	        enabled: true,
	    },
	    physics: 
		{
	        enabled: false
	    }
	};

	this.selectedNode = null;
};

var gl = new Globals();