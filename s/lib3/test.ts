
import {expect, run, suite, test} from "@e280/science"
import {Bindings} from "./input/types.js"
import {InputEncoder} from "./input/encoder.js"
import {InputDecoder} from "./input/decoder.js"
import {ExampleSource} from "./input/sources/example.js"

await run({
	input: suite({
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

		"double trouble": (() => {
			const bindings = {
				tapper: ["taps", 1, 10, "KeyE"],
				holder: ["held", 10, "KeyE"],
			} satisfies Bindings

			function setup() {
				const source = new ExampleSource()
				const encoder = new InputEncoder(source, bindings)
				const decoder = new InputDecoder(encoder.bindings)
				return (time: number, value: number | null) => {
					if (value !== null)
						source.onSample.publish({mode: "sticky", code: "KeyE", value})
					return decoder.resolve(encoder.encode(time))
				}
			}

			return suite({
				"tapper works while holder exists": test(async() => {
					const step = setup()
					expect(step(1, 0).tapper.down).is(0)
					expect(step(2, 1).tapper.down).is(1)
					expect(step(3, 0).tapper.down).is(0)
				}),

				"tapper and holder both work together": test(async() => {
					const step = setup()
					expect(step(0, 0).holder.down).is(0)
					expect(step(1, 1).tapper.down).is(1)
					expect(step(2, 0).holder.down).is(0)
					expect(step(3, 1).holder.down).is(0)
					expect(step(13, null).holder.down).is(1)
				}),
			})
		})(),
	}),
})

