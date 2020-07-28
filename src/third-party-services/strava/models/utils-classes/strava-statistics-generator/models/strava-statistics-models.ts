export interface StravaStatisticConfig<T extends string | Date> {
    date: {
        bottomBarerDate: T,
        topBarerDate: T
    },
    fields: TrainingValues[]
}

export interface ActivitiesStatisticValues {
    min: number,
    max: number,
    sum: number,
    avg: number
    sportType: string
}

export type TrainingValues = 'elapsed_time'
    | 'distance'
    | 'moving_time'
    | 'total_elevation_gain'
    | 'athlete_count'
    | 'average_speed'
    | 'max_speed'
    | 'average_watts'
    | 'kilojoules'
export type SportTypes = 'Run' | 'Ride' | 'NordicSki' | 'Walk'
