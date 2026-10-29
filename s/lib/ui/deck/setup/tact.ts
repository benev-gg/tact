
import {register} from "@e280/sly"
import {cycle, nap} from "@e280/stz"

import {PortId} from "../hub.js"
import {setupDeck} from "./deck.js"
import {SetupParams} from "./types.js"
import {Bindings} from "../../../input/types.js"
import {autoGamepads} from "../auto-gamepads.js"
import {firstStock} from "../utils/first-stock.js"
import {Controller} from "../../../input/controller.js"
import {Sources} from "../../../input/sources/sources.js"
import {PointerSource} from "../../../input/sources/pointer.js"
import {KeyboardSource} from "../../../input/sources/keyboard.js"

import {makeDeckElement} from "../../views/deck/view.js"
import {makePortsElement} from "../../views/ports/view.js"
import {makeCustomizeElement} from "../../views/customize/view.js"

import devicesSvg from "../../icons/akar/devices.svg.js"
import gameControllerSvg from "../../icons/akar/game-controller.svg.js"

export async function setupTact<B extends Bindings>(params: SetupParams<B>) {
	const deck = await setupDeck(params)

	const elements = {
		TactDeck: makeDeckElement(deck),
		TactCustomize: makeCustomizeElement(deck),
		TactPorts: makePortsElement(deck),
	}

	function gamepads(defaultProfileKey?: string) {
		return autoGamepads(deck.hub, (controller, source) => {
			const handle = `${source.pad.gamepad.id} ${source.pad.gamepad.index + 1}`
			deck.controls.attach(controller, {
				icon: gameControllerSvg,
				handle,
				name: handle,
				tooltip: "",
				defaultProfileKey: defaultProfileKey ?? firstStock(deck.controls.stock).key,
			})
			return () => deck.controls.detach(controller)
		})
	}

	function mouseAndKeyboard() {
		const {key, profile} = firstStock(deck.controls.stock)

		const controller = new Controller({
			bindings: profile.bindings,
			source: new Sources(
				new KeyboardSource(),
				new PointerSource(),
			),
		})

		deck.hub.plug(controller)

		deck.controls.attach(controller, {
			icon: devicesSvg,
			handle: "standard",
			name: "mouse and keyboard",
			tooltip: "",
			defaultProfileKey: key,
		})

		return controller
	}

	function encodingCycle(hz: number, fn: (portData: [PortId, ArrayBuffer][]) => void) {
		return cycle(async() => {
			fn(deck.hub.encodeAll())
			await nap(1000 / hz)
		})
	}

	function registerElements() {
		register(elements)
	}

	return {
		deck,
		gamepads,
		mouseAndKeyboard,
		encodingCycle,
		elements,
		registerElements,
	}
}

