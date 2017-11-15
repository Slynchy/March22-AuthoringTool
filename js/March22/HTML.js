
gl.nodeInfoBoxes.push( document.getElementById("nName") );
gl.nodeInfoBoxes.push( document.getElementById("nID") );
gl.nodeInfoBoxes.push( document.getElementById("nFile") );
gl.nodeInfoBoxes.push( document.getElementById("nLevel") );

gl.scriptFileInput = document.getElementById("fileItem");

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