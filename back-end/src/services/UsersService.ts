import { getCustomRepository, Repository } from "typeorm";

import { User } from "../entities/User";
import { UsersRepository } from "../repositories/UsersRepository";

type IUserProps = {
  email?: string;
  password?: string;
  token?: string;
};

class UsersService {
  private usersRepository: Repository<User>;

  constructor() {
    this.usersRepository = getCustomRepository(UsersRepository);
  }

  async findUser({ email }: IUserProps) {
    try {
      const user = await this.usersRepository.findOne({ email });

      return user;
    } catch (err) {}
  }

  async createUser({ email, password }: IUserProps) {
    try {
      const user = this.usersRepository.create({
        email,
        password,
      });
      await this.usersRepository.save(user);

      return user;
    } catch (err) {}
  }

  async updateUser(id: string, values: IUserProps) {
    try {
      const userExists = await this.usersRepository.findOne({
        id,
      });

      if (userExists) {
        await this.usersRepository
          .createQueryBuilder()
          .update(User)
          .set({
            ...userExists,
            ...values,
          })
          .where("id = :id", {
            id,
          })
          .execute();

        return userExists;
      }
    } catch (err) {}
  }

  async validateToken(token: string) {
    try {
      const user = await this.usersRepository.findOne({ token });

      return user;
    } catch (err) {}
  }
}

export { UsersService };
