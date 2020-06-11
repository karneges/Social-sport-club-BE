
export interface AuthRegisterCredential {
    name: string,
    email: string,
    password: string,
    role?: 'admin' | 'trainer' | 'user'
}
