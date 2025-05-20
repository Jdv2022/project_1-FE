
export class FileModelRequestBase {

    public endpoint: string = '';
    public payload: any;
	public isEncrypt: boolean = true;
	public isfile: boolean = true;
	public file: any = null;

    constructor(init?: Partial<FileModelRequestBase>) {
        Object.assign(this, init);
    }

}