import {
  expect,
  spy,
  use,
} from 'chai';
import * as spies from 'chai-spies';
import { Logger } from '~utils/logger';

use(spies);

describe('util: logger', () => {

  afterEach(() => spy.restore(console));

  context('debug', () => {
    let logger: Logger;

    beforeEach(() => logger = new Logger(true));

    it('should call console.log', () => {
      const logMsg = 'I am a simple log message.';
      const logSpy = spy.on(console, 'log');

      logger.log(logMsg);

      expect(logSpy).to.have.been.called.with(logMsg);
      expect(logSpy).to.have.been.called.once;
    });

    it('should call console.info', () => {
      const infoMsg = 'I am helpful info message.';
      const logSpy = spy.on(console, 'info');

      logger.info(infoMsg);

      expect(logSpy).to.have.been.called.with(infoMsg);
      expect(logSpy).to.have.been.called.once;
    });

    it('should call console.error', () => {
      const errorMsg = 'I am dreadful error message.';
      const logSpy = spy.on(console, 'error');

      logger.error(errorMsg);

      expect(logSpy).to.have.been.called.with(errorMsg);
      expect(logSpy).to.have.been.called.once;
    });
  });

  context('production', () => {
    let logger: Logger;

    beforeEach(() => logger = new Logger(false));

    it('should NOT call console.log', () => {
      const logMsg = 'I am a simple log message.';
      const logSpy = spy.on(console, 'log');

      logger.log(logMsg);

      expect(logSpy).to.not.have.been.called();
    });

    it('should NOT call console.info', () => {
      const infoMsg = 'I am helpful info message.';
      const logSpy = spy.on(console, 'info');

      logger.info(infoMsg);

      expect(logSpy).to.not.have.been.called();
    });

    it('should call console.error', () => {
      const errorMsg = 'I am dreadful error message.';
      const logSpy = spy.on(console, 'error');

      logger.error(errorMsg);

      expect(logSpy).to.have.been.called.with(errorMsg);
      expect(logSpy).to.have.been.called.once;
    });
  });
});
