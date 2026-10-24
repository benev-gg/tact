
import {html} from "lit"
import {Kv} from "@e280/kv"
import {shadowElement, useCss, useOnce} from "@e280/sly"

import styleCss from "./style.css.js"
import {Hub} from "../../lib/deck/hub.js"
import {primaryController, Profiles} from "../../lib/deck/deck.js"
import {DeckView} from "../../lib/views/deck.js"
import {asBindings} from "../../lib/input/types.js"
import {Controller} from "../../lib/input/controller.js"
import {Sources} from "../../lib/input/sources/sources.js"
import {PointerSource} from "../../lib/input/sources/pointer.js"
import {KeyboardSource} from "../../lib/input/sources/keyboard.js"

export const setupDemoApp = () => shadowElement(() => {
	useCss(styleCss)

	const kv = useOnce(() => new Kv())
	const bindings = useOnce(() => asBindings("KeyW"))
	const hub = useOnce(() => new Hub(bindings))

	const profiles = useOnce(() => new Profiles({
		primary: {bindings, label: "⌨️keyboard+mouse"},
		gamepad: {bindings, label: "🎮gamepad"},
	}))

	useOnce(() => primaryController(hub, profiles, new Controller({
		bindings,
		handle: "keyboard+mouse",
		source: new Sources(
			new KeyboardSource(),
			new PointerSource(),
		),
	})))

	return html`
		<div class=plate>
			${DeckView({kv, bindings, hub, profiles})}
		</div>
	`
})

