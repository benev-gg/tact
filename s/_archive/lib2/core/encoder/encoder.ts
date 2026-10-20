
import {deep} from "@e280/stz"
import {Sampler} from "./parts/sampler.js"
import {evaluate} from "./evaluate/evaluate.js"
import {investigate} from "./parts/investigate.js"
import {encodeData, Intention} from "../utils/data.js"
import {EvaluationContext} from "./evaluate/context.js"
import {Bindings, InputData, Rebindings, Source} from "../types.js"

export class InputEncoder<B extends Bindings> {
	#sampler
	#bindings
	#investigation
	#context

	constructor(source: Source, bindings: B) {
		this.#bindings = deep.freeze(deep.clone(bindings)) as any as Rebindings<B>
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
		this.#context.start()
		const intentions: Intention[] = []
		const samples = this.#sampler.take()

		for (const sample of samples) {
			this.#context.update(sample)

			const indexed = this.#investigation.expressionIndex.get(sample.code)
			const expressions = [...indexed ?? []]

			for (const {id, expression} of expressions) {
				const value = evaluate(this.#context, expression)
				intentions.push({id, value})
			}
		}

		return encodeData(this.#investigation.hash, intentions)
	}

	dispose() {
		return this.#sampler.dispose()
	}
}

