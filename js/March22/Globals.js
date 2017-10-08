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

	this.events = {
		onAddNode: null,
		onDeleteNode: null,
		onDeleteEdge: null,
		onAddEdge: null,
		onEditNode: null,
		onEditEdge: null
	};
	
	this.nodeInfoBoxesIndex = {
		Name: 0,
		ID: 1,
		File: 2,
		Level: 3
	};

	this.selectedNode = null;

	/*
		VisJS Network options
		Defined in M22vis, under draw()
	*/
	this.options = 
	{
		manipulation: // just so VisJS stops complaining
		{
			enabled: true,
			addNode: this.events.onAddNode,
			deleteNode: this.events.onDeleteNode,
			deleteEdge: this.events.onDeleteEdge,
			addEdge: this.events.onAddEdge,
			editEdge: this.events.onEditEdge,
			editNode: this.events.onEditNode,
		}
	}
};

var gl = new Globals();