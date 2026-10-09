
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

		"pulsy accumulation": test(async() => {
			const {sample, solve} = quickbind("pointer.up")
			sample({mode: "pulsy", code: "pointer.up", value: 2})
			sample({mode: "pulsy", code: "pointer.up", value: 3})
			expect(solve().pulses).is(5)
			expect(solve().pulses).is(0)
		}),

		"sticky persists": test(async() => {
			const {sample, solve} = quickbind(["*", "ShiftLeft", "pointer.up"])
			sample({mode: "sticky", code: "ShiftLeft", value: 1})
			solve()
			sample({mode: "pulsy", code: "pointer.up", value: 5})
			sample({mode: "pulsy", code: "pointer.up", value: 3})
			expect(solve().pulses).is(8)
		}),

		"pulses don't linger": test(async() => {
			const {sample, solve} = quickbind(["max", "pointer.up", "gamepad.up"])
			sample({mode: "pulsy", code: "pointer.up", value: 5})
			sample({mode: "sticky", code: "gamepad.up", value: 2})
			expect(solve().pulses).is(7)
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

		"double trouble": suite({
			"tapper works while holder exists": test(async() => {
				const {sample, solve} = quickbind({
					tapper: ["taps", 1, 10, "KeyE"],
					holder: ["held", 10, "KeyE"],
				})

				sample({mode: "sticky", code: "KeyE", value: 0})
				expect(solve(1).tapper.down).is(0)

				sample({mode: "sticky", code: "KeyE", value: 1})
				expect(solve(2).tapper.down).is(1)

				sample({mode: "sticky", code: "KeyE", value: 0})
				expect(solve(3).tapper.down).is(0)
			}),

			"tapper and holder don't interfere": test(async() => {
				const {sample, solve} = quickbind({
					tapper: ["taps", 1, 10, "KeyE"],
					holder: ["held", 10, "KeyE"],
				})

				const step = (time: number, value: number | null) => {
					if (value !== null)
						sample({mode: "sticky", code: "KeyE", value})
					return solve(time)
				}

				expect(step(0, 0).holder.down).is(0)
				expect(step(1, 1).tapper.down).is(1)
				expect(step(2, 0).holder.down).is(0)
				expect(step(3, 1).holder.down).is(0)
				expect(step(13, null).holder.down).is(1)
			}),
		}),
	}),
})

