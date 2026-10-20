
import {isArray, isNumber, isString} from "@e280/stz"
import {Bindings, Expression, RootExpression} from "../types.js"

export function isRootExpression(b: Bindings): b is RootExpression {
	if (isString(b)) return true
	if (isNumber(b)) return true
	if (isArray(b)) return true
	return false
}

export function isDeltaRoot(root: RootExpression) {
	return isArray(root) && root[0] === "delta"
}

export function isExpression(b: Bindings): b is Expression {
	return isRootExpression(b) && !isDeltaRoot(b)
}

