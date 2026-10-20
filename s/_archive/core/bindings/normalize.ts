
import {deep, is} from "@e280/stz"
import {Bindings} from "../types.js"

export function normalizeBindings<B extends Bindings>(
		standard: B,
		suspect: any,
	): B {

	const fresh = deep.clone(standard)

	if (!is.object(suspect))
		return fresh

	for (const [modeName, freshBracket] of Object.entries(fresh)) {
		const suspectBracket = suspect[modeName]
		if (!is.object(suspectBracket)) continue

		for (const [actionName, freshAtom] of Object.entries(freshBracket)) {
			const suspectAtom = suspectBracket[actionName]
			freshBracket[actionName] = suspectAtom ?? freshAtom
		}
	}

	return fresh
}

