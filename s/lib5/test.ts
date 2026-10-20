
import {expect, run, suite, test} from "@e280/science"
import {quickbind} from "./input/testing/quickbind.js"
import { PlainSource } from "./input/sources/plain.js"
import { InputEncoder } from "./input/encoder.js"
import { asBindings } from "./input/types.js"

await run({
	input: suite({
		"roundtrip": test(async() => {
			const {sample, solve} = quickbind("KeyE")

			sample({code: "KeyE", value: 0})
			expect(solve().value).is(0)

			sample({code: "KeyE", value: 1})
			const inputs = solve()
			expect(inputs.value).is(1)
			expect(inputs.was).is(0)
			expect(inputs.delta).is(1)
		}),

		"pointer movement accumulation": test(async() => {
			const {sample, solve} = quickbind(["accumulate", ["sum", "pointer.x"]])
			let inputs = solve()

			sample({code: "pointer.x", value: 0})
			sample({code: "pointer.x", value: 1})
			sample({code: "pointer.x", value: 2})
			sample({code: "pointer.x", value: -5})
			inputs = solve()
			expect(inputs.value).is(-2)
			expect(inputs.delta).is(-2)

			sample({code: "pointer.x", value: 2})
			sample({code: "pointer.x", value: 5})
			inputs = solve()
			expect(inputs.value).is(5)
			expect(inputs.delta).is(7)
		}),

		"rapid transitions": test(async() => {
			const {sample, solve} = quickbind({
				key: "KeyE",
				downs: ["down", "KeyE"],
				ups: ["up", "KeyE"],
			})

			for (const value of [1, 0, 1, 0, 1])
				sample({code: "KeyE", value})

			let inputs = solve()
			expect(inputs.key.value).is(1)
			expect(inputs.downs.value).is(3)
			expect(inputs.ups.value).is(2)

			inputs = solve()
			expect(inputs.key.value).is(1)
			expect(inputs.downs.value).is(0)
			expect(inputs.ups.value).is(0)
		}),

		"double tap in one frame": test(async() => {
			const {sample, solve} = quickbind(
				["taps", 2, 300, ["down", "KeyE"]]
			)

			for (const value of [1, 0, 1, 0])
				sample({code: "KeyE", value})

			expect(solve(100).value).is(1)
			expect(solve(200).value).is(0)
		}),

		"held across empty frames": test(async() => {
			const {sample, solve} = quickbind(
				["held", 300, "KeyE"]
			)

			solve(0)
			sample({code: "KeyE", value: 1})

			expect(solve(100).value).is(0)
			expect(solve(399).value).is(0)
			expect(solve(400).value).is(1)
			expect(solve(500).value).is(1)

			sample({code: "KeyE", value: 0})
			expect(solve(501).value).is(0)

			sample({code: "KeyE", value: 1})
			expect(solve(600).value).is(0)
			expect(solve(900).value).is(1)
		}),

		"joystick integration": test(async() => {
			const {sample, solve} = quickbind(
				["accumulate", ["*", "gamepad.x", ["dt"]]]
			)

			solve(0)
			sample({code: "gamepad.x", value: 1})

			expect(solve(500).value).is(0.5)
			expect(solve(1000).value).is(1)

			sample({code: "gamepad.x", value: 0})
			expect(solve(1500).value).is(1)
		}),

		"taps and holds coexist": test(async() => {
			const {sample, solve} = quickbind({
				tapper: ["taps", 1, 10, ["down", "KeyE"]],
				holder: ["held", 10, "KeyE"],
			})

			solve(0)

			sample({code: "KeyE", value: 1})
			expect(solve(1).tapper.value).is(1)

			sample({code: "KeyE", value: 0})
			const released = solve(2)
			expect(released.tapper.value).is(0)
			expect(released.holder.value).is(0)

			sample({code: "KeyE", value: 1})
			const pressed = solve(3)
			expect(pressed.tapper.value).is(1)
			expect(pressed.holder.value).is(0)

			const holding = solve(13)
			expect(holding.tapper.value).is(0)
			expect(holding.holder.value).is(1)
		}),

		"independent encoder consumers": test(async() => {
			const source = new PlainSource()
			const bindings = asBindings({
				downs: ["down", "KeyE"],
				ups: ["up", "KeyE"],
			})

			const fast = new InputEncoder(source, bindings)
			const slow = new InputEncoder(source, bindings)

			source.onSample.publish({code: "KeyE", value: 1})
			expect([...fast.evaluate(1)].map(i => i.value)).deep([1, 0])

			source.onSample.publish({code: "KeyE", value: 0})
			expect([...fast.evaluate(2)].map(i => i.value)).deep([0, 1])

			// slow consumer receives both transitions in one batch.
			expect([...slow.evaluate(20)].map(i => i.value)).deep([1, 1])

			fast.dispose()
			slow.dispose()
		}),
	}),
})

