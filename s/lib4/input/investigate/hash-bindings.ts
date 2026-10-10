
import {hash32} from "@e280/stz"
import {Bindings} from "../types.js"
import {isRootExpression} from "./is.js"

export function hashBindings(bindings: Bindings) {
	const paths: string[] = []

	function recurse(b: Bindings, path: string[]) {
		if (isRootExpression(b)) {
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

