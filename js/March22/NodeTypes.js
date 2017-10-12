Node.NodeTypes = {
	'nullop'			: Node.Function(
		'-',
		[]
	),
	'narrative'			: Node.Function(
		'Narrative/text',
		[Node.Parameter("Text: ", "text")]
	),
	'DrawCharacter'		: Node.Function(
		'Draw character',
		[
            Node.Parameter("Character name: ", "text"),
            Node.Parameter("Emotion name: ", "text"),
            Node.Parameter("X offset: ", "number"),
            Node.Parameter("Skip to next line?: ", "checkbox"),
		],
		{
			startOfNode : '',
			endOfNode : '',
			level : 0,
			shape : 'diamond',
			color : { background: '#BB1010' }
		}
	),
	'NewPage'			: Node.Function(
		'New page',
		[]
	),
	'HideWindow'		: Node.Function(
		'Hide window',
		[]
	),
	'ShowWindow'		: Node.Function(
		'Show window',
		[]
	),
	'Goto'				: Node.Function(
		'Goto',
		[
            Node.Parameter("Node name/ID: ", "text")
        ]
	),
	'Wait'				: Node.Function(
		'Wait',
		[
            Node.Parameter("Milliseconds to wait: ", "number")
        ]
	),
	'EnableNovelMode'		: Node.Function(
		'Enable novel mode',
		[]
	),
	'DisableNovelMode'		: Node.Function(
		'Disable novel mode',
		[]
	),
	'LoadScript'		: Node.Function(
		'Load script file',
		[
            Node.Parameter("Script name: ", "text")
        ]
	),
	'MakeDecision'		: Node.Function(
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
	'SetFlag'			: Node.Function(
		'Set flag',
		[
            Node.Parameter("Flag to set to true: ", "text")
        ]
	),
	'PlayVideo'			: Node.Function(
		'Play video',
		[
            Node.Parameter("Video to play: ", "text")
        ]
	),
	'DrawBackground'	: Node.Function(
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
	'Transition'		: Node.Function(
		'Transition',
		[
            Node.Parameter("Background name: ", "text"),
            Node.Parameter("Transition name: ", "text"),
            Node.Parameter("Speed: ", "number"),
            Node.Parameter("In or out?: ", "checkbox")
        ]
	),
	'PlayMusic'			: Node.Function(
		'Play music',
		[
			Node.Parameter("Track to play: ", "text")
		]
	),
	'StopMusic'			: Node.Function(
		'Stop music',
		[
			Node.Parameter("Speed: ", "number")
		]
	),
	'PlaySting'			: Node.Function(
		'Play SFX',
		[
			Node.Parameter("SFX to play: ", "text")
		]
	),
	'PlayLoopedSting'	: Node.Function(
		'Play looped SFX',
		[
			Node.Parameter("SFX to play: ", "text"),
			Node.Parameter("Volume: ", "number"),
			Node.Parameter("Fade speed: ", "text")
		]
	),
	'StopLoopedSting'	: Node.Function(
		'Stop looped SFX',
		[
			Node.Parameter("SFX to stop: ", "text"),
			Node.Parameter("Stop speed: ", "number")
		]
	),
	'ClearCharacters'	: Node.Function(
		'Clear characters',
		[]
	),
	'ClearCharacter'	: Node.Function(
		'Clear specific character',
		[
			Node.Parameter("Character name: ", "text"),
			Node.Parameter("Skip to next line?: ", "checkbox")
		]
	),
	'SetMovementSpeed'	: Node.Function(
		'Set movement speed',
		[
			Node.Parameter("Speed: ", "number")
		]
	),
	'SetTextSpeed'		: Node.Function(
		'Set text speed',
		[
			Node.Parameter("Speed: ", "number")
		]
	),
	'SetAnimType'		: Node.Function(
		'Set animation type',
		[
			Node.Parameter("Text: ", "number")
		]
	)
};