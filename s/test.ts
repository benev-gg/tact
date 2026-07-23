
import {need} from "@e280/stz"
import {distance} from "@benev/math"
import {science, suite, test, expect} from "@e280/science"

import {asBindings, Intent} from "./core/types.js"
import {encodeIntents} from "./core/intent/encode.js"
import {decodeIntents} from "./core/intent/decode.js"
import {bindingsShape} from "./core/bindings/shape.js"
import {bindingsTable} from "./core/bindings/table.js"
import {normalizeBindings} from "./core/bindings/normalize.js"
import {makeIntentsResolver} from "./core/resolvers/intents.js"
import {makeActionsResolver} from "./core/resolvers/actions.js"

export const exampleBindings = asBindings({
	running: {forward: "KeyW", jump: ["and", "ShiftLeft", "Space"]},
	gunning: {shoot: ["or", "pointer.button.left", "gamepad.trigger.right"]},
})

await science.run({
	bindings: suite({
		"shape": test(async() => {
			expect(bindingsShape(exampleBindings).running.forward).ok()
		}),

		"table actions": test(async() => {
			expect(need(bindingsTable(exampleBindings), 0).action).is("shoot")
			expect(need(bindingsTable(exampleBindings), 1).action).deep("forward")
			expect(need(bindingsTable(exampleBindings), 2).action).deep("jump")
		}),

		"table consistent ordering, mode": test(async() => {
			for (const b of [
				bindingsTable({alpha: {x: "KeyX"}, bravo: {x: "KeyX"}}),
				bindingsTable({bravo: {x: "KeyX"}, alpha: {x: "KeyX"}}),
			]) expect(need(b, 0).mode).deep("alpha")
		}),

		"table consistent ordering, action": test(async() => {
			for (const b of [
				bindingsTable({x: {alpha: "KeyA", bravo: "KeyB"}}),
				bindingsTable({x: {bravo: "KeyB", alpha: "KeyA"}}),
			]) expect(need(b, 0).action).deep("alpha")
		}),

		normalize: {
			"adopts atom": test(async() => {
				const standard = {a: {b: "KeyQ"}}
				expect(normalizeBindings(standard, {a: {b: "KeyW"}}).a.b).is("KeyW")
			}),

			"excludes excess action": test(async() => {
				const standard = {a: {b: "KeyQ"}}
				expect("c" in normalizeBindings(standard, {a: {b: "KeyQ", c: "KeyW"}}).a).is(false)
			}),

			"excludes excess bracket": test(async() => {
				const standard = {a: {b: "KeyQ"}}
				expect("c" in normalizeBindings(standard, {a: {b: "KeyQ"}, c: {d: "KeyW"}})).is(false)
			}),

			"falls back on standard atom": test(async() => {
				const standard = {a: {b: "KeyQ"}}
				expect(normalizeBindings(standard, {a: {}}).a.b).is("KeyQ")
			}),

			"falls back on standard bracket": test(async() => {
				const standard = {a: {b: "KeyQ"}}
				expect(normalizeBindings(standard, {}).a.b).is("KeyQ")
			}),

			"complex fallback": test(async() => {
				const standard = {a: {b: "KeyQ"}, c: {d: "KeyW"}}
				expect(normalizeBindings(standard, {c: {d: "KeyE"}}).a.b).is("KeyQ")
				expect(normalizeBindings(standard, {c: {d: "KeyE"}}).c.d).is("KeyE")
			}),
		},
	}),

	intents: suite({
		"encoded roundtrip": test(async() => {
			const intentsA: Intent[] = [[0, 0], [1, 1]]
			const bytes = encodeIntents(intentsA)
			const intentsB = decodeIntents(bytes)
			expect(intentsB).deep(intentsA)
		}),

		"encoded six bytes": test(async() => {
			const bytesA = encodeIntents([[0, 0]])
			const bytesB = encodeIntents([[25, 0.7853981633974483]])
			expect(bytesA.length).is(6)
			expect(bytesB.length).is(6)
		}),

		"encoded float precision is acceptable": test(async() => {
			const target = Math.PI / 4
			const bytes = encodeIntents([[25, target]])
			const [[,suspect]] = decodeIntents(bytes)
			expect(distance(suspect, target) < (1 / 1_000_000)).is(true)
		}),

		"encoded billion": test(async() => {
			const target = 1_000_000_000
			const bytes = encodeIntents([[25, target]])
			const [[,suspect]] = decodeIntents(bytes)
			expect(suspect).is(target)
		}),

		"encoded negative billion": test(async() => {
			const target = -1_000_000_000
			const bytes = encodeIntents([[25, target]])
			const [[,suspect]] = decodeIntents(bytes)
			expect(suspect).is(target)
		}),
	}),

	intentsResolver: suite({
		"resolve samples to intents": test(async() => {
			const resolveIntents = makeIntentsResolver(exampleBindings)
			const intents = resolveIntents(0, [["KeyW", 1]])
			expect(intents).deep([[1, 1]])
		}),
	}),

	actionsResolver: suite({
		"resolve intents to actions": test(async() => {
			const resolveActions = makeActionsResolver(exampleBindings)
			const actions = resolveActions([[1, 1]])
			expect(actions.running.forward.value).is(1)
			expect(actions.running.forward.down).is(true)
			expect(actions.running.forward.changed).is(true)
		}),

		"changing actions over time": test(async() => {
			const resolveActions = makeActionsResolver(exampleBindings)
			const actions = resolveActions([])

			resolveActions([[1, 0]])
			expect(actions.running.forward.value).is(0)
			expect(actions.running.forward.down).is(false)
			expect(actions.running.forward.changed).is(false)
			expect(actions.running.forward.changedDown).is(false)
			expect(actions.running.forward.changedUp).is(false)

			resolveActions([[1, 1]])
			expect(actions.running.forward.value).is(1)
			expect(actions.running.forward.down).is(true)
			expect(actions.running.forward.changed).is(true)
			expect(actions.running.forward.changedDown).is(true)
			expect(actions.running.forward.changedUp).is(false)

			resolveActions([[1, 1]])
			expect(actions.running.forward.value).is(1)
			expect(actions.running.forward.down).is(true)
			expect(actions.running.forward.changed).is(false)
			expect(actions.running.forward.changedDown).is(false)
			expect(actions.running.forward.changedUp).is(false)

			resolveActions([[1, 0]])
			expect(actions.running.forward.value).is(0)
			expect(actions.running.forward.down).is(false)
			expect(actions.running.forward.changed).is(true)
			expect(actions.running.forward.changedDown).is(false)
			expect(actions.running.forward.changedUp).is(true)
		}),

		"changed expires with empty intents": test(async() => {
			const resolveActions = makeActionsResolver(exampleBindings)
			const actions = resolveActions([])

			resolveActions([[1, 0]])
			expect(actions.running.forward.value).is(0)
			expect(actions.running.forward.down).is(false)
			expect(actions.running.forward.changed).is(false)
			expect(actions.running.forward.changedDown).is(false)
			expect(actions.running.forward.changedUp).is(false)

			resolveActions([[1, 1]])
			expect(actions.running.forward.value).is(1)
			expect(actions.running.forward.down).is(true)
			expect(actions.running.forward.changed).is(true)
			expect(actions.running.forward.changedDown).is(true)
			expect(actions.running.forward.changedUp).is(false)

			resolveActions([])
			expect(actions.running.forward.value).is(1)
			expect(actions.running.forward.down).is(true)
			expect(actions.running.forward.changed).is(false)
			expect(actions.running.forward.changedDown).is(false)
			expect(actions.running.forward.changedUp).is(false)
		}),
	}),

	"dynamics": {
		"just tapping": test(async() => {
			const bindings = asBindings({
				alpha: {
					tapper: ["code", "KeyE", {timing: ["tap", 10]}],
				},
			})
			const resolveIntents = makeIntentsResolver(bindings)
			const resolveActions = makeActionsResolver(bindings)
			{
				const intents = resolveIntents(0, [["KeyE", 0]])
				const actions = resolveActions(intents)
				expect(actions.alpha.tapper.down).is(false)
			}
			{
				const intents = resolveIntents(1, [["KeyE", 1]])
				const actions = resolveActions(intents)
				expect(actions.alpha.tapper.down).is(false)
			}
			{
				const intents = resolveIntents(2, [["KeyE", 0]])
				const actions = resolveActions(intents)
				expect(actions.alpha.tapper.down).is(true)
			}
		}),

		"just holding": test(async() => {
			const bindings = asBindings({
				alpha: {
					holder: ["code", "KeyE", {timing: ["hold", 10]}],
				},
			})
			const resolveIntents = makeIntentsResolver(bindings)
			const resolveActions = makeActionsResolver(bindings)
			{
				const intents = resolveIntents(0, [["KeyE", 0]])
				const actions = resolveActions(intents)
				expect(actions.alpha.holder.down).is(false)
			}
			{
				const intents = resolveIntents(1, [["KeyE", 1]])
				const actions = resolveActions(intents)
				expect(actions.alpha.holder.down).is(false)
			}
			{
				const intents = resolveIntents(11, [["KeyE", 1]])
				const actions = resolveActions(intents)
				expect(actions.alpha.holder.down).is(true)
			}
		}),

		"tapper works while holder exists": test.skip(async() => {
			const bindings = asBindings({
				alpha: {
					tapper: ["code", "KeyE", {timing: ["tap", 10]}],
					holder: ["code", "KeyE", {timing: ["hold", 10]}],
				},
			})
			const resolveIntents = makeIntentsResolver(bindings)
			const resolveActions = makeActionsResolver(bindings)
			{
				const intents = resolveIntents(0, [["KeyE", 0]])
				const actions = resolveActions(intents)
				expect(actions.alpha.tapper.down).is(false)
			}
			{
				const intents = resolveIntents(1, [["KeyE", 1]])
				const actions = resolveActions(intents)
				expect(actions.alpha.tapper.down).is(false)
			}
			{
				const intents = resolveIntents(2, [["KeyE", 0]])
				const actions = resolveActions(intents)
				expect(actions.alpha.tapper.down).is(true)
			}
		}),

		"holder works while tapper exists": test(async() => {
			const bindings = asBindings({
				alpha: {
					tapper: ["code", "KeyE", {timing: ["tap", 10]}],
					holder: ["code", "KeyE", {timing: ["hold", 10]}],
				},
			})
			const resolveIntents = makeIntentsResolver(bindings)
			const resolveActions = makeActionsResolver(bindings)
			{
				const intents = resolveIntents(0, [["KeyE", 0]])
				const actions = resolveActions(intents)
				expect(actions.alpha.holder.down).is(false)
			}
			{
				const intents = resolveIntents(1, [["KeyE", 1]])
				const actions = resolveActions(intents)
				expect(actions.alpha.holder.down).is(false)
			}
			{
				const intents = resolveIntents(11, [["KeyE", 1]])
				const actions = resolveActions(intents)
				expect(actions.alpha.holder.down).is(true)
			}
		}),

		"tapper and holder both work together": test.skip(async() => {
			const bindings = asBindings({
				alpha: {
					tapper: ["code", "KeyE", {timing: ["tap", 10]}],
					holder: ["code", "KeyE", {timing: ["hold", 10]}],
				},
			})
			const resolveIntents = makeIntentsResolver(bindings)
			const resolveActions = makeActionsResolver(bindings)
			{
				const intents = resolveIntents(0, [["KeyE", 0]])
				const actions = resolveActions(intents)
				expect(actions.alpha.tapper.down).is(false)
				expect(actions.alpha.holder.down).is(false)
			}
			{
				const intents = resolveIntents(1, [["KeyE", 1]])
				const actions = resolveActions(intents)
				expect(actions.alpha.tapper.down).is(false)
				expect(actions.alpha.holder.down).is(false)
			}
			{
				const intents = resolveIntents(2, [["KeyE", 0]])
				const actions = resolveActions(intents)
				expect(actions.alpha.tapper.down).is(true)
				expect(actions.alpha.holder.down).is(false)
			}
			{
				const intents = resolveIntents(3, [["KeyE", 1]])
				const actions = resolveActions(intents)
				expect(actions.alpha.tapper.down).is(false)
				expect(actions.alpha.holder.down).is(false)
			}
			{
				const intents = resolveIntents(13, [["KeyE", 1]])
				const actions = resolveActions(intents)
				expect(actions.alpha.tapper.down).is(false)
				expect(actions.alpha.holder.down).is(true)
			}
		}),
	},
})

