
import {obMap} from "@e280/stz"
import {makeInput} from "./make-input.js"
import {hashBindings} from "./hash-bindings.js"
import {isExpression} from "../../utils/is-expression.js"
import {makeExpressionIndex} from "./expression-index.js"
import {Bindings, Expression, Input, Inputs} from "../../types.js"

export function investigate<B extends Bindings>(bindings: B) {
	const hash = hashBindings(bindings)
	const inputList: Input[] = []
	const expressionList: Expression[] = []

	function makeInputs(b: Bindings): unknown {
		if (isExpression(b)) {
			const input = makeInput()
			inputList.push(input)
			expressionList.push(b)
			return input
		}
		else {
			return obMap(b, makeInputs)
		}
	}

	const inputs = makeInputs(bindings) as Inputs<B>
	const expressionIndex = makeExpressionIndex(expressionList)

	return {
		hash,
		inputs,
		inputList,
		expressionList,
		expressionIndex,
	}
}

