import {
  expect,
  spy,
  use,
} from 'chai';
import * as spies from 'chai-spies';
import { Logger } from '~utils/logger';

use(spies);

describe('util: logger', () => {
  context('debug', () => {
    it('should call console.log', () => {
      const logMsg = 'I am a simple log message.';
      const logSpy = spy.on(console, 'log');
      const logger = new Logger(true);

      logger.log(logMsg);

      expect(logSpy).to.have.been.called.with(logMsg);
      expect(logSpy).to.have.been.called.once;
      spy.restore(console);
    });

    it('should call console.info', () => {
      const infoMsg = 'I am helpful info message.';
      const logSpy = spy.on(console, 'info');
      const logger = new Logger(true);

      logger.info(infoMsg);

      expect(logSpy).to.have.been.called.with(infoMsg);
      expect(logSpy).to.have.been.called.once;
      spy.restore(console);
    });

    it('should call console.error', () => {
      const errorMsg = 'I am dreadful error message.';
      const logSpy = spy.on(console, 'error');
      const logger = new Logger(true);

      logger.error(errorMsg);

      expect(logSpy).to.have.been.called.with(errorMsg);
      expect(logSpy).to.have.been.called.once;
      spy.restore(console);
    });
  });

  context('production', () => {
    it('should NOT call console.log', () => {
      const logMsg = 'I am a simple log message.';
      const logSpy = spy.on(console, 'log');
      const logger = new Logger(true);

      logger.log(logMsg);

      expect(logSpy).to.not.have.been.called;
      spy.restore(console);
    });

    it('should NOT call console.info', () => {
      const infoMsg = 'I am helpful info message.';
      const logSpy = spy.on(console, 'info');
      const logger = new Logger(true);

      logger.info(infoMsg);

      expect(logSpy).to.not.have.been.called;
      spy.restore(console);
    });

    it('should call console.error', () => {
      const errorMsg = 'I am dreadful error message.';
      const logSpy = spy.on(console, 'error');
      const logger = new Logger(true);

      logger.error(errorMsg);

      expect(logSpy).to.have.been.called.with(errorMsg);
      expect(logSpy).to.have.been.called.once;
      spy.restore(console);
    });
  });
});
