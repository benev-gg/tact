
export function* backwards<X>(items: X[]) {
	for (let i = items.length - 1; i >= 0; i--)
		yield items[i]
}

