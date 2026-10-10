
import {guarantee, isArray, isString} from "@e280/stz"
import {RootExpression} from "../types.js"

export function makeRootIndex(rootList: RootExpression[]) {
	type Code = string
	const rootIndex = new Map<Code, Set<RootExpression>>()

	function recurse(root: RootExpression, e: RootExpression) {
		if (isString(e)) {
			guarantee(rootIndex, e, () => new Set())
				.add(root)
		}
		else if (isArray(e)) {
			for (const sub of e.slice(1))
				if (sub !== null)
					recurse(root, sub)
		}
	}

	for (const root of rootList)
		recurse(root, root)

	return rootIndex
}

