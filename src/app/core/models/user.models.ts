export interface User {
  idUser: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}
