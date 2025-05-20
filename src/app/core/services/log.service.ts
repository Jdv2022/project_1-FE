import { environment } from "src/environments/environment";
import { Injectable } from '@angular/core';

export enum LogLevel {
    DEBUG = "debug",
    INFO = "info",
    WARN = "warn",
    ERROR = "error"
}


@Injectable({providedIn: 'root'})
export class LogService {

    private shouldLog(level: LogLevel): boolean {
        const logLevels: LogLevel[] = [
            LogLevel.ERROR,
            LogLevel.WARN,
            LogLevel.INFO,
            LogLevel.DEBUG
        ];
        // compare hehe
        return logLevels.indexOf(level) <= logLevels.indexOf(environment.logLevel);
    }

    public logError(data: any): void {
        if(this.shouldLog(LogLevel.ERROR)) {
            console.error('ERROR:', data);
        }
    }

    public logWarning(data: any): void {
        if(this.shouldLog(LogLevel.WARN)) {
            console.warn('WARNING:', data);
        }
    }

    public logInfo(data: any): void {
        if(this.shouldLog(LogLevel.INFO)) {
            console.info('INFO:', data);
        }
    }

    public logDebug(data: any): void {
        if(this.shouldLog(LogLevel.DEBUG)) {
            console.log('DEBUG:', data);
        }
    }

}