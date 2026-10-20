
import {html} from "lit"
import {shadowElement, useCss} from "@e280/sly"
import styleCss from "./style.css.js"

export const setupDemoApp = () => shadowElement(() => {
	useCss(styleCss)

	return html`
		<div class=plate>
			coming soon, lol
		</div>
	`
})

