

export class RegisterModel {

	username: string = '';
	password: string = '';
	address: string = '';
	birthdate: string = '';
	department: string = '';
	email: string = '';
	firstname: string = '';
	middlename: string = '';
	lastname: string = '';
	gender: string = '';
	phone: string = '';
	position: string = '';

	constructor(init?: Partial<RegisterModel>) {
        Object.assign(this, init);
    }
	
}