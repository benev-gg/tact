
import {guarantee, isArray, isString} from "@e280/stz"
import {RootExpression} from "../types.js"

export function makeRootIndex(rootList: RootExpression[]) {
	type Code = string
	const rootIndex = new Map<Code, Set<{id: number, root: RootExpression}>>()

	function recurse(id: number, root: RootExpression, e: RootExpression) {
		if (isString(e)) {
			guarantee(rootIndex, e, () => new Set())
				.add({id, root})
		}
		else if (isArray(e)) {
			for (const sub of e.slice(1))
				if (sub !== null)
					recurse(id, root, sub)
		}
	}

	for (const [id, root] of rootList.entries())
		recurse(id, root, root)

	return rootIndex
}

