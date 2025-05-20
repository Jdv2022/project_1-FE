


export class LoginResponseModel {

	public access_token: string = '';
	public token_expire: string = '';

	constructor(init?: Partial<LoginResponseModel>) {
		Object.assign(this, init);
	}

}