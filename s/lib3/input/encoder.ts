
import {deepClone, deepFreeze, got} from "@e280/stz"
import {Intent} from "./data/types.js"
import {Sampler} from "./utils/sampler.js"
import {encodeData} from "./data/encode.js"
import {evaluate} from "./evaluate/evaluate.js"
import {EvaluationContext} from "./evaluate/context.js"
import {investigate} from "./investigate/investigate.js"
import {Bindings, Expression, InputData, Rebindings, Source} from "./types.js"

export class InputEncoder<B extends Bindings> {
	#sampler
	#bindings
	#investigation
	#context
	#history = new Map<Expression, number>()

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

		this.#investigation.rootList = fresh.rootList
		this.#investigation.rootIndex = fresh.rootIndex
		this.#context = new EvaluationContext()
		this.#history.clear()
	}

	encode(time = performance.now()): InputData {
		const intents: Intent[] = []
		const samples = this.#sampler.take()

		this.#context.clock.update(time)
		this.#context.phase = "samples"
		this.#context.dt = 0

		for (const sample of samples) {
			this.#context.sampleValues.set(sample.code, sample.value)

			for (const {id, root} of this.#relevantRoots(sample.code)) {
				const value = evaluate(this.#context, root, root)
				intents.push({id, value})
				this.#history.set(root, value)
			}

			if (sample.mode === "pulse")
				this.#context.sampleValues.set(sample.code, 0)
		}

		this.#context.phase = "holdy"
		for (const root of this.#context.holdyRoots) {
			const was = this.#history.get(root) ?? 0
			const value = evaluate(this.#context, root, root)
			this.#history.set(root, value)

			if (value !== was) {
				const id = got(this.#investigation.rootIds.get(root))
				intents.push({id, value})
			}
		}

		this.#context.phase = "dt"
		this.#context.dt = this.#context.clock.since / 1000
		for (const root of this.#context.dtRoots) {
			const value = evaluate(this.#context, root, root)
			const id = got(this.#investigation.rootIds.get(root))
			intents.push({id, value})
		}

		return encodeData(this.#investigation.hash, intents)
	}

	#relevantRoots(code: string) {
		const indexed = this.#investigation.rootIndex.get(code)
		return [...indexed ?? []]
	}

	dispose() {
		return this.#sampler.dispose()
	}
}

