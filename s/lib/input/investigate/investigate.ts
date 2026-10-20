
import {obmap} from "@e280/stz"
import {makeInput} from "./make-input.js"
import {Expression} from "../expression.js"
import {hashBindings} from "./hash-bindings.js"
import {isExpression} from "./is-expression.js"
import {Bindings, Input, Inputs} from "../types.js"

export function investigate<B extends Bindings>(bindings: B) {
	const hash = hashBindings(bindings)
	const inputList: Input[] = []
	const rootList: Expression[] = []

	function makeInputs(b: Bindings): unknown {
		if (isExpression(b)) {
			const input = makeInput()
			inputList.push(input)
			rootList.push(b)
			return input
		}
		else {
			return obmap(b, makeInputs)
		}
	}

	const inputs = makeInputs(bindings) as Inputs<B>

	return {
		hash,
		inputs,
		inputList,
		rootList,
	}
}

