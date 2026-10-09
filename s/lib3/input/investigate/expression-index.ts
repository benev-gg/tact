
import {guarantee, isArray, isString} from "@e280/stz"
import {Expression} from "../types.js"

export function makeExpressionIndex(expressionlist: Expression[]) {
	type Code = string
	type Info = {id: number, expression: Expression}
	const expressionIndex = new Map<Code, Set<Info>>()

	function recurse(info: {id: number, expression: Expression}, e: Expression) {
		if (isString(e)) {
			guarantee(expressionIndex, e, () => new Set())
				.add(info)
		}
		else if (isArray(e)) {
			for (const sub of e.slice(1))
				if (sub !== null)
					recurse(info, sub)
		}
	}

	for (const [id, expression] of expressionlist.entries())
		recurse({id, expression}, expression)

	return expressionIndex
}

