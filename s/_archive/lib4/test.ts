
import {expect, run, suite, test} from "@e280/science"

await run({
	input: suite({
		"roundtrip": test(async() => {
			//...
			expect(true).ok()
		}),
	}),
})

