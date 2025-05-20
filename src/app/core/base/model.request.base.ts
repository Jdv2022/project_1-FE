
export class ModelRequestBase {

    public endpoint: string = '';
    public params: any = {};
    public payload: any;
	public isEncrypt: boolean = true;
	public isfile: boolean = false;
	public file: any = null;
	public metaData?: any;
	
    constructor(init?: Partial<ModelRequestBase>) {
        Object.assign(this, init);
    }

}