
import {obMap} from "@e280/stz"
import {makeInput} from "./make-input.js"
import {hashBindings} from "./hash-bindings.js"
import {isExpression} from "./is-expression.js"
import {Bindings, Expression, Input, Inputs} from "../types.js"
import {makeRootIndex as makeRootIndex} from "./expression-index.js"

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
			return obMap(b, makeInputs)
		}
	}

	const inputs = makeInputs(bindings) as Inputs<B>
	const rootIndex = makeRootIndex(rootList)

	return {
		hash,
		inputs,
		inputList,
		rootList,
		rootIndex,
	}
}

