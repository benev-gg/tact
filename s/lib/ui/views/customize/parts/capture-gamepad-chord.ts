
import {cycle, disposer, ev, nap} from "@e280/stz"
import {Expression} from "../../../../input/expression.js"
import {onPad} from "../../../../input/utils/pad/on-pad.js"
import {GamepadSource} from "../../../../input/sources/gamepad.js"

export function captureGamepadChord(
		update: (code: Expression) => void,
		onDone: () => void,
	) {

	const {dispose, schedule} = disposer()
	schedule(onDone)

	const sourceSet = new Set<GamepadSource>()
	const held = new Set<string>()
	const seen = new Set<string>()

	schedule(ev(window, {blur: () => dispose()}))

	schedule(onPad(pad => {
		const source = new GamepadSource(pad)
		sourceSet.add(source)

		source.onSample(sample => {
			if (sample.code === "gamepad.any")
				return undefined

			if (sample.value > 0.9) {
				held.add(sample.code)
				seen.add(sample.code)
			}
			else {
				if (!held.delete(sample.code))
					return
				if (held.size === 0) {
					if (seen.size === 1) update([...seen][0])
					else if (seen.size > 1) update(["*", ...seen])
					dispose()
				}
			}
		})

		return () => {
			source.dispose()
			sourceSet.delete(source)
		}
	}))

	schedule(cycle(async() => {
		for (const source of sourceSet) {
			source.poll()
		}
		await nap(16.67)
	}))

	return dispose
}

