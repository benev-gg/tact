
import {arraylimit} from "@e280/stz"
import {Sample, Source} from "../types.js"

const limit = 1024

export class Sampler {
	readonly dispose
	#samples: Sample[] = []

	constructor(source: Source) {
		this.dispose = source.onSample(sample => {
			this.#samples.push(sample)
			if (this.#samples.length > limit) console.warn(`tact sampler exceeded limit ${limit}`)
			this.#samples = arraylimit(this.#samples, limit)
		})
	}

	take() {
		const samples = this.#samples
		this.#samples = []
		return samples
	}
}

