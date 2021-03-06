M22Compiler = function()
{
	this.LINETYPE = {
		NARRATIVE : -1,
		NEW_PAGE : 1,
		NONE : 2,
		DRAW_BACKGROUND : 3,
		PLAY_MUSIC : 4,
		PLAY_STING : 5,
		CHECKPOINT : 6,
		COMMENT : 7,
		SET_ACTIVE_TRANSITION: 8,
		M22IF: 9,
		LOAD_SCRIPT: 10
	}
	
	this._functionNames = [
		"thIsIssNarraTIVE", //<- This should never be returned!
		"NewPage",
		"ABSOLUTELYNOTHINGIGNORETHIS!!!", // Nor this!
		"DrawBackground",
		"PlayMusic",
		"PlaySting",
		"--",
		"//", // Nor this, but is set up to handle it
		"SetActiveTransition",
		"m22IF",
		"LoadScript"
	];
	
	this.functionHashes = [];
    for (var n = 0, len = this._functionNames.length; n < len; n++) 
    {
        this.functionHashes.push(this._functionNames[n].hashCode());
    }
}

M22Compiler.prototype.CheckLineType = function(_keyword)
{
    if (_keyword.length >= 3)
    {
        if(_keyword[0] == "-" && _keyword[1] == "-") // we don't need to check for comments, since they're already removed
        {
            return LINETYPE.CHECKPOINT;
        }
    }
	return FunctionHashes.indexOf(_keyword.hashCode());
}

M22Compiler.prototype.FindLoadedAsset = function(name, myArray)
{
    for (var i=0; i < myArray.length; i++) 
    {
        if (myArray[i].filename === name) 
        {
            return myArray[i];
        }
    }
    return undefined;
}

M22Compiler.prototype.CompileLine = function(CURRENT_LINE_SPLIT, tempLine_c, result, nodeInfo, linePos, hashedName)
{
    //Compile line
    switch (tempLine_c.linetype) {
        case this.LINETYPE.DRAW_BACKGROUND:
            tempLine_c.params_txt.push(CURRENT_LINE_SPLIT[1]);
            if (FindLoadedAsset(CURRENT_LINE_SPLIT[1], result.backgrounds) === undefined) {
                result.backgrounds.push(
                    {
                        filename: CURRENT_LINE_SPLIT[1],
                        positionsOfUse:
                        {
                            nodeid: (result.nodes.length),
                            pos: linePos
                        }
                    }
                );
            }
            break;
        case this.LINETYPE.SET_ACTIVE_TRANSITION:
            tempLine_c.params_txt.push(CURRENT_LINE_SPLIT[1]);
            break;
        case this.LINETYPE.NEW_PAGE:
            break;
        case this.LINETYPE.PLAY_MUSIC:
            //tempLine_c.lineContents = (tempArray[linePos]);
            tempLine_c.params_txt.push(CURRENT_LINE_SPLIT[1]);
            if (FindLoadedAsset(CURRENT_LINE_SPLIT[1], result.music) === undefined) {
                result.music.push(
                    {
                        filename: CURRENT_LINE_SPLIT[1],
                        positionsOfUse:
                        {
                            nodeid: (result.nodes.length),
                            pos: linePos
                        }
                    }
                );
            }
            break;
        case this.LINETYPE.PLAY_STING:
            tempLine_c.params_txt.push(CURRENT_LINE_SPLIT[1]);
            if (FindLoadedAsset(CURRENT_LINE_SPLIT[1], result.sfx) === undefined) {
                result.sfx.push(
                    {
                        filename: CURRENT_LINE_SPLIT[1],
                        positionsOfUse:
                        {
                            nodeid: (result.nodes.length),
                            pos: linePos
                        }
                    }
                );
            }
            break;
        case this.LINETYPE.M22IF:
			for (var n = 0; n < CURRENT_LINE_SPLIT.length; n++) 
			{
				tempLine_c.lineContents += CURRENT_LINE_SPLIT[n] + " ";
			}
            var paramlinetype = CheckLineType(CURRENT_LINE_SPLIT[3]);
            result.nodes.push({ text: nodeInfo.currentNodeTxt + tempLine_c.lineContents, pos: linePos });
            result.nodelinks.push({ from: hashedName + nodeInfo.currentNode, to: hashedName + ++nodeInfo.currentNode });
            result.ifStatements.push({ checkpoint: CURRENT_LINE_SPLIT[4], pos: linePos, node: (nodeInfo.currentNode-1) });
            nodeInfo.currentNodeTxt = "";
            break;
        case this.LINETYPE.LOAD_SCRIPT:
            result.nodelinks.push({ from: hashedName + nodeInfo.currentNode, to: (CURRENT_LINE_SPLIT[1] + ".txt").hashCode() });
			gl.queuedActions.push(
				{
					func: function(completeNodes, completeEdges,storedVariables)
					{
						for (var n = 0; n < completeNodes.length; n++) 
						{
							if(completeNodes[n].id == storedVariables[0])
							{
								for (var y = 0; y < (completeNodes.length-n); y++) 
								{
									if(completeNodes[n+y].id != storedVariables[0]+y) break;
									completeNodes[n+y].level = storedVariables[1] + y;
								}
								break;
							};
						}
						for (var n = 0; n < completeEdges.length; n++) 
						{
							if(completeEdges[n].to == storedVariables[0])
							{
								completeEdges[n].smooth = undefined;
								break;
							}
						}
					},
					storedVariables: 
					[
						(CURRENT_LINE_SPLIT[1] + ".txt").hashCode(),
						nodeInfo.currentNode
					]
				}
			);
			
            break;
    }
}

