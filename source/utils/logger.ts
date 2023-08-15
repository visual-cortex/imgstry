
/**
 * Internal logger that enables debug traces.
 * @ignore
 */
export class Logger {
    public constructor(private _isDebug: boolean) { }

    public log(message: any, ...list: any[]): void {
        if (this._isDebug) {
            // eslint-disable-next-line no-console
            console.log(message, ...list);
        }
    }

    public info(message: any, ...list: any[]): void {
        if (this._isDebug) {
            // eslint-disable-next-line no-console
            console.info(message, ...list);
        }
    }

    public error(message: any, ...list: any[]): void {
        // eslint-disable-next-line no-console
        console.error(message, ...list);
    }
}
