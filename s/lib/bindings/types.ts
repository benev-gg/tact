
/** dsl for controls and keybinds. */
export type Bindings = Expression | {
	[key: string]: Bindings
}

export type Actions = {}

export type Expression = (
	| string // a code like "KeyW", "pointer.move.up"
	| number // constants for doing math

	// core behavior
	| ["accumulate", Expression] // add samples together, instead of using latest

	// combiners
	| ["min", ...Expression[]]
	| ["max", ...Expression[]]
	| ["sum", ...(Expression | number)[]]
	| ["mul", ...(Expression | number)[]]
	| ["if", condition: Expression, yes: Expression, no?: Expression]

	// transforms
	| ["nonzero", Expression]
	| ["clamp", a: Expression | null, b: Expression | null, Expression]
	| ["remap", [a: Expression, b: Expression], [c: Expression, d: Expression], Expression]

	// comparisons
	| ["gt", Expression, Expression]
	| ["lt", Expression, Expression]

	// temporal
	| ["tapped", ms: number, taps: number, Expression]
	| ["held", ms: number, Expression]
)

