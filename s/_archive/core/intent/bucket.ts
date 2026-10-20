
import {Intent} from "../types.js"

/** merge/accumulate intents together */
export class IntentBucket {
	#state = new Map<number, number>()
	#changes = new Map<number, number>()

	accumulate(intents: Intent[]) {
		for (const [id, value] of intents) {
			const previous = this.#state.get(id)

			if (previous !== value) {
				this.#state.set(id, value)
				this.#changes.set(id, value)
			}
		}

		return this
	}

	take() {
		const intents = [...this.#changes.entries()]
		this.#changes.clear()
		return intents
	}
}

