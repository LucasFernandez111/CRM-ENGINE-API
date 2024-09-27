import { User } from 'src/schemas';

type PartialUser = Omit<User, 'address' | 'company' | 'phone' | 'sheetId' | 'phone'>;
export class CreateUserDto implements PartialUser {
  id_token: string;
  refresh_token: string;
  firstName: string;
  lastName: string;
  email: string;
  picture: string;
}
