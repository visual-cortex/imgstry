import { describe, expect, it } from 'vitest';
import { uuid } from '~/utils/random';

describe('randomUtil: uuid', () => {
    it('should be a valid UUID according to RFC4122', () =>
        Array(1000).fill(void 0).map(() => uuid()).forEach(id =>
            expect(id).to.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i),
        ),
    );
});
