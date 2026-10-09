
import {expect, run, suite, test} from "@e280/science"
import {InputEncoder} from "./core/encoder/encoder.js"
import {InputDecoder} from "./core/decoder/decoder.js"
import {ExampleSource} from "./core/sources/example.js"

await run({
	core: suite({
		"roundtrip": test(async() => {
			const source = new ExampleSource()
			const encoder = new InputEncoder(source, "KeyE")
			const decoder = new InputDecoder(encoder.bindings)
			source.onSample.publish({mode: "sticky", code: "KeyE", value: 0})
			expect(decoder.resolve(encoder.encode()).value).is(0)
			source.onSample.publish({mode: "sticky", code: "KeyE", value: 1})
			expect(decoder.resolve(encoder.encode()).value).is(1)
		}),
	}),
})

