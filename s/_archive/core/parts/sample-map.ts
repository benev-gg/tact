
import {Sample} from "../types.js"

export class SampleMap extends Map<string, number> {
	constructor(samples?: Iterable<Sample>) {
		super()
		if (samples) {
			for (const [code, value] of samples)
				this.set(code, value)
		}
	}

	zero() {
		for (const code of this.keys()) this.set(code, 0)
		return this
	}

	merge([code, value]: Sample) {
		const previous = this.get(code) ?? 0
		if (value > previous) this.set(code, value)
		return this
	}
}

