
import {template, html, dataSvgEmoji, socialCard} from "@e280/scute"

const title = "@benev/tact"
const domain = "tact.benev.gg"
const favicon = "/assets/b.png"
const description = "🎮 keybindings and couch co-op"

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
			<link rel="stylesheet" href="${orb.hashurl("demo/main.css")}"/>
			<script type="module" src="${orb.hashurl("demo/main.bundle.min.js")}"></script>

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
					<strong>@benev/tact</strong>
					<small>v${orb.packageVersion()}</small>
				</h1>
				<div>
					<blockquote>"from keypress to couch co-op"</blockquote>
					<p>
						<a href="./gamepad/">gamepad visualizer</a>.
					</p>
					<p>
						<a href="https://github.com/benev-gg/tact">github</a>.
						<a href="https://benev.gg/">benev.gg</a>.
					</p>
				</div>
			</header>

			<demo-app></demo-app>
		</body>
	</html>
`)

