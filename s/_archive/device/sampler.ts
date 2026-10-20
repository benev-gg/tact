
import {sub} from "@e280/stz"
import {Device, Sample} from "../core/types.js"
import {SampleMap} from "../core/parts/sample-map.js"

export class SamplerDevice implements Device {
	on = sub<Sample>()
	sampleMap = new SampleMap()

	setSample(code: string, value: number) {
		this.sampleMap.set(code, value)
		this.on.pub(code, value)
		return this
	}

	zero() {
		for (const code of this.sampleMap.keys())
			this.setSample(code, 0)
	}

	*samples() {
		yield* this.sampleMap
	}
}

