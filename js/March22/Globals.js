Globals = function()
{
	this.nodes = null;
	this.edges = null;
	this.network = null;
	this.scriptFileInput = null;//document.getElementById("fileItem");
	this.scriptFiles = [];
	this.nodeInfoBoxes = [];
	
	this.filesLoaded = false;
	this.selectedNode = null;
	this.edgesDataset = null;
	this.nodesDataset = null;
	
	this.nodeInfoBoxesIndex = {
		Name: 0,
		ID: 1,
		File: 2,
		Level: 3
	};
	this.options = null;

	this.selectedNode = null;
};

var GLOBALS = new Globals();