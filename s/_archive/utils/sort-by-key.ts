
export function sortByKey<X extends [key: string, unknown]>([a]: X, [b]: X) {
	return (a === b)
		? 0
		: (a < b) ? -1 : 1
}

