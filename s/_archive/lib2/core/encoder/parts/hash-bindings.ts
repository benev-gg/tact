
import {hash32} from "@e280/stz"
import {Bindings} from "../../types.js"
import {isExpression} from "../../utils/is-expression.js"

export function hashBindings(bindings: Bindings) {
	const paths: string[] = []

	function recurse(b: Bindings, path: string[]) {
		if (isExpression(b)) {
			paths.push(path.join("."))
		}
		else {
			for (const [key, value] of Object.entries(b))
				recurse(value, [...path, key])
		}
	}

	recurse(bindings, ["b"])
	return hash32(...paths)
}

