import { EntityRepository, Repository } from "typeorm";
import { Todo } from "../entities/Todo";

@EntityRepository(Todo)
class TodosRepository extends Repository<Todo> {}

export { TodosRepository };
