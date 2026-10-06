
export type Intent = ArrayBuffer

/** schema and dsl for controls and keybinds. */
export type Bindings = Expression | {
	[key: string]: Bindings
}

export type Rebindings<B extends Bindings> = (
	B extends Expression
		? Expression
		: B extends {[key: string]: Bindings}
			? {[K in keyof B]: Rebindings<B[K]>}
			: never
)

export type Expression = (
	| string // a code like "KeyW", "pointer.move.up"
	| number // constants for doing math

	// combiners
	| ["min", ...Expression[]]
	| ["max", ...Expression[]]
	| ["+", ...(Expression | number)[]]
	| ["*", ...(Expression | number)[]]

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
	| ["clamp", a: Expression | null, b: Expression | null, Expression]
	| ["remap", [a: Expression, b: Expression], [c: Expression, d: Expression], Expression]

	// temporal
	| ["dt"] // delta time in seconds since last resolve, used for stick sensitivity
	| ["accumulate", Expression] // sum all values of this expression since last resolve
	| ["tapped", ms: number, taps: number, Expression]
	| ["held", ms: number, Expression]
)

export type Action = {
	value: number // latest-known value
	previous: number // previously-known value

	change: number // how many times the value has changed since previous resolve
	up: number // how many times this button has been released since previous resolve
	down: number // how many times this button has been pressed since previous resolve

	lowest: number // lowest value since we last checked
	highest: number // highest value since we last checked
}

export type Actions<B extends Bindings = any> = (
	B extends Expression
		? Action
		: B extends {[key: string]: Bindings}
			? {[K in keyof B]: Actions<B[K]>}
			: never
)

