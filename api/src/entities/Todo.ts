import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { v4 as uuid } from "uuid";

import { User } from "./User";

@Entity("todos")
class Todo {
  @PrimaryColumn()
  id: string;

  @Column()
  text: string;

  @Column()
  hasCompleted: boolean;

  @Column()
  order: number;

  @Column()
  user_id: string;

  @JoinColumn({ name: "user_id" })
  @ManyToOne(() => User)
  user: User;

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}

export { Todo };
