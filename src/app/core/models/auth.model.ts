export interface LoginRequest {
  email: string;
  password: string;
}
export interface AuthResponse {
  //accessToken: string;
  //refreshToken: string;

}
export interface UserInfor {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export interface UserInfoCreate{
name: string;
email: string;
password: string;
}
export interface UserInfoUpdate{
idUser: string|null;
name: string;
email: string;
password?: string;
}
export interface UserRegistered{
name: string;
email: string;
}
