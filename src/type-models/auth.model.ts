
export interface AuthRegisterCredential {
    name: string,
    email: string,
    password?: string,
    gId?: string
    role?: 'admin' | 'trainer' | 'user',
    photoUrl?: string
}
