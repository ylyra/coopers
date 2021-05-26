import { getCustomRepository, Repository } from "typeorm";

import { Todo } from "../entities/Todo";
import { TodosRepository } from "../repositories/TodosRepository";

type ICreateTodo = {
  text: string;
  user_id: string;
};

type IUpdateTodo = {
  text?: string;
  hasCompleted?: boolean;
};

class TodosService {
  private todosRepository: Repository<Todo>;

  constructor() {
    this.todosRepository = getCustomRepository(TodosRepository);
  }

  async findAllFromUser(user_id: string) {}

  async create({ text, user_id }: ICreateTodo) {}

  async update(id: string, updateValues: IUpdateTodo) {}

  async delete(id: string) {}
}

export { TodosService };
