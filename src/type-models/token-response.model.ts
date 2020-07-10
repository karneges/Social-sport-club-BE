export interface TokenResponseModel {
    success: boolean,
    token: string,
    expiresIn: Date,
    refreshToken: string
}
