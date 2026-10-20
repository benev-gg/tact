
import {expect, run, suite, test} from "@e280/science"
import {quickbind} from "./input/testing/quickbind.js"

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
	}),
})

