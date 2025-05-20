

export class ModelResponseBase {

    public status: string = '';
    public error_type: number = 0;
    public message: string = '';
	public isEncrypted: boolean = true;
    public payload: any;

    constructor(init?: Partial<ModelResponseBase>) {
        Object.assign(this, init);
    }

}