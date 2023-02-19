import { hash } from "bcryptjs";
import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { v4 as uuidV4 } from "uuid";

import { app } from "../../../../app";

let connection: Connection;

describe("Get Balance Controller", () => {
	beforeAll(async () => {

		connection = await createConnection();
		await connection.runMigrations();

		const id = uuidV4();
		const password = await hash("1234", 8);

		await connection.query(
		`INSERT INTO USERS(id, name, email, password, created_at, updated_at) 
        values('${id}', 'test', 'test@gmail.com', '${password}', 'now()', 'now()')`
		);
	});

	afterAll(async () => {
		await connection.dropDatabase();
		await connection.close();
	});

	it("shoud be able of show all statements from balance", async () => {

		const loginUser = await request(app).post("/api/v1/sessions").send({
			email: 'test@gmail.com',
			password: '1234'
		});

		const { id : user_id} = loginUser.body.user;
		const { token } = loginUser.body;

		const createStatement = {
			amount: 500,
			description: "Deposit with Pix"
		}

		const deposit = await request(app).post("/api/v1/statements/deposit").send({
			id: user_id,
			amount: createStatement.amount,
			type: "deposit",
			description: createStatement.description
		}).set({
			Authorization: `Bearer ${token}`
		});

    const { id } = deposit.body;

		const response = await request(app).get(`/api/v1/statements/${id}`).send({
      user_id,
			statement_id: id
		}).set({
			Authorization: `Bearer ${token}`
		});

    expect(response.status).toBe(200);
	});
});