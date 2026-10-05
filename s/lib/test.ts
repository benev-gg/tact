
import {expect, run, suite, test} from "@e280/science"
import {Sampler} from "./sampler.js"
import {ExampleSource} from "./sources/example.js"

await run({
	sampling: suite({
		"sampler works": test(async() => {
			const source = new ExampleSource()
			const sampler = new Sampler(source)
			source.onSample.publish([1, "KeyA", 1])
			expect(sampler.samples().length).is(1)
			expect(sampler.samples().length).is(0)
		}),

		"dispose stops sampling": test(async() => {
			const source = new ExampleSource()
			const sampler = new Sampler(source)
			source.onSample.publish([1, "KeyA", 1])
			sampler.dispose()
			source.onSample.publish([2, "KeyA", 0])
			expect(sampler.samples().length).is(1)
		}),

		"multiple samplers": test(async() => {
			const source = new ExampleSource()
			const samplerA = new Sampler(source)
			const samplerB = new Sampler(source)
			source.onSample.publish([1, "KeyA", 1])
			source.onSample.publish([2, "KeyA", 1])
			expect(samplerA.samples().length).is(2)
			expect(samplerA.samples().length).is(0)
			expect(samplerB.samples().length).is(2)
			expect(samplerB.samples().length).is(0)
		}),
	}),
})

