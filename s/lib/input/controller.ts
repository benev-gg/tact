
import {deepFreeze} from "@e280/stz"
import {Sampler} from "./utils/sampler.js"
import {encodeData} from "./data/encode.js"
import {evaluate} from "./evaluate/evaluate.js"
import {EvaluationContext} from "./evaluate/context.js"
import {investigate} from "./investigate/investigate.js"
import {Bindings, InputData, Intent, Rebindings, Source} from "./types.js"

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

		if (fresh.hash !== this.#investigation.hash)
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

	encode(time = performance.now()): InputData {
		return encodeData(this.#investigation.hash, [...this.evaluate(time)])
	}

	clear() {
		void this.#sampler.take()
	}

	dispose() {
		return this.#sampler.dispose()
	}
}

