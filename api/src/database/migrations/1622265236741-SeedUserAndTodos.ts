import { getRepository, MigrationInterface, QueryRunner } from "typeorm";
import bcrypt from "bcrypt";

import { User } from "../seed/UserSeed";
import { TodosSeed } from "../seed/TodosSeed";

export class SeedUserAndTodos1622265236741 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const pass = await bcrypt.hash("123", 10);
    User.password = pass;
    const user = await getRepository("users").save(User);

    TodosSeed.map(async (todo) => {
      const todoSeed = todo;
      todoSeed.user_id = user.id;

      await getRepository("todos").save(todoSeed);
    });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    //  do nothing
  }
}
