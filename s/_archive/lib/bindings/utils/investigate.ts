
import {obMap} from "@e280/stz"
import {isExpression} from "./is-expression.js"
import {hashBindings} from "./hash-bindings.js"
import {Action, Actions, Bindings, Expression} from "../types.js"

export function investigateBindings<B extends Bindings>(bindings: B) {
	const hash = hashBindings(bindings)
	const expressionlist: Expression[] = []
	const actionlist: Action[] = []

	function makeActions(b: Bindings): unknown {
		if (isExpression(b)) {
			const action = makeAction()
			expressionlist.push(b)
			actionlist.push(action)
			return action
		}
		else {
			return obMap(b, makeActions)
		}
	}

	const actions = makeActions(bindings) as Actions<B>

	return {
		hash,
		actions,
		expressionlist,
		actionlist,
	}
}

function makeAction(): Action {
	return {
		value: 0,
		previous: 0,

		change: 0,
		down: 0,
		up: 0,

		lowest: 0,
		highest: 0,
	}
}

