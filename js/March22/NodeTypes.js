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
            Node.Parameter("Node name: ", "text")
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
		[]
	),
	'm22if'				: Node.Function(
		'If statement',
		[]
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
		[]
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
		[]
	),
	'stopmusic'			: Node.Function(
		'Stop music',
		[]
	),
	'playsting'			: Node.Function(
		'Play SFX',
		[]
	),
	'playloopedsting'	: Node.Function(
		'Play looped SFX',
		[]
	),
	'stoploopedsting'	: Node.Function(
		'Stop looped SFX',
		[]
	),
	'clearcharacters'	: Node.Function(
		'Clear characters',
		[]
	),
	'clearcharacter'	: Node.Function(
		'Clear specific character',
		[]
	),
	'setmovementspeed'	: Node.Function(
		'Set movement speed',
		[]
	),
	'settextspeed'		: Node.Function(
		'Set text speed',
		[]
	),
	'setanimtype'		: Node.Function(
		'Set animation type',
		[]
	)
};