
import {html} from "lit"
import {shadowView, useCss} from "@e280/sly"
import styleCss from "./style.css.js"
import themeCss from "../theme.css.js"
import {Deck} from "../../deck/types.js"

export const BindingsView = shadowView((options: {deck: Deck}) => {
	useCss(themeCss, styleCss)
	void options

	return html`
		<div class=plate>
			<h3>bindpanel</h3>
		</div>
	`
})

