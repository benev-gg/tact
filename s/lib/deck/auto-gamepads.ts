
import {given} from "@e280/stz"

import {Hub} from "./hub.js"
import {Controller} from "../input/controller.js"
import {onPad} from "../input/utils/pad/on-pad.js"
import {GamepadSource} from "../input/sources/gamepad.js"

export function autoGamepads(hub: Hub) {
	return onPad(pad => {
		const controller = new Controller({
			bindings: hub.bindings,
			source: new GamepadSource(pad),
			handle: `${pad.gamepad.id} ${pad.gamepad.index}`,
		})
		hub.add(controller)
		given(hub.portIds.at(-1), id => hub.plug(id, controller))
		return () => hub.remove(controller)
	})
}

