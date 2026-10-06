
import {Action, Intent} from "../types.js"
import {decodeIntent} from "./intent-coding.js"

export class ActionResolver {
	resolve(hash: number, actions: Action[], intent: Intent) {
		const decoded = decodeIntent(intent)

		if (decoded.hash !== hash)
			throw new Error("intent bindings hash mismatch")

		for (const action of actions) {
			action.previous = action.value

			action.change = 0
			action.down = 0
			action.up = 0

			action.lowest = action.value
			action.highest = action.value
		}

		for (const {id, value} of decoded.intentions) {
			const action = actions[id]

			if (!action)
				throw new Error(`unknown action id ${id}`)

			this.#apply(action, value)
		}
	}

	#apply(action: Action, value: number) {
		const previous = action.value

		action.value = value
		action.lowest = Math.min(action.lowest, value)
		action.highest = Math.max(action.highest, value)

		if (value !== previous)
			action.change = 1

		if (previous <= 0 && value > 0)
			action.down = 1

		if (previous > 0 && value <= 0)
			action.up = 1
	}
}

