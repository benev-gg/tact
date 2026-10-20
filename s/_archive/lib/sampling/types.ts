
export type Sample = {
	code: string
	value: number
}

export type Source = {
	readonly samples: Sample[]
	dispose?: () => void
}

