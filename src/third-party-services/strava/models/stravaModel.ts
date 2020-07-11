import * as mongoose from 'mongoose';

const StravaSchena = new mongoose.Schema(
    {
        token_type: String,
        expires_at: Number,
        expires_in: Number,
        refresh_token: String,
        access_token: String,
        athlete: {
            id: Number,
            username: String,
            resource_state: Number,
            firstname: String,
            lastname: String,
            city: String,
            state: String,
            country: String,
            sex: String,
            premium: Boolean,
            created_at: Date,
            updated_at: Date,
            badge_type_id: Number,
            profile_medium: String,
            profile: String,
            friend: String,
            follower: String,
            follower_count: Number,
            friend_count: Number,
            mutual_friend_count: Number,
            athlete_type: Number,
            date_preference: Date,
            measurement_preference: String,
            clubs: [],
            ftp: String,
            weight: Number,
        },
    }
)
export default mongoose.model<StravaModel>('Strava', StravaSchena)

export interface StravaBaseModel {
    expires_at: number,
    expires_in: number,
    refresh_token: string,
    access_token: string,
    athlete?: {
        id: number,
        username: string,
        resource_state: number,
        firstname: string,
        lastname: string,
        city: string,
        state: string,
        country: string,
        sex: string,
        premium: Boolean,
        created_at: string,
        updated_at: string,
        badge_type_id: number,
        profile_medium: string,
        profile: string,
        friend: string,
        follower: string,
        follower_count: number,
        friend_count: number,
        mutual_friend_count: number,
        athlete_type: number,
        date_preference: string,
        measurement_preference: string,
        clubs: [],
        ftp: string,
        weight: number,
    }
}

export interface StravaModel extends mongoose.Document, StravaBaseModel {

}
