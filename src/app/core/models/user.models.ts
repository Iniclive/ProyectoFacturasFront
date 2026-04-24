export interface User {
  idUser: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export interface UpdatePasswordRequest{
currentPassword: string;
newPassword: string;
}
export interface UpdateNameRequest{
name: string;
}
export interface UpdateEmailRequest{
email: string;
}
