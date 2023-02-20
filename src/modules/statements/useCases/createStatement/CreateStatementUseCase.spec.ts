import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "../../../users/useCases/authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { ICreateStatementDTO } from "./ICreateStatementDTO";

let inMemoryUsersRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Create Statement UseCase", () => {
	beforeEach(() => {
		inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
		createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
		authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository,inMemoryStatementsRepository);
	});

	it("should be able to create statement for deposit", async () => {

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

		const deposit: ICreateStatementDTO = {
			user_id: id as string,
      type: OperationType.DEPOSIT,
			amount: 900,
			description: "Statement of deposit"
		}

		const statement = await createStatementUseCase.execute(deposit);

		expect(statement).toHaveProperty("id");
	});

	it("should be able to create statements for withdraw", async () => {

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

		const deposit: ICreateStatementDTO = {
			user_id: id as string,
      type: OperationType.DEPOSIT,
			amount: 900,
			description: "Statement of deposit"
		}

		const statementDeposit = await createStatementUseCase.execute(deposit);

		const withdraw: ICreateStatementDTO = {
			user_id: id as string,
      type: OperationType.WITHDRAW,
			amount: 500,
			description: "Statement of deposit"
		}

		const statementWithdraw = await createStatementUseCase.execute(withdraw);

		expect(statementWithdraw).toHaveProperty("id");
	});

	it("should not be able to create statement of withdraw", async () => {

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

		const withdraw: ICreateStatementDTO = {
			user_id: id as string,
      type: OperationType.WITHDRAW,
			amount: 500,
			description: "Statement of deposit"
		}

    expect(async () => {
			await createStatementUseCase.execute(withdraw);
		}).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
	});
});