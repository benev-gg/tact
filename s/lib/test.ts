
import {expect, run, suite, test} from "@e280/science"
import {Resolver} from "./bindings/resolver.js"

await run({
	resolver: suite({
		"resolver update bindings": test(async() => {
			const resolver = new Resolver({forward: ["max", "KeyW", "ArrowUp"]})
			resolver.bindings = {forward: "KeyW"}
			expect(resolver).ok()
		}),
	}),
})

