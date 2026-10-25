
import {html} from "lit"
import {ShinyTabs, TabsControl} from "@e280/shiny"
import {shadowDuplex, useCss, useOnce} from "@e280/sly"

import {Deck} from "../../deck/types.js"
import {PortpanelView} from "./subviews/portpanel.js"
import {BindpanelView} from "./bindpanel/bindpanel.js"

import styleCss from "./style.css.js"
import themeCss from "../theme.css.js"

export const [DeckView, makeDeck] = shadowDuplex((options: {deck: Deck, maxPorts: number}) => {
	useCss(themeCss, styleCss)
	const tabsControl = useOnce(() => new TabsControl())

	return ShinyTabs.with({
		props: [{snug: true, control: tabsControl}],
		children: html`
			<button>ports</button>
			<button>bindings</button>

			${PortpanelView(options)}
			${BindpanelView(options)}
		`,
	})
})

