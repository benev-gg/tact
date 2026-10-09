
import {isArray, isNumber, isString} from "@e280/stz"
import {Bindings, Expression} from "../../types.js"

export function isExpression(b: Bindings): b is Expression {
	if (isString(b)) return true
	if (isNumber(b)) return true
	if (isArray(b)) return true
	return false
}

