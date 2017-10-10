/*
    No, not that Node.js
*/

function visNode(props) {
    var node = props;
    //{ id, label, title, level, content }

    return node;
}
    
visNode.prototype.testFunc = function(something) {
    
};

// text, number, checkbox (string)
Node.Parameter = function(name, type)
{
    var obj = {};
	obj.type = ( typeof(type) !== undefined ? type : '' );
	obj.name = ( typeof(name) !== undefined ? name : '' );
	return obj;
}

Node.Function = function(name, params)
{
    var obj = {};
	obj.name = ( typeof(name) !== undefined ? name : '' );
	obj.params = ( typeof(type) !== undefined ? params : [] );
	return obj;
}

Node.Function.prototype._createFuncOptionsHTML = function()
{

}