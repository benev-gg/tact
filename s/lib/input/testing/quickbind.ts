
import {InputDecoder} from "../decoder.js"
import {Controller} from "../controller.js"
import {Bindings, Sample} from "../types.js"
import {PlainSource} from "../sources/plain.js"

export function quickbind<B extends Bindings>(b: B) {
	const source = new PlainSource()
	const controller = new Controller({source, bindings: b})
	const decoder = new InputDecoder(controller.bindings)
	const {inputs} = decoder

	const sample = (...samples: Sample[]) =>
		samples.forEach(s => source.onSample.publish(s))

	const solve = (time?: number) =>
		decoder.decode(controller.encode(time))

	return {source, controller, decoder, sample, solve, inputs}
}

