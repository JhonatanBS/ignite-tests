import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from '../authenticateUser/AuthenticateUserUseCase';
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Authenticate User", () => {
	beforeEach(() => {
		inMemoryUsersRepository = new InMemoryUsersRepository();
		createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
		authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
        showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
	});

	it("should be able of to obtain the return of user ", async () => {
		const newUser: ICreateUserDTO = {
			name: "Dani",
			email: "dani@gmail.com",
			password: "1234"
		}

		await createUserUseCase.execute(newUser);

		const result = await authenticateUserUseCase.execute({
			email: newUser.email,
			password: newUser.password
		});

		const { id } = result.user;

		const user = await showUserProfileUseCase.execute(id as string);
		
		expect(user.id).toEqual(id);
	});

	it("should not be able of to obtain the return of other users ", async () => {

		const newUser: ICreateUserDTO = {
			name: "Dani",
			email: "dani@gmail.com",
			password: "1234"
		};

		await createUserUseCase.execute(newUser);

		const otherUser = {
			id: "7",
			name: "Diego",
			email: "diego@gmail.com",
			password: "1234"
		};
	
		const result = await authenticateUserUseCase.execute({
			email: newUser.email,
			password: newUser.password
		});

		// Try to return another user's profile in your profile
		expect(async () => {
			await showUserProfileUseCase.execute(result.user.id = otherUser.id);
		}).rejects.toBeInstanceOf(ShowUserProfileError);
	});

});