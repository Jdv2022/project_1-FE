import { environment } from "src/environments/environment";
import CryptoES from 'crypto-es';
import { Injectable } from "@angular/core";
import { LogService } from "./log.service";

@Injectable({providedIn: 'root'})
export class StorageService {

    private key = '5wP8splBaWK3UGteUWJPHyyFkGkx3jJw';

    public constructor(

	) {
		
    }

    public setKey(pass: string): void {
        const encrypt = (tex: string) => CryptoES.AES.encrypt(tex, this.key).toString();
        localStorage.setItem(environment.aes, encrypt(pass));
    }

    public getKey(): string | null {
        const decrypt = (ciphertext: string) => CryptoES.AES.decrypt(ciphertext, this.key).toString(CryptoES.enc.Utf8);
		const encKey = localStorage.getItem(environment.aes);
        if(!encKey) return null; 
		const key = decrypt(encKey);
        return key;
    }

	public setToken(token: string): void {
        const encrypt = (tex: string) => CryptoES.AES.encrypt(tex, this.key).toString();
		localStorage.setItem(environment.auth, encrypt(token));
	}

	public getToken(): string | null {
		const decrypt = (ciphertext: string) => CryptoES.AES.decrypt(ciphertext, this.key).toString(CryptoES.enc.Utf8);
		const encKey = localStorage.getItem(environment.auth);

		if(!encKey) return null; 
		const token = decrypt(encKey);
		return token;
	}

	public deleteToken(): void {
		localStorage.removeItem(environment.auth);
	}

	public deleteAes(): void {
		localStorage.removeItem(environment.aes);
	}

}