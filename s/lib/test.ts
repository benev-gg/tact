
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

		"multiple resolvers coexist": test(async() => {
			const source = new ExampleSource()
			source.samples = [
				{code: "KeyW", value: 0},
				{code: "KeyW", value: 1},
			]
			const resolverA = new Resolver({forward: "KeyW"})
			const resolverB = new Resolver({forward: "KeyW"})
			resolverA.resolveActions(resolverA.resolveIntent(source.samples, 1))
			resolverB.resolveActions(resolverB.resolveIntent(source.samples, 1))
			expect(resolverA.actions.forward.value).is(1)
			expect(resolverB.actions.forward.value).is(1)

			source.samples.push({code: "KeyW", value: 0})

			resolverA.resolveActions(resolverA.resolveIntent(source.samples, 2))
			expect(resolverA.actions.forward.value).is(0)

			resolverB.resolveActions(resolverB.resolveIntent(source.samples, 2))
			expect(resolverB.actions.forward.value).is(0)
		}),

		"samples to actions": test(async() => {
			const resolver = new Resolver({forward: "KeyW"})
			const {forward} = resolver.actions
			const source = new ExampleSource()
			source.samples = [
				{code: "KeyW", value: 0},
				{code: "KeyW", value: 1},
			]

			resolver.resolveActions(resolver.resolveIntent(source.samples, 3))
			expect(forward).deep({value: 1, previous: 0, change: 1, down: 1, up: 0, lowest: 0, highest: 1})

			resolver.resolveActions(resolver.resolveIntent(source.samples, 4))
			expect(forward).deep({value: 1, previous: 1, change: 0, down: 0, up: 0, lowest: 1, highest: 1})

			source.samples.push({code: "KeyW", value: 0})
			resolver.resolveActions(resolver.resolveIntent(source.samples, 6))
			expect(forward).deep({value: 0, previous: 1, change: 1, down: 0, up: 1, lowest: 0, highest: 1})
		}),
	}),
})

