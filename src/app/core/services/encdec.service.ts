import { Router } from "@angular/router";
import { LogService } from "./log.service";
import { StorageService } from "./storage.service";
import { ModelResponseBase } from "../base/model.response.base";
import CryptoES from 'crypto-es';
import { ModelRequestBase } from "../base/model.request.base";
import { Injectable } from "@angular/core";

@Injectable({providedIn: 'root'})
export class EncDecService {

	public constructor(
		private log: LogService,
		private route: Router,
		private storage: StorageService
	) {

	}
	
	private getAESKey(): string {
		const key = this.storage.getKey();
		if(key) return key;
		this.route.navigate(["/login"]);
		this.log.logError("There is no encrypt key");
		return  "";
	}

	private safeParseJSON(jsonString: string): any {
		try {
			return JSON.parse(jsonString);
		} 
		catch (error) {
			return jsonString; 
		}
	}
	
	public decrypt(encryptedText: string): string | object {
		const rawData = CryptoES.enc.Base64.parse(encryptedText);
		const rawBytes = rawData.words;
	
		if (rawBytes.length < 12) {
			throw new Error("Invalid encrypted payload format.");
		}
	
		// Parse correct lengths (16 bytes IV, 32 bytes HMAC, rest is cipherText)
		const iv = CryptoES.lib.WordArray.create(rawBytes.slice(0, 4)); // 16 bytes (4 words)
		const cipherText = CryptoES.lib.WordArray.create(rawBytes.slice(4, -8)); // middle part
		const hmac = CryptoES.lib.WordArray.create(rawBytes.slice(-8)); // last 32 bytes (8 words)
	
		const key = CryptoES.enc.Base64.parse(this.getAESKey().replace("base64:", ""));
	
		// Combine iv + cipherText for HMAC verification
		const ivAndCipher = iv.clone().concat(cipherText);
		const computedHmac = CryptoES.HmacSHA256(ivAndCipher, key);
	
		if (CryptoES.enc.Base64.stringify(computedHmac)
				.localeCompare(CryptoES.enc.Base64.stringify(hmac)) !== 0) {
			throw new Error("HMAC verification failed. Data may be tampered.");
		}
	  
		const decrypted = CryptoES.AES.decrypt(
			{ ciphertext: cipherText },
			key,
			{ iv, mode: CryptoES.mode.CBC, padding: CryptoES.pad.Pkcs7 }
		);
	
		const decryptedText = decrypted.toString(CryptoES.enc.Utf8);
		if (!decryptedText) throw new Error("Decryption failed. Output is empty.");
	
		return this.safeParseJSON(decryptedText);
	}
	
	
	public encrypt(data: ModelRequestBase): string {
		const key = CryptoES.enc.Base64.parse(this.getAESKey().replace("base64:", "")); 
		const iv = CryptoES.lib.WordArray.random(16);
	
		const encrypted = CryptoES.AES.encrypt(JSON.stringify(data), key, {
			iv: iv,
			mode: CryptoES.mode.CBC,
			padding: CryptoES.pad.Pkcs7
		});
	
		if (!encrypted.ciphertext) {
			throw new Error("Encryption failed: ciphertext is undefined.");
		}
		
		const cipherText = encrypted.ciphertext;
	
		const hmac = CryptoES.HmacSHA256(iv.clone().concat(cipherText.clone()), key);
		const finalData = CryptoES.lib.WordArray.create(
			iv.words.concat(cipherText.words, hmac.words) 
		);
	
		const encryptedPayload = CryptoES.enc.Base64.stringify(finalData);
	
		return encryptedPayload;
	}

}
