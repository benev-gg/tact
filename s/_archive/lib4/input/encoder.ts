
import {deepClone, deepFreeze, got} from "@e280/stz"
import {Sampler} from "./utils/sampler.js"
import {encodeData} from "./data/encode.js"
import {evaluate} from "./evaluate/evaluate.js"
import {isDeltaRoot} from "./investigate/is.js"
import {EvaluationContext} from "./evaluate/context.js"
import {investigate} from "./investigate/investigate.js"
import {Bindings, InputData, Rebindings, RootExpression, Source} from "./types.js"

export class InputEncoder<B extends Bindings = any> {
	#sampler
	#bindings
	#investigation
	#context
	#processedIds = new Set<number>()
	#expressionResults = new Map<number, number>()

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

		this.#investigation.rootList = fresh.rootList
		this.#investigation.rootIndex = fresh.rootIndex
		this.#context = new EvaluationContext()
		this.#expressionResults.clear()
		this.#init()
	}

	encode(time = performance.now()): InputData {
		return encodeData(this.#investigation.hash, [...this.evaluate(time)])
	}

	*evaluate(time = performance.now()) {
		const samples = this.#sampler.take()
		this.#processedIds.clear()
		this.#context.clock.update(time)
		this.#context.currentSample = undefined
		this.#context.dt = this.#context.clock.since

		// evaluate expressions for each sample in order
		for (const sample of samples) {
			this.#context.currentSample = sample
			this.#context.sampleValues.set(sample.code, sample.value)
			const relevantRoots = got(this.#investigation.rootIndex.get(sample.code))

			for (const {id, root} of relevantRoots) {
				yield* this.#evaluateRootExpression(id, root)
			}
		}

		// make sure 'held' expressions get evaluated every time
		this.#context.currentSample = undefined
		for (const id of this.#context.holdyRoots) {
			if (!this.#processedIds.has(id))
				yield* this.#evaluateRootExpression(id, this.#investigation.rootList[id])
		}
	}

	*#evaluateRootExpression(id: number, root: RootExpression) {
		const value = evaluate(this.#context, id, root, root)
		this.#processedIds.add(id)

		if (isDeltaRoot(root)) {
			if (value !== 0)
				yield {id, value}
		}
		else {
			const was = this.#expressionResults.get(id)
			if (value !== was) {
				this.#expressionResults.set(id, value)
				yield {id, value}
			}
		}
	}

	#init() {
		for (const [id, root] of this.#investigation.rootList.entries())
			evaluate(this.#context, id, root, root)
	}

	dispose() {
		return this.#sampler.dispose()
	}
}

