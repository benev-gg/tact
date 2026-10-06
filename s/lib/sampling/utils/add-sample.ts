
import {Sample} from "../types.js"

const maxSamples = 1024

export function addSample(samples: Sample[], code: string, value: number) {
	samples.push({time: performance.now(), code, value})

	while (samples.length > maxSamples)
		samples.shift()
}

