Node.NodeTypes = {
	'nullop'			: Node.Function(
		'-',
		[]
	),
	'narrative'			: Node.Function(
		'Narrative/text',
		[Node.Parameter("Text: ", "text")],
		{
			shape : 'ellipsis'
		}
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
			shape : 'diamond',
			color : { background: '#BB1010' }
		}
	),
	'NewPage'			: Node.Function(
		'New page',
		[],
		{
			shape : 'diamond',
			color : { background: '#BB1010' }
		}
	),
	'HideWindow'		: Node.Function(
		'Hide window',
		[],
		{
			shape : 'diamond',
			color : { background: '#BB1010' }
		}
	),
	'ShowWindow'		: Node.Function(
		'Show window',
		[],
		{
			shape : 'diamond',
			color : { background: '#BB1010' }
		}
	),
	'Goto'				: Node.Function(
		'Goto',
		[
            Node.Parameter("Node name/ID: ", "text")
        ],
		{
			shape : 'diamond',
			color : { background: '#BB1010' }
		}
	),
	'Wait'				: Node.Function(
		'Wait',
		[
            Node.Parameter("Milliseconds to wait: ", "number")
        ],
		{
			shape : 'diamond',
			color : { background: '#BB1010' }
		}
	),
	'EnableNovelMode'		: Node.Function(
		'Enable novel mode',
		[],
		{
			shape : 'diamond',
			color : { background: '#BB1010' }
		}
	),
	'DisableNovelMode'		: Node.Function(
		'Disable novel mode',
		[],
		{
			shape : 'diamond',
			color : { background: '#BB1010' }
		}
	),
	'LoadScript'		: Node.Function(
		'Load script file',
		[
            Node.Parameter("Script name: ", "text")
        ],
		{
			shape : 'diamond',
			color : { background: '#BB1010' }
		}
	),
	'MakeDecision'		: Node.Function(
		'Make decision',
		[
			Node.Parameter("Choice 1: ", "text"),
			Node.Parameter("Choice 2: ", "text"),
			Node.Parameter("Choice 3 (optional): ", "text")
		],
		{
			shape : 'diamond',
			color : { background: '#BB1010' }
		}
	),
	'm22if'				: Node.Function(
		'If statement',
		[
			Node.Parameter("Flag name: ", "text")
		],
		{
			shape : 'diamond',
			color : { background: '#BB1010' }
		}
	),
	'SetFlag'			: Node.Function(
		'Set flag',
		[
            Node.Parameter("Flag to set to true: ", "text")
        ],
		{
			shape : 'diamond',
			color : { background: '#BB1010' }
		}
	),
	'PlayVideo'			: Node.Function(
		'Play video',
		[
            Node.Parameter("Video to play: ", "text")
        ],
		{
			shape : 'diamond',
			color : { background: '#BB1010' }
		}
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
		],
		{
			shape : 'diamond',
			color : { background: '#BB1010' }
		}
	),
	'Transition'		: Node.Function(
		'Transition',
		[
            Node.Parameter("Background name: ", "text"),
            Node.Parameter("Transition name: ", "text"),
            Node.Parameter("Speed: ", "number"),
            Node.Parameter("In or out?: ", "checkbox")
        ],
		{
			shape : 'diamond',
			color : { background: '#BB1010' }
		}
	),
	'PlayMusic'			: Node.Function(
		'Play music',
		[
			Node.Parameter("Track to play: ", "text")
		],
		{
			shape : 'diamond',
			color : { background: '#BB1010' }
		}
	),
	'StopMusic'			: Node.Function(
		'Stop music',
		[
			Node.Parameter("Speed: ", "number")
		],
		{
			shape : 'diamond',
			color : { background: '#BB1010' }
		}
	),
	'PlaySting'			: Node.Function(
		'Play SFX',
		[
			Node.Parameter("SFX to play: ", "text")
		],
		{
			shape : 'diamond',
			color : { background: '#BB1010' }
		}
	),
	'PlayLoopedSting'	: Node.Function(
		'Play looped SFX',
		[
			Node.Parameter("SFX to play: ", "text"),
			Node.Parameter("Volume: ", "number"),
			Node.Parameter("Fade speed: ", "text")
		],
		{
			shape : 'diamond',
			color : { background: '#BB1010' }
		}
	),
	'StopLoopedSting'	: Node.Function(
		'Stop looped SFX',
		[
			Node.Parameter("SFX to stop: ", "text"),
			Node.Parameter("Stop speed: ", "number")
		],
		{
			shape : 'diamond',
			color : { background: '#BB1010' }
		}
	),
	'ClearCharacters'	: Node.Function(
		'Clear characters',
		[],
		{
			shape : 'diamond',
			color : { background: '#BB1010' }
		}
	),
	'ClearCharacter'	: Node.Function(
		'Clear specific character',
		[
			Node.Parameter("Character name: ", "text"),
			Node.Parameter("Skip to next line?: ", "checkbox")
		],
		{
			shape : 'diamond',
			color : { background: '#BB1010' }
		}
	),
	'SetMovementSpeed'	: Node.Function(
		'Set movement speed',
		[
			Node.Parameter("Speed: ", "number")
		],
		{
			shape : 'diamond',
			color : { background: '#BB1010' }
		}
	),
	'SetTextSpeed'		: Node.Function(
		'Set text speed',
		[
			Node.Parameter("Speed: ", "number")
		],
		{
			shape : 'diamond',
			color : { background: '#BB1010' }
		}
	),
	'SetAnimType'		: Node.Function(
		'Set animation type',
		[
			Node.Parameter("Text: ", "number")
		],
		{
			shape : 'diamond',
			color : { background: '#BB1010' }
		}
	)
};