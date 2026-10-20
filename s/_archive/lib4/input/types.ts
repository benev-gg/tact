
export type Sample = {
	code: string
	value: number
}

export type Source = {
	readonly onSample: (fn: (sample: Sample) => void) => () => void
	readonly dispose: () => void
	readonly poll?: () => void
}

export type Intent = {id: number, value: number}

export type InputData = ArrayBuffer

export type Input = {

	/** latest-known value. */
	value: number

	/** previously-known value. */
	was: number

	/** sum of values in batch. */
	pulses: number

	/** number of times this value has changed in this batch. */
	change: number

	/** number of changes to up in this batch. */
	up: number

	/** number of changes to down in this batch. */
	down: number

	/** lowest value in batch. */
	lowest: number | null

	/** highest value in batch. */
	highest: number | null
}

export type Inputs<B extends Bindings = any> = (
	B extends Expression
		? Input
		: B extends {[key: string]: Bindings}
			? {[K in keyof B]: Inputs<B[K]>}
			: never
)

export type Bindings = RootExpression | {
	[key: string]: Bindings
}

export const asBindings = <B extends Bindings>(bindings: B) => (bindings as any as Rebindings<B>)

export type Rebindings<B extends Bindings> = (
	B extends Expression
		? Expression
		: B extends {[key: string]: Bindings}
			? {[K in keyof B]: Rebindings<B[K]>}
			: never
)

export type RootExpression =
	| ["delta", Expression] // values represent an amount of change, every event is respected.
	| Expression // values represent final state, non-changes are discarded.

export type Expression = (
	| number // constants for doing math.
	| string // use last-known sample value for a code like "KeyW", "pointer.move.up".

	// special
	| ["pulse", string] // use current sample's value, or zero.

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
	| ["clamp", low: Expression | null, high: Expression | null, Expression]
	| ["remap", inLow: Expression, inHigh: Expression, outLow: Expression, outHigh: Expression, Expression]

	// temporal
	| ["dt"] // delta time in seconds since last resolve, used for stick sensitivity
	| ["taps", taps: number, ms: number, Expression]
	| ["held", ms: number, Expression]
)

