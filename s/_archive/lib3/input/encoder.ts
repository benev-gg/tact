
import {deepClone, deepFreeze, got} from "@e280/stz"
import {Sampler} from "./utils/sampler.js"
import {encodeData} from "./data/encode.js"
import {evaluate} from "./evaluate/evaluate.js"
import {EvaluationContext} from "./evaluate/context.js"
import {investigate} from "./investigate/investigate.js"
import {Bindings, Expression, InputData, Intent, Rebindings, Source} from "./types.js"

export class InputEncoder<B extends Bindings = any> {
	#sampler
	#bindings
	#investigation
	#context
	#expressionValues = new Map<Expression, number>()

	constructor(source: Source, bindings: B) {
		this.#bindings = deepFreeze(deepClone(bindings)) as any as Rebindings<B>
		this.#investigation = investigate(this.#bindings)
		this.#sampler = new Sampler(source)
		this.#context = new EvaluationContext()
		this.#init()
	}

	get bindings() {
		return this.#bindings
	}

	set bindings(b: Rebindings<B>) {
		const fresh = investigate(b)

		if (fresh.hash !== this.#investigation.hash)
			throw new Error("incompatible bindings")

		this.#investigation.rootIds = fresh.rootIds
		this.#investigation.rootList = fresh.rootList
		this.#investigation.rootIndex = fresh.rootIndex
		this.#context = new EvaluationContext()
		this.#expressionValues.clear()
		this.#init()
	}

	encode(time = performance.now()): InputData {
		return encodeData(this.#investigation.hash, [...this.evaluate(time)])
	}

	*evaluate(time = performance.now()) {
		const samples = this.#sampler.take()

		this.#context.clock.update(time)
		this.#context.phase = "samples"
		this.#context.dt = 0

		for (const sample of samples) {
			this.#context.sampleValues.set(sample.code, sample.value)

			for (const root of this.#investigation.rootIndex.get(sample.code) ?? []) {
				const intent = this.#makeIntent(root, sample.mode === "pulse")
				if (intent) yield intent
			}

			if (sample.mode === "pulse")
				this.#context.sampleValues.set(sample.code, 0)
		}

		this.#context.phase = "holdy"
		for (const root of this.#context.holdyRoots) {
			const intent = this.#makeIntent(root)
			if (intent) yield intent
		}

		this.#context.phase = "dt"
		this.#context.dt = this.#context.clock.since / 1000
		for (const root of this.#context.dtRoots) {
			const intent = this.#makeIntent(root, true)
			if (intent) yield intent
		}
	}

	#init() {
		for (const root of this.#investigation.rootList)
			evaluate(this.#context, root, root)
	}

	#makeIntent(root: Expression, force = false) {
		const value = evaluate(this.#context, root, root)
		const was = this.#expressionValues.get(root)
		if (force || value !== was) {
			this.#expressionValues.set(root, value)
			const id = got(this.#investigation.rootIds.get(root))
			return <Intent>{id, value}
		}
	}

	dispose() {
		return this.#sampler.dispose()
	}
}

