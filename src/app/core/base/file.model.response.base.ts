

export class FileModelResponseBase {

    public status: string = '';
    public error_type: number = 0;
    public message: string = '';
	public isEncrypted: boolean = true;
    public payload: any;

    constructor(init?: Partial<FileModelResponseBase>) {
        Object.assign(this, init);
    }

}