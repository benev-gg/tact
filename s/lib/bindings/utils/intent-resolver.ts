
import {Evaluator} from "./evaluator.js"
import {Sample} from "../../sampling/types.js"
import {Expression, Intent} from "../types.js"
import {encodeIntent} from "./intent-coding.js"
import {forFreshness} from "./intent/for-freshness.js"

export class IntentResolver {
	#last: number | undefined
	#evaluator = new Evaluator()
	#previousEvaluationResults: number[] | undefined

	/** compute bindings dsl against sample history, producing intent bytes that are good for netcode. */
	resolve(hash: number, expressionlist: Expression[], samples: Sample[], now: number): Intent {
		const evaluator = this.#evaluator
		const intentions: {id: number, value: number}[] = []
		const {last, since} = this.#updateLast(now)

		// filter out old samples
		samples = samples.filter(forFreshness(last))

		// initialize previous with zeros
		if (!this.#previousEvaluationResults)
			this.#previousEvaluationResults = expressionlist.map(() => 0)

		// update evaluator
		evaluator.update(since, samples)

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

	#updateLast(now: number) {
		const last = this.#last
		this.#last = now
		const since = (last !== undefined)
			? now - last
			: 0
		return {last, since}
	}
}

