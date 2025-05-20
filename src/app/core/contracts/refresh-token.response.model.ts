

export class RefreshTokenResponseModel {

	payload: string = '';

	constructor(init?: Partial<RefreshTokenResponseModel>) {
        Object.assign(this, init);
    }
	
}