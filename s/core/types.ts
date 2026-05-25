
import {Atom} from "./atom/types.js"
import {Action} from "./parts/action.js"

/** json-friendly description of how samples are interpreted */
export type Bindings = {[mode: string]: {[action: string]: Atom}}

/** describes the shape of how bindings relate to the binds index (useful on serverside) */
export type BindingsShape<B extends Bindings> = {[MK in keyof B]: {[AK in keyof B[MK]]: number}}

/** integer-indexed flat map of bindings info (for efficient networking) */
export type BindingsTable<B extends Bindings> = Map<number, BindingsRow<B>>

/** the binding for a single action */
export type BindingsRow<B extends Bindings> = {
	id: number
	mode: keyof B
	action: keyof B[keyof B]
	atom: Atom
}

/** produces user input samples (eg, a keyboard produces samples) */
export type Device = {samples(): Iterable<Sample>}

/** raw user input, eg, `["KeyW", 1]` */
export type Sample = [code: string, value: number]

/** efficiently express resolved values */
export type Intent = [id: number, value: number]

/** ergonomic access to user inputs (your app logic should read from this) */
export type Actions<B extends Bindings> = {
	[M in keyof B]: {
		[A in keyof B[M]]: Action
	}
}

export type AsBindings<B extends Bindings> = {[MK in keyof B]: {[AK in keyof B[MK]]: Atom}}
export const asBindings = <B extends Bindings>(b: B) => (b as AsBindings<B>)

