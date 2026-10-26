
import {Hub} from "./hub.js"
import {Profiles} from "./profiles.js"
import {Pad} from "../../input/utils/pad/pad.js"
import {Controller} from "../../input/controller.js"
import {onPad} from "../../input/utils/pad/on-pad.js"
import {GamepadSource} from "../../input/sources/gamepad.js"

export function autoGamepads(
		hub: Hub,
		fn?: (params: {
			pad: Pad
			source: GamepadSource
			controller: Controller
		}) => void
	) {

	return onPad(pad => {
		const source = new GamepadSource(pad)

		const controller = new Controller({
			source,
			bindings: hub.bindings,
			handle: `${pad.gamepad.id} ${pad.gamepad.index + 1}`,
		})

		hub.plug(controller)
		fn?.({pad, source, controller})

		return () => hub.remove(controller)
	})
}

export function autoProfile(
		profiles: Profiles,
		profileKey: string,
	) {

	return (o: {controller: Controller}) => {
		profiles.assign(o.controller, profileKey)
	}
}

