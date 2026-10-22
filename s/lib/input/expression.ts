
export type Expression = (
	| number // constants for doing math.

	// samplers
	| string // use last-known sample value for a code like "KeyW", "pointer.move.up".
	| ["sum", string] // sum values this frame.
	| ["up", string] // count releases this frame.
	| ["down", string] // count presses this frame.
	| ["was", string] // get previously known value from before this frame.
	| ["since", string] // get change in value since previous frame.

	// logic
	| ["if", condition: Expression, yes: Expression, no?: Expression]

	// combiners
	| ["min", ...Expression[]]
	| ["max", ...Expression[]]
	| ["+", ...Expression[]]
	| ["*", ...Expression[]]

	// comparisons
	| ["==", Expression, Expression]
	| ["!=", Expression, Expression]
	| [">", Expression, Expression]
	| ["<", Expression, Expression]
	| [">=", Expression, Expression]
	| ["<=", Expression, Expression]

	// transforms
	| ["!", Expression]
	| ["!!", Expression]
	| ["clamp", low: Expression | null, high: Expression | null, subject: Expression]
	| ["remap", inLow: Expression, inHigh: Expression, outLow: Expression, outHigh: Expression, subject: Expression]

	// temporal
	| ["dt"] // delta time in seconds since last frame, useful for stick sensitivity.
	| ["held", ms: number, Expression]
	| ["taps", taps: number, ms: number, Expression]
)

