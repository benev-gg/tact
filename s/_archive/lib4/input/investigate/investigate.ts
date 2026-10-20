
import {obMap} from "@e280/stz"
import {isRootExpression} from "./is.js"
import {makeInput} from "./make-input.js"
import {hashBindings} from "./hash-bindings.js"
import {makeRootIndex as makeRootIndex} from "./root-index.js"
import {Bindings, Input, Inputs, RootExpression} from "../types.js"

export function investigate<B extends Bindings>(bindings: B) {
	const hash = hashBindings(bindings)
	const inputList: Input[] = []
	const rootList: RootExpression[] = []

	function makeInputs(b: Bindings): unknown {
		if (isRootExpression(b)) {
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

