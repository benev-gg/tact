
import {Sample, Source} from "./types.js"

export class Sampler {
	dispose
	#ledger: Sample[] = []

	constructor(source: Source, max = 1024) {
		this.dispose = source.onSample(sample => {
			this.#ledger.push(sample)

			while (this.#ledger.length > max)
				this.#ledger.shift()
		})
	}

	samples() {
		const ret = this.#ledger
		this.#ledger = []
		return ret
	}
}

