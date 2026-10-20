
import {is} from "@e280/stz"
import {Bindings, Expression} from "../types.js"

export function isExpression(b: Bindings): b is Expression {
	if (is.string(b)) return true
	if (is.number(b)) return true
	if (is.array(b)) return true
	return false
}

