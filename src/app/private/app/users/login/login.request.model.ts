

export class LoginRequestModel {

	username: string | null = null;
	password: string | null = null;

	constructor(init?: Partial<LoginRequestModel>) {
		Object.assign(this, init);
	}

}