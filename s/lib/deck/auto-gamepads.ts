
import {Hub} from "./hub.js"
import {Profiles} from "./profiles.js"
import {Controller} from "../input/controller.js"
import {onPad} from "../input/utils/pad/on-pad.js"
import {GamepadSource} from "../input/sources/gamepad.js"

export function autoGamepads(
		deck: {hub: Hub, profiles: Profiles},
		profileKey: string,
	) {

	const {hub, profiles} = deck

	return onPad(pad => {
		const controller = new Controller({
			bindings: hub.bindings,
			source: new GamepadSource(pad),
			handle: `${pad.gamepad.id} ${pad.gamepad.index}`,
		})

		hub.plug(controller)
		profiles.assign(controller, profileKey)
		return () => hub.remove(controller)
	})
}

