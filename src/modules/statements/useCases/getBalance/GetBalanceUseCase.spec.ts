import { JWTTokenMissingError } from "../../../../shared/errors/JWTTokenMissingError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "../../../users/useCases/authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceUseCase } from "./GetBalanceUseCase";


let inMemoryUsersRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let getBalanceUseCase: GetBalanceUseCase;

describe("Get Balance UseCase", () => {
	beforeEach(() => {
		inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
		createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
		authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository,inMemoryStatementsRepository);
	  getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository);
	});

	it("should be able to see all the statements", async () => {

		const user: ICreateUserDTO = {
			name: "Dani",
			email: "dani@gmail.com",
			password: "1234"
		}

		await createUserUseCase.execute(user);

		const result = await authenticateUserUseCase.execute({
			email: user.email,
			password: user.password
		});

		const { id } = result.user;

		const allBalance = await getBalanceUseCase.execute({
      user_id: id as string,
		});

		expect(allBalance.statement).toEqual([]);
		expect(allBalance).toHaveProperty("balance");
	});

	it("should not be able to acess all the statements", async () => {

		const user: ICreateUserDTO = {
			name: "Dani",
			email: "dani@gmail.com",
			password: "1234"
		}

		const createUser = await createUserUseCase.execute(user);

    expect(async () => {
      await getBalanceUseCase.execute({
				user_id: createUser.id as string
			});
		}).not.toHaveProperty("token");
	});

});