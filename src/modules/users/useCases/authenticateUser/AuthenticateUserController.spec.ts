import { hash } from "bcryptjs";
import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { v4 as uuidV4 } from "uuid";

import { app } from "../../../../app";

let connection: Connection;

describe("Authenticate User Controller", () => {
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

	it("shoud be able of verify authenticate of the user", async () => {

		const response = await request(app).post("/api/v1/sessions").send({
			email: 'test@gmail.com',
			password: '1234'
		});

		expect(response.body).toHaveProperty("token");
		expect(response.body).toHaveProperty("user");
		expect(response.status).toBe(200);
	});
});