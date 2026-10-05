
/** schema and dsl for controls and keybinds. */
export type Bindings = Expression | {
	[key: string]: Bindings
}

export type Expression = (
	| string // a code like "KeyW", "pointer.move.up"
	| number // constants for doing math

	// combiners
	| ["min", ...Expression[]]
	| ["max", ...Expression[]]
	| ["+", ...(Expression | number)[]]
	| ["*", ...(Expression | number)[]]

	// comparisons
	| [">", Expression, Expression]
	| ["<", Expression, Expression]
	| [">=", Expression, Expression]
	| ["<=", Expression, Expression]

	// transforms
	| ["clamp", a: Expression | null, b: Expression | null, Expression]
	| ["remap", [a: Expression, b: Expression], [c: Expression, d: Expression], Expression]

	// temporal
	| ["accumulated", Expression]
	| ["tapped", ms: number, taps: number, Expression]
	| ["held", ms: number, Expression]
)

export type Action = {
	readonly value: number // latest-known value
	readonly previous: boolean // previously-known value

	readonly lowest: boolean // lowest value since we last checked
	readonly highest: boolean // highest value since we last checked

	readonly change: number // how many times the value has changed since previous resolve
	readonly up: number // how many times this button has been released since previous resolve
	readonly down: number // how many times this button has been pressed since previous resolve
}

export type Actions<B extends Bindings = any> = (
	B extends Expression
		? Action
		: B extends {[key: string]: Bindings}
			? {[K in keyof B]: Actions<B[K]>}
			: never
)

