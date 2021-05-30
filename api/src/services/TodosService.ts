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
  order?: number;
};

class TodosService {
  private todosRepository: Repository<Todo>;

  constructor() {
    this.todosRepository = getCustomRepository(TodosRepository);
  }

  async findAllFromUser(user_id: string) {
    try {
      const allTodos = await this.todosRepository.find({
        where: { user_id },
        order: {
          order: "ASC",
        },
      });

      const todos = allTodos.filter((todo) => !todo.hasCompleted);
      const completedTodos = allTodos.filter((todo) => todo.hasCompleted);

      return { todos, completedTodos };
    } catch (err) {}
  }

  async create({ text, user_id }: ICreateTodo) {
    try {
      const todo = this.todosRepository.create({
        text,
        user_id,
        hasCompleted: false,
      });
      await this.todosRepository.save(todo);

      return todo;
    } catch (err) {}
  }

  async update(id: string, updateValues: IUpdateTodo) {
    try {
      const todoExists = await this.todosRepository.findOne({
        id,
      });

      if (todoExists) {
        await this.todosRepository
          .createQueryBuilder()
          .update(Todo)
          .set({
            ...todoExists,
            ...updateValues,
          })
          .where("id = :id", {
            id,
          })
          .execute();

        return await this.todosRepository.findOne({
          id,
        });
      }
    } catch (err) {}
  }

  async reoderTodos(todos: Todo[], completedTodos: Todo[]) {
    try {
      todos.map(async (todo, index) => {
        const finalTodo = todo;
        finalTodo.order = index + 1;

        await this.todosRepository.save(finalTodo);
      });

      completedTodos.map(async (todo, index) => {
        const finalTodo = todo;
        finalTodo.order = index + 1;

        await this.todosRepository.save(finalTodo);
      });
    } catch (err) {}
  }

  async delete(id: string): Promise<boolean> {
    try {
      const todoExists = await this.todosRepository.findOne({
        id,
      });

      if (todoExists) {
        await this.todosRepository
          .createQueryBuilder()
          .delete()
          .from(Todo)
          .where("id = :id", { id })
          .execute();

        return true;
      }

      return false;
    } catch (err) {}

    return false;
  }

  async deleteAll(user_id: string, hasCompleted: boolean): Promise<boolean> {
    try {
      const todoExists = await this.todosRepository.findOne({
        hasCompleted,
        user_id,
      });

      if (todoExists) {
        await this.todosRepository
          .createQueryBuilder()
          .delete()
          .from(Todo)
          .where("user_id = :user_id AND hasCompleted = :hasCompleted", {
            user_id,
            hasCompleted,
          })
          .execute();

        return true;
      }

      return false;
    } catch (err) {}

    return false;
  }
}

export { TodosService };
