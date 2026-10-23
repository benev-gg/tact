
import {html} from "lit"
import {Kv} from "@e280/kv"
import {shadowElement, useCss, useOnce} from "@e280/sly"

import styleCss from "./style.css.js"
import {Hub} from "../../lib/deck/hub.js"
import {Deck} from "../../lib/deck/deck.js"
import {Profiles} from "../../lib/deck/profiles.js"
import {asBindings, DeckView} from "../../lib/index.js"

export const setupDemoApp = () => shadowElement(() => {
	useCss(styleCss)
	const bindings = useOnce(() => asBindings("KeyW"))

	const deck = useOnce(() => new Deck({
		kv: new Kv(),
		hub: new Hub({bindings, portCount: 4}),
		profiles: new Profiles({
			bindings,
			stock: {standard: {label: "standard", bindings}},
		}),
	}))

	return html`
		<div class=plate>
			${DeckView(deck)}
		</div>
	`
})

