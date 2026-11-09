
import {html} from "lit"
import {ShinyTabs, TabsControl} from "@e280/shiny"
import {shadowDuplex, useCss, useName, useOnce} from "@e280/sly"

import styleCss from "./style.css.js"
import themeCss from "../theme.css.js"
import gameControllerSvg from "../../icons/akar/game-controller.svg.js"
import settingsHorizontalSvg from "../../icons/akar/settings-horizontal.svg.js"

import {Deck} from "../../deck/types.js"
import {CustomizeView} from "../customize/view.js"
import {ControllersView} from "../controllers/view.js"

export const [DeckView, makeDeckElement] = shadowDuplex((deck: Deck) => {
	useName("deck")
	useCss(themeCss, styleCss)
	const tabsControl = useOnce(() => new TabsControl())

	// TODO remove this
	useOnce(() => {
		if (window.location.hash.includes("bindings"))
			tabsControl.setIndex(1)
	})

	return html`
		<div part=plate theme-card>
			${ShinyTabs.with({
				props: [{control: tabsControl}],
				children: html`
					<button theme-button>
						${gameControllerSvg}
						<span>controllers</span>
					</button>

					<button theme-button>
						${settingsHorizontalSvg}
						<span>customize</span>
					</button>

					${ControllersView.with({
						props: [deck],
						attrs: {
							slot: "panel",
							exportparts: "plate:controllers-plate",
						},
					})}

					${CustomizeView.with({
						props: [deck],
						attrs: {
							slot: "panel",
							exportparts: "plate:customize-plate, playerlist:customize-playerlist",
						},
					})}
				`,
			})}
		</div>
	`
})

