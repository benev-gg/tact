
import {Evaluator} from "./evaluator.js"
import {Sample} from "../../sampling/types.js"
import {Expression, Intent} from "../types.js"
import {encodeIntent} from "./intent-coding.js"

export class IntentResolver {
	#seen: Sample | undefined
	#evaluator = new Evaluator()
	#previousEvaluationResults: number[] | undefined

	/** compute bindings dsl against sample history, producing intent bytes that are good for netcode. */
	resolve(hash: number, expressionlist: Expression[], samples: Sample[], now: number): Intent {
		const evaluator = this.#evaluator
		const intentions: {id: number, value: number}[] = []

		// initialize previous with zeros
		if (!this.#previousEvaluationResults)
			this.#previousEvaluationResults = expressionlist.map(() => 0)

		// update evaluator
		evaluator.update(now, this.#selectFresh(samples))

		// evaluate, and save values that changed
		for (const [id, expression] of expressionlist.entries()) {
			const previous = this.#previousEvaluationResults[id]
			const current = evaluator.evaluate(expression)
			this.#previousEvaluationResults[id] = current
			if (current !== previous)
				intentions.push({id, value: current})
		}

		return encodeIntent(hash, intentions)
	}

	#selectFresh(samples: Sample[]) {
		if (this.#seen) {
			const index = samples.indexOf(this.#seen)

			if (index === -1)
				throw new Error("sample history gap")

			samples = samples.slice(index + 1)
		}

		if (samples.length)
			this.#seen = samples.at(-1)

		return samples
	}
}

