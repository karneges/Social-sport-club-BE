import * as mongoose from 'mongoose';

const StravaTrainSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        resource_state: Number,
        name: String,
        distance: Number,
        moving_time: Number,
        elapsed_time: Number,
        total_elevation_gain: Number,
        type: String,
        workout_type: String,
        id: Number,
        external_id: String,
        upload_id: Number,
        start_date: Date,
        start_date_local: Date,
        start_latlng: {
            type: [Number],
            required: true
        },
        end_latlng: {
            type: [Number],
            required: true
        },
        location_city: String,
        location_state: String,
        location_country: String,
        achievement_count: Number,
        kudos_count: Number,
        comment_count: Number,
        athlete_count: Number,
        photo_count: Number,
        map: {
            id: String,
            summary_polyline: String,
            resource_state: Number
        },
        trainer: Boolean,
        commute: Boolean,
        manual: Boolean,
        private: Boolean,
        flagged: Boolean,
        gear_id: String,
        from_accepted_tag: Boolean,
        average_speed: Number,
        max_speed: Number,
        average_cadence: Number,
        average_watts: Number,
        weighted_average_watts: Number,
        kilojoules: Number,
        device_watts: Boolean,
        has_heartrate: Boolean,
        average_heartrate: Number,
        max_heartrate: Number,
        max_watts: Number,
        pr_count: Number,
        total_photo_count: Number,
        has_kudoed: Boolean,
        suffer_score: Number
    })
export default mongoose.model<StravaTrainModel>('Strava-Train', StravaTrainSchema)

export interface StravaTrainBaseModel extends StravaTrainResponseModel{
    user: mongoose.Schema.Types.ObjectId | string
}

export interface StravaTrainModel extends StravaTrainBaseModel, mongoose.Document {

}
export interface StravaTrainResponseModel {
    resource_state: number,
    name: string,
    distance: number,
    moving_time: number,
    elapsed_time: number,
    total_elevation_gain: number,
    type: string,
    workout_type: string,
    external_id: string,
    upload_id: number,
    start_date: Date,
    start_date_local: string,
    start_latlng: {
        type: String,
        enum: ['Point'],
        required: true
    }
    end_latlng: {
        type: String,
        enum: ['Point'],
        required: true
    }
    location_city: string,
    location_state: string,
    location_country: string,
    achievement_count: number,
    kudos_count: number,
    comment_count: number,
    athlete_count: number,
    photo_count: number,
    map: {
        id: string,
        summary_polyline: string,
        resource_state: number
    },
    trainer: boolean,
    commute: boolean,
    manual: boolean,
    private: boolean,
    flagged: boolean,
    gear_id: string,
    from_accepted_tag: boolean,
    average_speed: number,
    max_speed: number,
    average_cadence: number,
    average_watts: number,
    weighted_average_watts: number,
    kilojoules: number,
    device_watts: boolean,
    has_heartrate: boolean,
    average_heartrate: number,
    max_heartrate: number,
    max_watts: number,
    pr_count: number,
    total_photo_count: number,
    has_kudoed: boolean,
    suffer_score: number
}

