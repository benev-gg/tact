
import {register} from "@e280/sly"

import {setupDeck} from "./deck.js"
import {SetupParams} from "./types.js"
import {Collector} from "../collector.js"
import {Bindings} from "../../../input/types.js"
import {autoGamepads} from "../auto-gamepads.js"
import {ellipsis} from "../../../utils/ellipsis.js"
import {firstPreset} from "../utils/first-preset.js"
import {Controller} from "../../../input/controller.js"
import {Sources} from "../../../input/sources/sources.js"
import {Visualizer} from "../../views/visualizer/visualizer.js"
import {PointerSource} from "../../../input/sources/pointer.js"
import {KeyboardSource} from "../../../input/sources/keyboard.js"

import {makeDeckElement} from "../../views/deck/view.js"
import {makeCustomizeElement} from "../../views/customize/view.js"
import {makeVisualizerElement} from "../../views/visualizer/view.js"
import {makeControllersElement} from "../../views/controllers/view.js"

import devicesSvg from "../../icons/akar/devices.svg.js"
import gameControllerSvg from "../../icons/akar/game-controller.svg.js"

export async function setupTact<B extends Bindings>(params: SetupParams<B>) {
	const deck = await setupDeck(params)
	const first = firstPreset(deck.controls.presets)
	const collector = new Collector(first.profile.bindings)
	const visualizer = new Visualizer()

	const elements = {
		TactDeck: makeDeckElement(deck),
		TactCustomize: makeCustomizeElement(deck),
		TactControllers: makeControllersElement(deck),
		TactVisualizer: makeVisualizerElement(visualizer),
	}

	function gamepads(defaultProfileKey?: string) {
		return autoGamepads(deck.hub, (controller, source) => {
			const handle = `${source.pad.gamepad.id} ${source.pad.gamepad.index + 1}`
			deck.controls.attach(controller, {
				icon: gameControllerSvg,
				handle,
				tooltip: handle,
				name: ellipsis(handle, 32),
				defaultProfileKey: defaultProfileKey ?? first.key,
			})
			return () => deck.controls.detach(controller)
		})
	}

	function mouseKeyboard() {
		const {key, profile} = first

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
			name: "mouse/keyboard",
			tooltip: "",
			defaultProfileKey: key,
		})

		return controller
	}

	function registerElements() {
		register(elements)
	}

	return {
		deck,
		collector,
		gamepads,
		mouseKeyboard,
		visualizer,
		elements,
		registerElements,
	}
}

