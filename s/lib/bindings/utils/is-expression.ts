
import {is} from "@e280/stz"
import {Bindings} from "../types.js"

export function isExpression(b: Bindings) {
	if (is.string(b)) return true
	if (is.number(b)) return true
	if (is.array(b)) return true
	return false
}

