
import {expect, run, suite, test} from "@e280/science"
import {ExampleSource} from "./sampling/sources/example.js"

await run({
	// sampling: suite({
	// 	"sampler works": test(async() => {
	// 		const source = new ExampleSource()
	// 		const sampler = new Sampler(source)
	// 		source.onSample.publish(["KeyA", 1])
	// 		expect(sampler.get().length).is(1)
	// 	}),
	//
	// 	"dispose stops sampling": test(async() => {
	// 		const source = new ExampleSource()
	// 		const sampler = new Sampler(source)
	// 		source.onSample.publish(["KeyA", 1])
	// 		sampler.dispose()
	// 		source.onSample.publish(["KeyA", 0])
	// 		expect(sampler.get().length).is(1)
	// 	}),
	//
	// 	"multiple samplers": test(async() => {
	// 		const source = new ExampleSource()
	// 		const samplerA = new Sampler(source)
	// 		const samplerB = new Sampler(source)
	// 		source.onSample.publish(["KeyA", 1])
	// 		expect(samplerA.get().length).is(1)
	// 		expect(samplerB.get().length).is(1)
	// 	}),
	// }),
})

