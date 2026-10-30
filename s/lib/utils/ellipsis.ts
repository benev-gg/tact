
export function ellipsis(s: string, max: number) {
	return s.length > max
		? s.slice(0, max) + "..."
		: s
}

