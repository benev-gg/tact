
import {Sample, SampleFrame, Source} from "./types.js"

const maxFrames = 1024
const maxSamplesPerFrame = 1024

export class Sampler {
	dispose
	#samples: Sample[] = []
	#frames: SampleFrame[] = []

	constructor(source: Source) {
		this.dispose = source.onSample(sample => {
			this.#samples.push(sample)

			while (this.#samples.length > maxSamplesPerFrame)
				this.#samples.shift()
		})
	}

	get() {
		const samples = this.#samples
		this.#samples = []
		this.#frames.push([performance.now(), samples])
		while (this.#frames.length > maxFrames)
			this.#frames.shift()
		return this.#frames
	}
}

