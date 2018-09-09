export class Logger {
  constructor(private _isDebug: boolean) { }

  public log(message: any, ...list: any[]): void {
    if (this._isDebug) {
      console.log(message, ...list);
    }
  }

  public info(message: any, ...list: any[]): void {
    if (this._isDebug) {
      // tslint:disable-next-line:no-console
      console.info(message, ...list);
    }
  }

  public error(message: any, ...list: any[]): void {
    if (this._isDebug) {
      console.error(message, ...list);
    }
  }
}
