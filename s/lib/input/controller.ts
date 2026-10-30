
import {deepFreeze} from "@e280/stz"
import {Sampler} from "./utils/sampler.js"
import {Intent} from "./data/intent/types.js"
import {evaluate} from "./evaluate/evaluate.js"
import {encodeIntents} from "./data/intent/encode.js"
import {Bindings, Rebindings, Source} from "./types.js"
import {EvaluationContext} from "./evaluate/context.js"
import {investigate} from "./investigate/investigate.js"

export class Controller<B extends Bindings = any> {
	#sampler
	#bindings: Rebindings<B>
	#investigation
	#context

	constructor(options: {source: Source, bindings: B}) {
		this.#bindings = deepFreeze(structuredClone(options.bindings)) as any as Rebindings<B>
		this.#investigation = investigate(this.#bindings)
		this.#sampler = new Sampler(options.source)
		this.#context = new EvaluationContext()
	}

	get bindings() {
		return this.#bindings
	}

	set bindings(b: Rebindings<B>) {
		const bindings = deepFreeze(structuredClone(b)) as Rebindings<B>
		const fresh = investigate(bindings)
		const goodHash = this.#investigation.hash

		if (fresh.hash !== goodHash)
			throw new Error("incompatible bindings")

		this.#bindings = bindings
		this.#investigation.rootList = fresh.rootList
	}

	*evaluate(time = performance.now()) {
		const samples = this.#sampler.take()

		this.#context.clock.update(time)
		this.#context.recentSamples = samples
		this.#context.dt = this.#context.clock.since / 1000

		for (const {code, value} of samples)
			this.#context.latestValues.set(code, value)

		for (const [id, expression] of this.#investigation.rootList.entries())
			yield {id, value: evaluate(this.#context, expression)} as Intent

		for (const {code, value} of samples)
			this.#context.previousValues.set(code, value)
	}

	encode(time = performance.now()) {
		return encodeIntents(this.#investigation.hash, [...this.evaluate(time)])
	}

	clear() {
		void this.#sampler.take()
	}

	dispose() {
		return this.#sampler.dispose()
	}
}

