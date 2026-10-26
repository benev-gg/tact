
import {html} from "lit"
import {Kv} from "@e280/kv"
import {cycle} from "@e280/stz"
import {shadowElement, useCss, useMount, useOnce} from "@e280/sly"

import styleCss from "./style.css.js"
import {Hub} from "../../lib/ui/deck/hub.js"
import {asDeck} from "../../lib/ui/deck/types.js"
import {Profiles} from "../../lib/ui/deck/profiles.js"
import {asBindings} from "../../lib/input/types.js"
import {DeckView} from "../../lib/ui/views/deck/view.js"
import {Controller} from "../../lib/input/controller.js"
import {Sources} from "../../lib/input/sources/sources.js"
import {autoGamepads, autoProfile} from "../../lib/ui/deck/auto-gamepads.js"
import {PointerSource} from "../../lib/input/sources/pointer.js"
import {KeyboardSource} from "../../lib/input/sources/keyboard.js"

export const setupDemoApp = () => shadowElement(() => {
	useCss(styleCss)

	const deck = useOnce(() => {
		const bindings = asBindings({use: "KeyE"})
		return asDeck({
			bindings,
			maxPorts: 4,
			kv: new Kv(),
			profiles: new Profiles({
				standard: {bindings, label: "⌨️standard"},
				gamer: {bindings, label: "🎮gamer"},
				micro: {bindings, label: "🦠micro"},
			}),
			hub: new Hub(bindings).plug(new Controller({
				bindings,
				handle: "⌨️keyboard+mouse",
				source: new Sources(
					new KeyboardSource(),
					new PointerSource(),
				),
			})),
		})
	})

	useMount(() => autoGamepads(deck.hub, autoProfile(deck.profiles, "gamer")))
	useMount(() => cycle(async() => deck.hub.encodeAll()))

	return html`
		<div class=plate>
			${DeckView(deck)}
		</div>
	`
})

