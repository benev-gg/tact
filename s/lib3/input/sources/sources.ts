
import {Source} from "../types.js"
import {PlainSource} from "./plain.js"

export class Sources extends PlainSource {
	constructor(...sources: Source[]) {
		super()
		for (const source of sources)
			this.dispose.schedule(
				source.onSample(sample => this.onSample.publish(sample))
			)
	}
}

