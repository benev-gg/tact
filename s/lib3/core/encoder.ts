
import {deepClone, deepFreeze} from "@e280/stz"
import {Intent} from "./data/types.js"
import {Sampler} from "./utils/sampler.js"
import {encodeData} from "./data/encode.js"
import {evaluate} from "./evaluate/evaluate.js"
import {EvaluationContext} from "./evaluate/context.js"
import {investigate} from "./investigate/investigate.js"
import {Bindings, InputData, Rebindings, Source} from "./types.js"

export class InputEncoder<B extends Bindings> {
	#sampler
	#bindings
	#investigation
	#context

	constructor(source: Source, bindings: B) {
		this.#bindings = deepFreeze(deepClone(bindings)) as any as Rebindings<B>
		this.#investigation = investigate(this.#bindings)
		this.#sampler = new Sampler(source)
		this.#context = new EvaluationContext()
	}

	get bindings() {
		return this.#bindings
	}

	set bindings(b: Rebindings<B>) {
		const fresh = investigate(b)

		if (fresh.hash !== this.#investigation.hash)
			throw new Error("incompatible bindings")

		this.#investigation.expressionList = fresh.expressionList
	}

	encode(): InputData {
		this.#context.clock.update()
		const intents: Intent[] = []
		const samples = this.#sampler.take()

		for (const sample of samples) {
			this.#context.sampleValues.set(sample.code, sample.value)

			for (const {id, expression} of this.#relevantExpressions(sample.code)) {
				const value = evaluate(this.#context, expression)
				intents.push({id, value})
			}

			if (sample.mode === "pulsy")
				this.#context.sampleValues.set(sample.code, 0)
		}

		return encodeData(this.#investigation.hash, intents)
	}

	#relevantExpressions(code: string) {
		const indexed = this.#investigation.expressionIndex.get(code)
		return [...indexed ?? []]
	}

	dispose() {
		return this.#sampler.dispose()
	}
}

