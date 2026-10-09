
import {expect, run, suite, test} from "@e280/science"
import {quickbind} from "./input/testing/quickbind.js"

await run({
	input: suite({
		"roundtrip": test(async() => {
			const {sample, solve} = quickbind("KeyE")

			sample({code: "KeyE", value: 0, mode: "sticky"})
			expect(solve().value).is(0)

			sample({code: "KeyE", value: 1, mode: "sticky"})
			const inputs = solve()

			expect(inputs.value).is(1)
			expect(inputs.was).is(0)
			expect(inputs.change).is(1)
		}),

		"pulse accumulation": test(async() => {
			const {sample, solve} = quickbind("pointer.up")
			sample({mode: "pulse", code: "pointer.up", value: 2})
			sample({mode: "pulse", code: "pointer.up", value: 3})
			expect(solve().pulses).is(5)
			expect(solve().pulses).is(0)
		}),

		"sticky persists": test(async() => {
			const {sample, solve} = quickbind(["*", "ShiftLeft", "pointer.up"])
			sample({mode: "sticky", code: "ShiftLeft", value: 1})
			solve()
			sample({mode: "pulse", code: "pointer.up", value: 5})
			sample({mode: "pulse", code: "pointer.up", value: 3})
			expect(solve().pulses).is(8)
		}),

		"pulses don't linger": test(async() => {
			const {sample, solve} = quickbind(["max", "pointer.up", "gamepad.up"])
			sample({mode: "pulse", code: "pointer.up", value: 5})
			sample({mode: "sticky", code: "gamepad.up", value: 2})
			expect(solve().pulses).is(7)
		}),

		"pointer and joystick coexist": test(async() => {
			const {sample, solve} = quickbind(["+", "pointer.up", ["*", ["dt"], "gamepad.up"]])
			solve(0)
			sample({mode: "pulse", code: "pointer.up", value: 1})
			sample({mode: "sticky", code: "gamepad.up", value: 1})
			sample({mode: "pulse", code: "pointer.up", value: 1})
			expect(solve(1000).pulses).is(3)
			expect(solve(2000).pulses).is(1)
		}),

		"rapid transitions": test(async() => {
			const {sample, solve} = quickbind("KeyE")

			for (const value of [1, 0, 1])
				sample({mode: "sticky", code: "KeyE", value})

			const input = solve()
			expect(input.value).is(1)
			expect(input.down).is(2)
			expect(input.up).is(1)
			expect(input.change).is(3)
		}),

		"taps and holds don't interfere": test(async() => {
			const {sample, solve} = quickbind({
				tapper: ["taps", 1, 10, "KeyE"],
				holder: ["held", 10, "KeyE"],
			})

			sample({mode: "sticky", code: "KeyE", value: 0})
			expect(solve(0).tapper.down).is(0)

			sample({mode: "sticky", code: "KeyE", value: 1})
			expect(solve(1).tapper.down).is(1)

			sample({mode: "sticky", code: "KeyE", value: 0})
			const released = solve(2)
			expect(released.tapper.down).is(0)
			expect(released.holder.down).is(0)

			sample({mode: "sticky", code: "KeyE", value: 1})
			expect(solve(3).holder.down).is(0)
			expect(solve(13).holder.down).is(1)
		}),
	}),
})

