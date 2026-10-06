
import {expect, run, suite, test} from "@e280/science"
import {Resolver} from "./bindings/resolver.js"
import {ExampleSource} from "./sampling/sources/example.js"

await run({
	resolver: suite({
		"resolver update bindings": test(async() => {
			const resolver = new Resolver({forward: ["max", "KeyW", "ArrowUp"]})
			resolver.bindings = {forward: "KeyW"}
			expect(resolver).ok()
		}),

		"samples to actions": test(async() => {
			const resolver = new Resolver({forward: "KeyW"})
			const {forward} = resolver.actions
			const source = new ExampleSource()
			source.samples = [
				{time: 1, code: "KeyW", value: 0},
				{time: 2, code: "KeyW", value: 1},
			]

			resolver.resolveActions(resolver.resolveIntent(source.samples, 3))
			expect(forward).deep({value: 1, previous: 0, change: 1, down: 1, up: 0, lowest: 0, highest: 1})

			resolver.resolveActions(resolver.resolveIntent(source.samples, 4))
			expect(forward).deep({value: 1, previous: 1, change: 0, down: 0, up: 0, lowest: 1, highest: 1})

			source.samples.push({time: 5, code: "KeyW", value: 0})
			resolver.resolveActions(resolver.resolveIntent(source.samples, 6))
			expect(forward).deep({value: 0, previous: 1, change: 1, down: 0, up: 1, lowest: 0, highest: 1})
		}),
	}),
})

