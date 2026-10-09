
import {Source} from "../types.js"
import {PlainSource} from "./plain.js"

export class Sources extends PlainSource {
	#array

	constructor(...sources: Source[]) {
		super()

		this.#array = sources

		for (const source of sources)
			this.dispose.schedule(
				source.onSample(sample => this.onSample.publish(sample))
			)
	}

	poll() {
		for (const source of this.#array)
			source.poll?.()
	}
}

