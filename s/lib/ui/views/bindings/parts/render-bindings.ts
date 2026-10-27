
import {html} from "lit"
import {Content} from "@e280/sly"
import {Bindings} from "../../../../input/types.js"
import {ExpressionView} from "../subviews/expression.js"
import {isExpression} from "../../../../input/investigate/is-expression.js"

export function renderBindings(
		bindings: Bindings,
		update: (b: Bindings) => void,
	): Content {

	if (isExpression(bindings))
		return ExpressionView(bindings, update)

	return Object.entries(bindings).map(([key, child]) => (
		isExpression(child)
			? renderExpression(bindings, update, key, child)
			: renderGroup(bindings, update, key, child)
	))
}

function renderGroup(
		bindings: Record<string, Bindings>,
		update: (b: Bindings) => void,
		key: string,
		child: Bindings,
	) {

	return html`
		<details class=group open>
			<summary>${key}</summary>
			<div class=children>
				${renderBindings(
					child,
					fresh => update({...bindings, [key]: fresh}),
				)}
			</div>
		</details>
	`
}

function renderExpression(
		bindings: Record<string, Bindings>,
		update: (b: Bindings) => void,
		key: string,
		child: Bindings,
	) {

	return html`
		<div class=expression>
			<strong>${key}</strong>
			${renderBindings(
				child,
				fresh => update({...bindings, [key]: fresh}),
			)}
		</div>
	`
}

