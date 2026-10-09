
import {arraylimit} from "@e280/stz"
import {Sample, Source} from "../../types.js"

export class Sampler {
	readonly dispose
	#samples: Sample[] = []

	constructor(source: Source) {
		this.dispose = source.onSample(sample => {
			this.#samples.push(sample)
			this.#samples = arraylimit(this.#samples, 1024)
		})
	}

	take() {
		const samples = this.#samples
		this.#samples = []
		return samples
	}
}

