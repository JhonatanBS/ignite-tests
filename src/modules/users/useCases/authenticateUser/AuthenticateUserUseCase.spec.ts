import authConfig from '../../../../config/auth';
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from './IncorrectEmailOrPasswordError';


let inMemoryUsersRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User", () => {
	beforeEach(() => {
		inMemoryUsersRepository = new InMemoryUsersRepository();
	  createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
		authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
	});

	it("should be able to authenticate an user", async () => {
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

		expect(result).toHaveProperty("token");

	});

  it("should not be able to authenticate an nonexistent user", () => {
		expect(async () => {
				await authenticateUserUseCase.execute({
					email: "emailnotexists@gmail.com",
					password: "12345"
				});
			}).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
	});

  it("should bot be able to authenticate with incorrect password", () => {
		expect( async () => {
			const user: ICreateUserDTO = {
				name: "Danilo",
				email: "danilo@gmail.com",
				password: "1234567"
			}

			await createUserUseCase.execute(user);

			await authenticateUserUseCase.execute({
				email: user.email,
				password: "incorrectPassword"
			});
		}).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
	});

});