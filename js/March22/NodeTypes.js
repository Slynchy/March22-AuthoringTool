Node.NodeTypes = {
	'nullop'			: Node.Function(
		'-',
		[]
	),
	'narrative'			: Node.Function(
		'Narrative/text',
		[Node.Parameter("Text: ", "text")]
	),
	'drawcharacter'		: Node.Function(
		'Draw character',
		[
            Node.Parameter("Character name: ", "text"),
            Node.Parameter("Emotion name: ", "text"),
            Node.Parameter("X offset: ", "number"),
            Node.Parameter("Skip to next line?: ", "checkbox"),
        ]
	),
	'newpage'			: Node.Function(
		'New page',
		[]
	),
	'hidewindow'		: Node.Function(
		'Hide window',
		[]
	),
	'showwindow'		: Node.Function(
		'Show window',
		[]
	),
	'goto'				: Node.Function(
		'Goto',
		[
            Node.Parameter("Node name/ID: ", "text")
        ]
	),
	'wait'				: Node.Function(
		'Wait',
		[
            Node.Parameter("Milliseconds to wait: ", "number")
        ]
	),
	'enablenovel'		: Node.Function(
		'Enable novel mode',
		[]
	),
	'disablenovel'		: Node.Function(
		'Disable novel mode',
		[]
	),
	'loadscript'		: Node.Function(
		'Load script file',
		[
            Node.Parameter("Script name: ", "text")
        ]
	),
	'makechoice'		: Node.Function(
		'Make decision',
		[
			Node.Parameter("Choice 1: ", "text"),
			Node.Parameter("Choice 2: ", "text"),
			Node.Parameter("Choice 3 (optional): ", "text")
		]
	),
	'm22if'				: Node.Function(
		'If statement',
		[
			Node.Parameter("Flag name: ", "text")
		]
	),
	'setflag'			: Node.Function(
		'Set flag',
		[
            Node.Parameter("Flag to set to true: ", "text")
        ]
	),
	'playvideo'			: Node.Function(
		'Play video',
		[
            Node.Parameter("Video to play: ", "text")
        ]
	),
	'drawbackground'	: Node.Function(
		'Draw background',
		[
            Node.Parameter("Background name: ", "text"),
            Node.Parameter("X offset: ", "number"),
            Node.Parameter("Y offset: ", "number"),
			Node.Parameter("X scale: ", "number"),
			Node.Parameter("Y scale: ", "number"),
			Node.Parameter("Skip to next line?: ", "checkbox")
		]
	),
	'transition'		: Node.Function(
		'Transition',
		[
            Node.Parameter("Background name: ", "text"),
            Node.Parameter("Transition name: ", "text"),
            Node.Parameter("Speed: ", "number"),
            Node.Parameter("In or out?: ", "checkbox")
        ]
	),
	'playmusic'			: Node.Function(
		'Play music',
		[
			Node.Parameter("Track to play: ", "text")
		]
	),
	'stopmusic'			: Node.Function(
		'Stop music',
		[
			Node.Parameter("Speed: ", "number")
		]
	),
	'playsting'			: Node.Function(
		'Play SFX',
		[
			Node.Parameter("SFX to play: ", "text")
		]
	),
	'playloopedsting'	: Node.Function(
		'Play looped SFX',
		[
			Node.Parameter("SFX to play: ", "text"),
			Node.Parameter("Volume: ", "number"),
			Node.Parameter("Fade speed: ", "text")
		]
	),
	'stoploopedsting'	: Node.Function(
		'Stop looped SFX',
		[
			Node.Parameter("SFX to stop: ", "text"),
			Node.Parameter("Stop speed: ", "number")
		]
	),
	'clearcharacters'	: Node.Function(
		'Clear characters',
		[]
	),
	'clearcharacter'	: Node.Function(
		'Clear specific character',
		[
			Node.Parameter("Character name: ", "text"),
			Node.Parameter("Skip to next line?: ", "checkbox")
		]
	),
	'setmovementspeed'	: Node.Function(
		'Set movement speed',
		[
			Node.Parameter("Speed: ", "number")
		]
	),
	'settextspeed'		: Node.Function(
		'Set text speed',
		[
			Node.Parameter("Speed: ", "number")
		]
	),
	'setanimtype'		: Node.Function(
		'Set animation type',
		[
			Node.Parameter("Text: ", "number")
		]
	)
};