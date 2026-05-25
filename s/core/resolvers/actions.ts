
import {need, obMap} from "@e280/stz"
import {Action} from "../parts/action.js"
import {bindingsShape} from "../bindings/shape.js"
import {Actions, Bindings, Intent} from "../types.js"

export function makeActionsResolver<B extends Bindings>(bindings: B) {
	const shape = bindingsShape(bindings)
	const map = new Map<number, Action>()

	const actions = obMap(shape, bracket => obMap(bracket, id => {
		const action = new Action()
		map.set(id, action)
		return action
	})) as Actions<B>

	return (intents: Intent[]) => {
		for (const action of map.values())
			action.changed = false

		for (const [id, value] of intents) {
			const action = need(map, id)
			action.changed = action.value !== value
			action.value = value
		}

		return actions
	}
}

