import { describe, expect, it, beforeEach, vi } from 'vitest';
import { Logger } from '~/utils/logger';

// use(spies);

describe('util: logger', () => {
    describe('debug', () => {
        let logger: Logger;

        beforeEach(() => {
            logger = new Logger(true);
        });

        it('should call console.log', () => {
            const logMsg = 'I am a simple log message.';
            const logSpy = vi.spyOn(console, 'log');

            logger.log(logMsg);

            expect(logSpy).to.have.been.toBeCalledWith(logMsg);
            expect(logSpy).to.have.been.toHaveBeenCalled;
        });

        it('should call console.info', () => {
            const infoMsg = 'I am helpful info message.';
            const logSpy = vi.spyOn(console, 'info');

            logger.info(infoMsg);

            expect(logSpy).to.have.been.toBeCalledWith(infoMsg);
            expect(logSpy).to.have.been.toHaveBeenCalled;
        });

        it('should call console.error', () => {
            const errorMsg = 'I am dreadful error message.';
            const logSpy = vi.spyOn(console, 'error');

            logger.error(errorMsg);

            expect(logSpy).to.have.been.toBeCalledWith(errorMsg);
            expect(logSpy).to.have.been.toHaveBeenCalled;
        });
    });

    describe('production', () => {
        let logger: Logger;

        beforeEach(() => {
            logger = new Logger(false);
        });

        it('should NOT call console.log', () => {
            const logMsg = 'I am a simple log message.';
            const logSpy = vi.spyOn(console, 'log');

            logger.log(logMsg);

            expect(logSpy).to.not.have.been.toBeCalled();
        });

        it('should NOT call console.info', () => {
            const infoMsg = 'I am helpful info message.';
            const logSpy = vi.spyOn(console, 'info');

            logger.info(infoMsg);

            expect(logSpy).to.not.have.been.toBeCalled();
        });

        it('should call console.error', () => {
            const errorMsg = 'I am dreadful error message.';
            const logSpy = vi.spyOn(console, 'error');

            logger.error(errorMsg);

            expect(logSpy).to.have.been.toBeCalledWith(errorMsg);
            expect(logSpy).to.have.been.toHaveBeenCalled;
        });
    });
});
