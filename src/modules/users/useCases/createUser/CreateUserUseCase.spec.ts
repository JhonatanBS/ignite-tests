import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create User UseCase", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to create new user", async () => {
    const user = {
      name: "Dani",
      email: "dani@rocketseat.com",
      password: "1234"
    }

    const newUser = await createUserUseCase.execute(user);

    expect(newUser).toHaveProperty("id");
  });

  it("should not be able to create a new user that already exists", async () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "Dani",
        email: "dani@rocketseat.com",
        password: "1234"
      });

      await createUserUseCase.execute({
        name: "Dani",
        email: "dani@rocketseat.com",
        password: "1234"
      });
    }).rejects.toBeInstanceOf(CreateUserError);

  });
});
