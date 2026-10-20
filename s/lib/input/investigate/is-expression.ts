
import {isArray, isNumber, isString} from "@e280/stz"
import type {Bindings} from "../types.js"
import type {Expression} from "../expression.js"

export function isExpression(b: Bindings): b is Expression {
	if (isString(b)) return true
	if (isNumber(b)) return true
	if (isArray(b)) return true
	return false
}

