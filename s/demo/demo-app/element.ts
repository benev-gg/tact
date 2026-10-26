
import {html} from "lit"
import {Kv} from "@e280/kv"
import {cycle} from "@e280/stz"
import {shadowElement, useCss, useMount, useOnce} from "@e280/sly"

import styleCss from "./style.css.js"
import {Hub} from "../../lib/ui/deck/hub.js"
import {asDeck} from "../../lib/ui/deck/types.js"
import {asBindings} from "../../lib/input/types.js"
import {Profiles} from "../../lib/ui/deck/profiles.js"
import {DeckView} from "../../lib/ui/views/deck/view.js"
import {Controller} from "../../lib/input/controller.js"
import {Sources} from "../../lib/input/sources/sources.js"
import keyCapSvg from "../../lib/ui/icons/akar/key-cap.svg.js"
import {autoGamepads} from "../../lib/ui/deck/auto-gamepads.js"
import {PointerSource} from "../../lib/input/sources/pointer.js"
import {KeyboardSource} from "../../lib/input/sources/keyboard.js"
import {ControllerInfo} from "../../lib/ui/deck/controller-info.js"
import gameControllerSvg from "../../lib/ui/icons/akar/game-controller.svg.js"
import { ColorWheel } from "../../lib/ui/deck/color-wheel.js"

export const setupDemoApp = () => shadowElement(() => {
	useCss(styleCss)

	const colorWheel = useOnce(() => new ColorWheel())

	const deck = useOnce(() => {
		const bindings = asBindings({use: "KeyE"})
		const controller = new Controller({
			bindings,
			source: new Sources(
				new KeyboardSource(),
				new PointerSource(),
			),
		})
		const controllerInfo = new ControllerInfo()
		controllerInfo.set(controller, {
			icon: keyCapSvg,
			hue: colorWheel.hue,
			name: "keyboard and mouse",
			tooltip: "",
		})
		return asDeck({
			bindings,
			maxPorts: 4,
			controllerInfo,
			kv: new Kv(),
			hub: new Hub(bindings).plug(controller),
			profiles: new Profiles({
				standard: {bindings, label: "⌨️standard"},
				gamer: {bindings, label: "🎮gamer"},
				micro: {bindings, label: "🦠micro"},
			}),
		})
	})

	useMount(() => autoGamepads(deck.hub, (controller, source) => {
		deck.profiles.assign(controller, "gamer")
		deck.controllerInfo.set(controller, {
			icon: gameControllerSvg,
			hue: colorWheel.hue,
			name: `${source.pad.gamepad.id} ${source.pad.gamepad.index + 1}`,
			tooltip: "",
		})
	}))

	useMount(() => cycle(async() => deck.hub.encodeAll()))

	return html`
		<div class=plate>
			${DeckView(deck)}
		</div>
	`
})

