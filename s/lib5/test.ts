
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
	}),
})

