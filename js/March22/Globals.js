Globals = function()
{

	this.aceEditor = ace.edit("textbox");
	this.aceEditor.$blockScrolling = Infinity;
	this.aceEditor.getSession().setUseWrapMode(true);

	// This is filled with functions where the parameters are the complete nodes and complete edges, for any modifications.
	// { func(), storedVariables[] }
	this.queuedActions = [];

	this.nodes = null;
	this.edges = null;
	this.network = null;
	this.scriptFileInput = null;//document.getElementById("fileItem");
	this.scriptFiles = [];
	this.nodeInfoBoxes = [];

	this._STASHED_DATA = {};
	
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