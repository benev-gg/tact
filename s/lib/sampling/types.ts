
export type Sample = [time: number, code: string, value: number]

export type Source = {
	readonly samples: Sample[]
	dispose?: () => void
}

