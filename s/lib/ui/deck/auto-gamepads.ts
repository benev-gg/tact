
import {Hub} from "./hub.js"
import {Controller} from "../../input/controller.js"
import {onPad} from "../../input/utils/pad/on-pad.js"
import {GamepadSource} from "../../input/sources/gamepad.js"

export function autoGamepads(
		hub: Hub,
		fn?: (controller: Controller, source: GamepadSource) => void
	) {

	return onPad(pad => {
		const source = new GamepadSource(pad)

		const controller = new Controller({
			source,
			bindings: hub.bindings,
		})

		hub.plug(controller)
		fn?.(controller, source)

		return () => hub.remove(controller)
	})
}

