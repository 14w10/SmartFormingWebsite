type UserRole = keyof typeof import('./constants').USER_ROLES;

interface User {
  id: ID;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  signup: SignUpRequest;
  title: string;
  updatedAt: string;
}

interface Admin {
  id: ID;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  updatedAt: string;
}
interface Editor {
  id: ID;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  updatedAt: string;
}

type CurrentUser = Admin | User | undefined;
