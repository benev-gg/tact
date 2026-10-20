
import type {Expression} from "./expression.js"

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

	/** change in value since the previously-known value. */
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

