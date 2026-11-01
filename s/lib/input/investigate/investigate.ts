
import {obmap} from "@e280/stz"
import {makeInput} from "./make-input.js"
import {Expression} from "../expression.js"
import {hashBindings} from "./hash-bindings.js"
import {isExpression} from "./is-expression.js"
import {Bindings, Input, Inputs} from "../types.js"
import {minihash} from "../data/intent/minihash.js"

export function investigate<B extends Bindings>(bindings: B) {
	const hash = hashBindings(bindings)

	const leaves: {
		path: string
		input: Input
		expression: Expression
	}[] = []

	function makeInputs(b: Bindings, path: string[]): unknown {
		if (isExpression(b)) {
			const input = makeInput()
			leaves.push({
				path: JSON.stringify(path),
				input,
				expression: b,
			})
			return input
		}
		else {
			return obmap(b, (value, key) =>
				makeInputs(value, [...path, key as string])
			)
		}
	}

	const inputs = makeInputs(bindings, ["b"]) as Inputs<B>

	leaves.sort((a, b) =>
		a.path < b.path ? -1 : a.path > b.path ? 1 : 0
	)

	return {
		hash,
		minihash: minihash(hash),
		inputs,
		inputList: leaves.map(l => l.input),
		rootList: leaves.map(l => l.expression),
	}
}

