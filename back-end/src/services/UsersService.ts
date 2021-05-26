import { getCustomRepository, Repository } from "typeorm";

import { User } from "../entities/User";
import { UsersRepository } from "../repositories/UsersRepository";

type IUserProps = {
  email: string;
  password: string;
};

class UsersService {
  private usersRepository: Repository<User>;

  constructor() {
    this.usersRepository = getCustomRepository(UsersRepository);
  }

  async findUser({ email, password }: IUserProps) {}

  async createUser({ email, password }: IUserProps) {}

  async validateToken(token: string) {}
}

export { UsersService };
