
import {disposer, sub} from "@e280/stz"
import {Sample, Source} from "../types.js"

export class Sources implements Source {
	readonly dispose = disposer()
	readonly onSample = sub<[Sample]>()

	constructor(...sources: Source[]) {
		for (const source of sources)
			this.dispose.schedule(
				source.onSample(sample => this.onSample.publish(sample))
			)
	}
}

