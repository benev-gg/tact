
import {html} from "lit"
import {Kv} from "@e280/kv"
import {cycle} from "@e280/stz"
import {shadowElement, useCss, useMount, useOnce} from "@e280/sly"

import styleCss from "./style.css.js"
import devicesSvg from "../../lib/ui/icons/akar/devices.svg.js"
import gameControllerSvg from "../../lib/ui/icons/akar/game-controller.svg.js"

import {Hub} from "../../lib/ui/deck/hub.js"
import {asDeck} from "../../lib/ui/deck/types.js"
import {asBindings} from "../../lib/input/types.js"
import {DeckView} from "../../lib/ui/views/deck/view.js"
import {Controller} from "../../lib/input/controller.js"
import {Sources} from "../../lib/input/sources/sources.js"
import {Controls} from "../../lib/ui/deck/controls/controls.js"
import {autoGamepads} from "../../lib/ui/deck/auto-gamepads.js"
import {PointerSource} from "../../lib/input/sources/pointer.js"
import {KeyboardSource} from "../../lib/input/sources/keyboard.js"

export const setupDemoApp = () => shadowElement(() => {
	useCss(styleCss)

	const deck = useOnce(() => {
		const kv = new Kv()
		const bindings = asBindings({
			interactions: {
				use: "KeyE",
			},
			spatial: {
				looking: {
					horizontal: ["*", ["sum", "pointer.x"], 800],
					vertical: ["*", ["sum", "pointer.y"], 800],
				},
				moving: {
					forward: "KeyW",
					backward: "KeyS",
					leftward: "KeyA",
					rightward: "KeyD",
				},
			},
		})

		const controls = new Controls({kv, stock: {
			standard: {label: "⌨️standard", bindings},
			gamer: {label: "🎮gamer", bindings: {
				interactions: {
					use: "gamepad.1",
				},
				spatial: {
					looking: {
						horizontal: ["*", ["dt"], "gamepad.axis.3", 100],
						vertical: ["*", ["dt"], "gamepad.axis.4", 100],
					},
					moving: {
						forward: ["remap", 0, -1, 0, 1, "gamepad.axis.2"],
						backward: ["remap", 0, 1, 0, 1, "gamepad.axis.2"],
						leftward: ["remap", 0, -1, 0, 1, "gamepad.axis.1"],
						rightward: ["remap", 0, 1, 0, 1, "gamepad.axis.1"],
					},
				},
			}},
			micro: {label: "🦠micro", bindings: {
				interactions: {
					use: ["*", "gamepad.5", "gamepad.6"],
				},
				spatial: {
					looking: {
						horizontal: ["*", ["dt"], ["+", "gamepad.1", ["-", "gamepad.4"]], 100],
						vertical: ["*", ["dt"], ["+", "gamepad.2", ["-", "gamepad.3"]], 100],
					},
					moving: {
						forward: ["remap", 0, -1, 0, 1, "gamepad.axis.2"],
						backward: ["remap", 0, 1, 0, 1, "gamepad.axis.2"],
						leftward: ["remap", 0, -1, 0, 1, "gamepad.axis.1"],
						rightward: ["remap", 0, 1, 0, 1, "gamepad.axis.1"],
					},
				},
			}},
		}})

		const controller = new Controller({
			bindings,
			source: new Sources(
				new KeyboardSource(),
				new PointerSource(),
			),
		})

		controls.attach(controller, {
			icon: devicesSvg,
			handle: "standard",
			name: "keyboard and mouse",
			tooltip: "",
			defaultProfileKey: controls.fallbackProfileKey,
		})

		return asDeck({
			bindings,
			maxPorts: 4,
			controls,
			kv: new Kv(),
			hub: new Hub(bindings).plug(controller),
		})
	})

	useMount(() => autoGamepads(deck.hub, (controller, source) => {
		const handle = `${source.pad.gamepad.id} ${source.pad.gamepad.index + 1}`
		deck.controls.assignments.assign(controller, "gamer")
		deck.controls.attach(controller, {
			icon: gameControllerSvg,
			handle,
			name: handle,
			tooltip: "",
			defaultProfileKey: "gamer",
		})
		return () => deck.controls.detach(controller)
	}))

	useMount(() => cycle(async() => deck.hub.encodeAll()))

	return html`
		<div class=plate>
			${DeckView(deck)}
		</div>
	`
})