// returns object of node
M22Compiler.prototype.CompileScript = function(hashedName, _scriptStr)
{
	var result = {};
	result.checkpoints = [];
	result.backgrounds = [];
	result.sfx = [];
	result.music = [];
	result.nodes = [];
	result.nodelinks = [];
	result.ifStatements = []; // { checkpoint to jump to, pos, node }
	result.__scriptCompiled__ = [];
	
	// Split the string into array of lines
	var tempArray = _scriptStr.split("\n");
	for (var n = 0, len = tempArray.length; n < len; n++) 
	{
		tempArray[n] = tempArray[n].trim();
		if(tempArray[n].length <= 1 || (tempArray[n][0] == "/" && tempArray[n][1] == "/"))	
		{
			tempArray.splice(n, 1);
			n--;
			len = tempArray.length;
		}
	}
	
	var nodeInfo = { currentNodeTxt: "", currentNode: 0 };
	var n = 0;
	for (n, len = tempArray.length; n < len; n++) 
	{
	    var CURRENT_LINE_SPLIT = tempArray[n].split(" ");
	    for (var i = 0; i < CURRENT_LINE_SPLIT.length; i++)
	    {
	        CURRENT_LINE_SPLIT[i] = CURRENT_LINE_SPLIT[i].trim();
	    }
		var tempLine_c = {
			linetype: LINETYPE.NONE,
			params: [],
			params_txt: [],
			lineContents: "",
			ID: 0
		};
		tempLine_c.linetype = CheckLineType(CURRENT_LINE_SPLIT[0]);

		if (tempLine_c.linetype == LINETYPE.NARRATIVE)
		{
			tempLine_c.lineContents = tempArray[n];
		}
		else if (tempLine_c.linetype == LINETYPE.CHECKPOINT)
		{
		    tempLine_c.params_txt = tempArray[n].substring(2);
		    result.checkpoints.push({ name: tempLine_c.params_txt, pos: n, node: (nodeInfo.currentNode+1) });
		    result.nodes.push({ text: nodeInfo.currentNodeTxt, pos: n });
		    result.nodelinks.push({ from: hashedName + nodeInfo.currentNode, to: hashedName + ++nodeInfo.currentNode });
		    nodeInfo.currentNodeTxt = "";
		}
		else
		{
		    CompileLine(CURRENT_LINE_SPLIT, tempLine_c, result, nodeInfo, n, hashedName);
		}
		if(tempLine_c.linetype != LINETYPE.M22IF) 
			nodeInfo.currentNodeTxt += tempArray[n] + "\n\n";
		result.__scriptCompiled__.push(tempLine_c);
	}
	result.nodes.push({ text: nodeInfo.currentNodeTxt, pos: n });
	result.nodelinks.push({ from: hashedName + nodeInfo.currentNode, to: hashedName + ++nodeInfo.currentNode });

	for (var i = 0; i < result.ifStatements.length; i++) 
	{
	    var tempLink = {
	        from: hashedName + result.ifStatements[i].node,
	        to: 0
	    }
	    for (var n = 0; n < result.checkpoints.length; n++) 
	    {
	        if(result.checkpoints[n].name == result.ifStatements[i].checkpoint)
	        {
	            tempLink.to = hashedName + result.checkpoints[n].node;
	            break;
	        }
	    }
	    result.nodelinks.push(tempLink);
	}

	console.log(result);
	return result;
}

M22Compiler.prototype.ReadFileAsText = function(file)
{
	var reader = new FileReader();
	var textFile = file;
	var complete = false;
	reader.onload = function(e) {
		var hashedName = file.name.hashCode();
		var temp = CompileScript(hashedName, e.target.result);
		for (var n = 0; n < temp.nodes.length; n++)
		{
			for (var chkpnt = 0; chkpnt < temp.checkpoints.length; chkpnt++) {

			}
			nodes.push(
				{
					id: hashedName + n,
					label: String(n),
					title: file.name,
					level: n,
					SCRIPT_PTR: temp.nodes[n],
					SCRIPT_TXT: temp.nodes[n].text
				}
			);
		}
		var flip = false;
		for (var n = 0; n < temp.nodelinks.length; n++)
		{
			edges.push(
				{
					from: temp.nodelinks[n].from,
					to: temp.nodelinks[n].to,
					arrows: 'to',
					smooth: 
					{
						type: (
							temp.nodelinks[n].to == temp.nodelinks[n].from + 1 ? "continuous" : ((flip = !flip) ? "curvedCW" : "curvedCCW")
						)
					}
				}
			);
		}
		
		for (var n = 0; n < gl.queuedActions.length; n++)
		{
			gl.queuedActions[n].func(nodes,edges,gl.queuedActions[n].storedVariables);
		}
		
		scriptFiles.push(temp);
		scriptFiles[scriptFiles.length -1].name = file.name;
		scriptFiles[scriptFiles.length -1].hashedName = hashedName;
	
		nodesDataset = new vis.DataSet(nodes);
		edgesDataset = new vis.DataSet(edges);
		
		draw();
		complete = true;
	};
	reader.readAsText(file, "UTF-8");
}

var COMPILER = new M22Compiler();


/* 
	scriptmusic/scriptBG/scriptSFX = { 
		filename, 
		positionsOfUse { 
			nodeid, 
			pos 
		} 
	}
	checkpoints = { 
		name, 
		pos 
	}
	links = { 
		name, 
		scriptfile_linked, 
		pos 
	}
	nodelinks = { 
		from, 
		to 
	}
	nodes = { 
		pos, 
		text 
	}
	compiled_lines = { 
		linetype, 
		params, 
		params_txt, 
		lineContents, 
		ID 
	} 

*/