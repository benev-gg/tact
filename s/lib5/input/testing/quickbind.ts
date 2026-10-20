
import {InputDecoder} from "../decoder.js"
import {InputEncoder} from "../encoder.js"
import {Bindings, Sample} from "../types.js"
import {PlainSource} from "../sources/plain.js"

export function quickbind<B extends Bindings>(b: B) {
	const source = new PlainSource()
	const encoder = new InputEncoder(source, b)
	const decoder = new InputDecoder(encoder.bindings)

	const sample = (...samples: Sample[]) =>
		samples.forEach(s => source.onSample.publish(s))

	const solve = (time?: number) =>
		decoder.resolve(encoder.encode(time))

	return {source, encoder, decoder, sample, solve}
}

