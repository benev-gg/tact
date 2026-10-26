
import {html} from "lit"
import {ShinyTabs, TabsControl} from "@e280/shiny"
import {shadowDuplex, useCss, useOnce} from "@e280/sly"

import styleCss from "./style.css.js"
import themeCss from "../theme.css.js"

import {Deck} from "../../deck/types.js"
import {PortsView} from "../ports/view.js"
import {BindingsView} from "../bindings/view.js"

export const [DeckView, makeDeck] = shadowDuplex((deck: Deck) => {
	useCss(themeCss, styleCss)

	const attrs = {slot: "panel"}
	const tabsControl = useOnce(() => new TabsControl())

	return ShinyTabs.with({
		props: [{control: tabsControl}],
		children: html`
			<button theme-button>ports</button>
			<button theme-button>bindings</button>

			${PortsView.with({attrs, props: [deck]})}
			${BindingsView.with({attrs, props: [deck]})}
		`,
	})
})

