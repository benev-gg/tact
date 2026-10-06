
import {expect, run, suite, test} from "@e280/science"
import {Resolver} from "./bindings/resolver.js"
import {ExampleSource} from "./sampling/sources/example.js"
import { decodeIntent } from "./bindings/utils/intent-coding.js"
import { is } from "@e280/stz"

await run({
	resolver: suite({
		"resolver update bindings": test(async() => {
			const resolver = new Resolver({forward: ["max", "KeyW", "ArrowUp"]})
			resolver.bindings = {forward: "KeyW"}
			expect(resolver).ok()
		}),

		"incredi": test(async() => {
			const resolver = new Resolver({forward: "KeyW"})
			const source = new ExampleSource()
			source.samples = [
				{time: 1, code: "KeyW", value: 0},
				{time: 2, code: "KeyW", value: 1},
			]
			const intent = resolver.resolveIntent(source.samples, 3)
			const {hash, intentions} = decodeIntent(intent)
			expect(is.number(hash)).ok()
			expect(intentions.length).is(1)
			expect(intentions).deep([{id: 0, value: 1}])
		}),
	}),
})

