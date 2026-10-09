
import {guarantee, isArray, isString} from "@e280/stz"
import {Expression} from "../types.js"

export function makeRootIndex(rootList: Expression[]) {
	type Code = string
	type Info = {id: number, root: Expression}
	const rootIndex = new Map<Code, Set<Info>>()

	function recurse(info: {id: number, root: Expression}, e: Expression) {
		if (isString(e)) {
			guarantee(rootIndex, e, () => new Set())
				.add(info)
		}
		else if (isArray(e)) {
			for (const sub of e.slice(1))
				if (sub !== null)
					recurse(info, sub)
		}
	}

	for (const [id, root] of rootList.entries())
		recurse({id, root}, root)

	return rootIndex
}

