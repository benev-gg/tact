
import {html} from "lit"
import {Kv} from "@e280/kv"
import {shadowElement, useCss, useOnce} from "@e280/sly"

import styleCss from "./style.css.js"
import {Hub} from "../../lib/deck/hub.js"
import {Deck} from "../../lib/deck/deck.js"
import {DeckView} from "../../lib/views/deck.js"
import {asBindings} from "../../lib/input/types.js"
import {Sources} from "../../lib/input/sources/sources.js"
import {PointerSource} from "../../lib/input/sources/pointer.js"
import {KeyboardSource} from "../../lib/input/sources/keyboard.js"
import { Controller } from "../../lib/input/controller.js"

export const setupDemoApp = () => shadowElement(() => {
	useCss(styleCss)
	const bindings = useOnce(() => asBindings("KeyW"))

	const deck = useOnce(() => new Deck({
		bindings,
		kv: new Kv(),
		hub: new Hub(bindings),
		primary: {
			profile: "primary",
			controller: new Controller({
				bindings,
				handle: "keyboard+mouse",
				source: new Sources(
					new KeyboardSource(),
					new PointerSource(),
				),
			}),
		},
		profiles: {
			primary: {bindings, label: "⌨️keyboard+mouse"},
			gamepad: {bindings, label: "🎮gamepad"},
		},
	}))

	return html`
		<div class=plate>
			${DeckView(deck)}
		</div>
	`
})

