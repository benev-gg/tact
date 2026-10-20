
import {Bindings} from "../types.js"
import {hashBindings} from "./hash-bindings.js"

export function isCompatible(bindingsA: Bindings, bindingsB: Bindings) {
	return hashBindings(bindingsA) === hashBindings(bindingsB)
}

