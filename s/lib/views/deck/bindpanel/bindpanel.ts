
import {html} from "lit"
import {lightView} from "@e280/sly"

export const BindpanelView = lightView((o: {}) => {
	return html`
		<div slot=panel class=bindpanel>
			<h3>bindpanel</h3>
		</div>
	`
})

