
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

	/** value - was */
	delta: number
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
	| null // indicate no change.
	| number // constants for doing math.

	// special
	| ["accumulate", Expression] // add each frame's result to a running total.

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
	| ["taps", taps: number, ms: number, Expression]
	| ["held", ms: number, Expression]
)

