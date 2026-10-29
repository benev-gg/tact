
import {html} from "lit"
import {shadowView, useCss, useName} from "@e280/sly"
import styleCss from "./style.css.js"
import themeCss from "../theme.css.js"
import {Deck} from "../../deck/types.js"

export const ProfileSelectView = shadowView((
		deck: Deck,
		currentProfileKey: string,
		onChange: (key: string) => void,
	) => {

	useName("profile-select")
	useCss(themeCss, styleCss)
	const {profiles} = deck.controls

	function handleChange(event: Event) {
		const select = event.currentTarget as HTMLSelectElement
		onChange(select.value)
	}

	return html`
		<select
			part=select
			theme-select
			.value="${currentProfileKey}"
			@change="${handleChange}">

			${profiles.stocks.map(([key, profile]) => html`
				<option
					value="${key}"
					?selected="${key === currentProfileKey}">
					${profile.label}
				</option>
			`)}

			${profiles.customs.map(([key, profile]) => html`
				<option
					value="${key}"
					?selected="${key === currentProfileKey}">
					${profile.label}
				</option>
			`)}
		</select>
	`
})

