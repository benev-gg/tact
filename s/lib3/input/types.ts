
export type Sample = {
	code: string
	value: number
	mode: "sticky" | "pulse"
}

export type Source = {
	readonly onSample: (fn: (sample: Sample) => void) => () => void
	readonly dispose: () => void
}

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

export type Bindings = Expression | {
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
	| ["clamp", low: Expression | null, high: Expression | null, Expression]
	| ["remap", inLow: Expression, inHigh: Expression, outLow: Expression, outHigh: Expression, Expression]

	// temporal
	| ["dt"] // delta time in seconds since last resolve, used for stick sensitivity
	| ["taps", taps: number, ms: number, Expression]
	| ["held", ms: number, Expression]
)

