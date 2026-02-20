import { v4 as uuidv4 } from "uuid";
import { users } from "../storage";
import { User } from "../types";
import { CreateUserInput } from "../schemas";
import { saveAll } from "../storage/persistence";

export const userService = {
  getAll(): User[] {
    return Array.from(users.values());
  },

  getById(id: string): User | undefined {
    return users.get(id);
  },

  create(data: CreateUserInput): User {
    const existingEmail = Array.from(users.values()).find(
      (u) => u.email === data.email,
    );
    if (existingEmail) {
      throw new Error(`User with email "${data.email}" already exists`);
    }

    const user: User = {
      id: uuidv4(),
      ...data,
    };
    users.set(user.id, user);
    saveAll();
    return user;
  },
};
