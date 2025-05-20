


export class InitModel {

	public gateway_version: string = '';
	public database_version: string = '';
	public frontend_version: string = ''; 
	public cue: string = ''; 

	constructor(init?: Partial<InitModel>) {
		Object.assign(this, init);
	}

}