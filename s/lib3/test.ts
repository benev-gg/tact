
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

		"pulsy accumulation": test(async() => {
			const source = new ExampleSource()
			const encoder = new InputEncoder(source, "pointer.up")
			const decoder = new InputDecoder(encoder.bindings)

			source.onSample.publish({mode: "pulsy", code: "pointer.up", value: 2})
			source.onSample.publish({mode: "pulsy", code: "pointer.up", value: 3})
			expect(decoder.resolve(encoder.encode()).pulses).is(5)
			expect(decoder.resolve(encoder.encode()).pulses).is(0)
		}),

		"sticky persists": test(async() => {
			const source = new ExampleSource()
			const encoder = new InputEncoder(source, ["*", "ShiftLeft", "pointer.up"])
			const decoder = new InputDecoder(encoder.bindings)

			source.onSample.publish({mode: "sticky", code: "ShiftLeft", value: 1})
			decoder.resolve(encoder.encode())

			source.onSample.publish({mode: "pulsy", code: "pointer.up", value: 5})
			source.onSample.publish({mode: "pulsy", code: "pointer.up", value: 3})
			expect(decoder.resolve(encoder.encode()).pulses).is(8)
		}),

		"pulses don't linger": test(async() => {
			const source = new ExampleSource()
			const encoder = new InputEncoder(source, ["max", "pointer.up", "gamepad.up"])
			const decoder = new InputDecoder(encoder.bindings)

			source.onSample.publish({mode: "pulsy", code: "pointer.up", value: 5})
			source.onSample.publish({mode: "sticky", code: "gamepad.up", value: 2})
			expect(decoder.resolve(encoder.encode()).pulses).is(7)
		}),

		"rapid transitions": test(async() => {
			const source = new ExampleSource()
			const encoder = new InputEncoder(source, "KeyE")
			const decoder = new InputDecoder(encoder.bindings)

			for (const value of [1, 0, 1])
				source.onSample.publish({mode: "sticky", code: "KeyE", value})

			const input = decoder.resolve(encoder.encode())
			expect(input.value).is(1)
			expect(input.down).is(2)
			expect(input.up).is(1)
			expect(input.change).is(3)
		}),
	}),
})

