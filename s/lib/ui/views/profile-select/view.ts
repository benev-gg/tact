
import {html} from "lit"
import {shadowView, useCss} from "@e280/sly"
import styleCss from "./style.css.js"
import themeCss from "../theme.css.js"
import {Deck} from "../../deck/types.js"

export const ProfileSelectView = shadowView((
		deck: Deck,
		currentProfileKey: string,
		onChange: (key: string) => void,
	) => {

	useCss(themeCss, styleCss)

	function handleChange(event: Event) {
		const select = event.currentTarget as HTMLSelectElement
		onChange(select.value)
	}

	return html`
		<select @change=${handleChange}>
			${Array.from(deck.profiles.all()).map(([key, profile]) => html`
				<option
					value="${key}"
					?selected="${key === currentProfileKey}">
					${profile.label}
				</option>
			`)}
		</select>
	`
})

