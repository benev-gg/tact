
import {template, html, dataSvgEmoji, socialCard} from "@e280/scute"

const title = "@benev/tact gamepad"
const domain = "tact.benev.gg"
const favicon = "/assets/b.png"
const description = "tact gamepad tester"

export default template(import.meta.url, async orb => html`
	<!doctype html>
	<html>
		<head>
			<title>${title}</title>

			<meta charset="utf-8"/>
			<meta name="viewport" content="width=device-width,initial-scale=1"/>
			<meta name="darkreader-lock"/>
			<style>@layer base{html{background:#000}}</style>

			<link rel="icon" href="${dataSvgEmoji("🎮")}"/>
			<link rel="stylesheet" href="${orb.hashurl("main.css")}"/>
			<script type="module" src="${orb.hashurl("main.bundle.min.js")}"></script>

			${socialCard({
				title,
				description,
				themeColor: "#f2ea8e",
				siteName: domain,
				image: `https://${domain}${favicon}`,
			})}
		</head>
		<body>
			<header>
				<h1>
					<strong>@benev/tact gamepad</strong>
					<small>v${orb.packageVersion()}</small>
				</h1>
			</header>

			<gamepad-app></gamepad-app>
		</body>
	</html>
`)

