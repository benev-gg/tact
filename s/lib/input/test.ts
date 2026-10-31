
import {expect, suite, test} from "@e280/science"

import {asBindings} from "./types.js"
import {Controller} from "./controller.js"
import {PlainSource} from "./sources/plain.js"
import {quickbind} from "./testing/quickbind.js"

import parcel from "./data/test.js"

export default suite({
	parcel,

	"roundtrip": test(async() => {
		const {sample, solve} = quickbind("KeyE")

		sample({code: "KeyE", value: 0})
		expect(solve().value).is(0)

		sample({code: "KeyE", value: 1})
		const inputs = solve()
		expect(inputs.value).is(1)
		expect(inputs.was).is(0)
	}),

	"update bindings": test(async() => {
		const {sample, solve, controller} = quickbind("KeyA")

		sample({code: "KeyA", value: 1})
		expect(solve().value).is(1)

		sample({code: "KeyA", value: 0})
		expect(solve().value).is(0)

		controller.bindings = "KeyB"
		expect(controller.bindings).is("KeyB")
		sample({code: "KeyA", value: 1})
		expect(solve().value).is(0)

		sample({code: "KeyA", value: 0})
		sample({code: "KeyB", value: 1})
		expect(solve().value).is(1)
	}),

	"incompatible bindings throws an error": test(async() => {
		const {controller} = quickbind({alpha: "KeyA"})
		expect(() => controller.bindings = <any>{bravo: "KeyA"}).throws()
	}),

	"rapid transitions": test(async() => {
		const {sample, solve} = quickbind({
			key: "KeyE",
			downs: ["down", "KeyE"],
			ups: ["up", "KeyE"],
		})

		for (const value of [1, 0, 1, 0, 1])
			sample({code: "KeyE", value})

		let inputs = solve()
		expect(inputs.key.value).is(1)
		expect(inputs.downs.value).is(3)
		expect(inputs.ups.value).is(2)

		inputs = solve()
		expect(inputs.key.value).is(1)
		expect(inputs.downs.value).is(0)
		expect(inputs.ups.value).is(0)
	}),

	"quick tap controller-level": test(async() => {
		const {sample, solve, inputs} = quickbind("KeyE")

		solve()
		expect(inputs.sum).is(0)

		for (const value of [0, 1, 0])
			sample({code: "KeyE", value})

		solve()
		expect(inputs.sum).is(1)

		solve()
		expect(inputs.sum).is(0)
	}),

	"quick tap decoder-level": test(async() => {
		const {sample, solve, controller, decoder, inputs} = quickbind("KeyE")

		solve()
		expect(inputs.sum).is(0)
		const datas: ArrayBuffer[] = []

		for (const value of [0, 1, 0]) {
			sample({code: "KeyE", value})
			datas.push(controller.encode())
		}

		decoder.decode(...datas)
		expect(inputs.sum).is(1)

		solve()
		expect(inputs.sum).is(0)
	}),

	"single tap": test(async() => {
		const {sample, solve} = quickbind(["taps", 1, 400, "KeyE"])
		const hit = (time: number, value: number) => {
			sample({code: "KeyE", value})
			return solve(time).value
		}
		expect(hit(0, 0)).is(0)
		expect(hit(100, 1)).is(0)
		expect(hit(200, 0)).is(1)
	}),

	"double tap": test(async() => {
		const {sample, solve} = quickbind(["taps", 2, 400, "KeyE"])
		const hit = (time: number, value: number) => {
			sample({code: "KeyE", value})
			return solve(time).value
		}
		expect(hit(0, 0)).is(0)
		expect(hit(100, 1)).is(0)
		expect(hit(200, 0)).is(0)
		expect(hit(300, 1)).is(0)
		expect(hit(400, 0)).is(1)
	}),

	"held across empty frames": test(async() => {
		const {sample, solve} = quickbind(
			["held", 300, "KeyE"]
		)

		solve(0)
		sample({code: "KeyE", value: 1})

		expect(solve(100).value).is(0)
		expect(solve(399).value).is(0)
		expect(solve(400).value).is(1)
		expect(solve(500).value).is(1)

		sample({code: "KeyE", value: 0})
		expect(solve(501).value).is(0)

		sample({code: "KeyE", value: 1})
		expect(solve(600).value).is(0)
		expect(solve(900).value).is(1)
	}),

	"taps vs held": test(async() => {
		const {sample, solve} = quickbind({
			tappy: ["taps", 1, 300, "KeyE"],
			holdy: ["held", 300, "KeyE"],
		})
		const hit = (time: number, value: number) => {
			sample({code: "KeyE", value})
			return solve(time)
		}
		const __up = (time: number) => hit(time, 0)
		const DOWN = (time: number) => hit(time, 1)

		expect(__up(1000).tappy.value).is(0)
		expect(DOWN(1100).tappy.value).is(0)
		expect(__up(1200).tappy.value).is(1)
		expect(__up(1200).tappy.value).is(0)

		expect(__up(2000).holdy.value).is(0)
		expect(DOWN(2100).holdy.value).is(0)
		expect(DOWN(2200).holdy.value).is(0)
		expect(DOWN(2300).holdy.value).is(0)
		expect(DOWN(2400).holdy.value).is(1)
		expect(__up(2500).holdy.value).is(0)
	}),

	"independent controller consumers": test(async() => {
		const source = new PlainSource()
		const bindings = asBindings({
			downs: ["down", "KeyE"],
			ups: ["up", "KeyE"],
		})

		const fast = new Controller({source, bindings})
		const slow = new Controller({source, bindings})

		source.onSample.publish({code: "KeyE", value: 1})
		expect([...fast.evaluate(1)]).deep([
			{id: 0, value: 1},
		])

		source.onSample.publish({code: "KeyE", value: 0})
		expect([...fast.evaluate(2)]).deep([
			{id: 1, value: 1},
		])

		expect([...slow.evaluate(20)]).deep([
			{id: 0, value: 1},
			{id: 1, value: 1},
		])

		fast.dispose()
		slow.dispose()
	}),
})

