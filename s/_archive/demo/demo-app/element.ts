
import {html} from "lit"
import {shadowElement, useCss} from "@e280/sly"
import styleCss from "./style.css.js"
import {Deck} from "../../deck/deck.js"
import {DeskOptions, DeskView} from "../../ui/views/desk/view.js"

export const setupDemoApp = (deck: Deck, options: DeskOptions = {}) => shadowElement(() => {
	useCss(styleCss)

	return html`
		<div class=plate>
			${DeskView(deck, options)}
		</div>
	`
})

