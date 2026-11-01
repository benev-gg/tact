
import {hex} from "@e280/stz"
import {Bindings} from "../types.js"
import {hash} from "../../utils/hash.js"
import {isExpression} from "./is-expression.js"

export function hashBindings(bindings: Bindings) {
	const paths: string[] = []

	function recurse(b: Bindings, path: string[]) {
		if (isExpression(b)) {
			paths.push(JSON.stringify(path))
		}
		else {
			for (const [key, value] of Object.entries(b))
				recurse(value, [...path, key])
		}
	}

	recurse(bindings, ["b"])
	paths.sort()
	return hex(hash(...paths).slice(16))
}

