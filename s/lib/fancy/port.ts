
import {InputEncoder} from "../input/encoder.js"
import {encodeData} from "../input/data/encode.js"
import {Bindings, Intent} from "../input/types.js"
import {hashBindings} from "../input/investigate/hash-bindings.js"
import {isCompatible} from "../input/investigate/is-compatible.js"

export class Port<B extends Bindings> {
	#hash
	#bindings
	#encoders = new Set<InputEncoder<B>>()

	constructor(bindings: B) {
		this.#hash = hashBindings(bindings)
		this.#bindings = bindings
	}

	attach(encoder: InputEncoder<B>) {
		if (isCompatible(encoder.bindings, this.#bindings))
			throw new Error("bindings incompatible")
		this.#encoders.add(encoder)
		return () => this.detach(encoder)
	}

	detach(encoder: InputEncoder<B>) {
		this.#encoders.delete(encoder)
	}

	encode(time = performance.now()) {
		const merged = new Map<number, number>()

		for (const encoder of this.#encoders) {
			for (const intent of encoder.evaluate(time)) {
				const knownValue = merged.get(intent.id) ?? 0
				const mergedValue = knownValue + intent.value
				merged.set(intent.id, mergedValue)
			}
		}

		const intents = [...merged].map(([id, value]): Intent => ({id, value}))
		return encodeData(this.#hash, intents)
	}
}

