
import {html} from "lit"
import {lightView} from "@e280/sly"
import {Controls} from "../../deck/controls/controls.js"

export const ProfileSelectView = lightView((
		deck: {controls: Controls},
		currentProfileKey: string,
		onChange: (key: string) => void,
	) => {

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

