/**
 * Validation Tests
 */

const { validateId } = require('../lib/validation');

describe('ID Validation', () => {
  describe('validateId middleware', () => {
    let req, res, next;

    beforeEach(() => {
      req = {
        params: {},
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      next = jest.fn();
    });

    it('should accept valid ID format (timestamp-randomstring)', () => {
      req.params.id = '1234567890123-abc123def';

      const middleware = validateId('id');
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should reject ID with invalid timestamp length', () => {
      req.params.id = '123-abc123def';

      const middleware = validateId('id');
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Validation Error',
        })
      );
      expect(next).not.toHaveBeenCalled();
    });

    it('should reject ID with invalid random string length', () => {
      req.params.id = '1234567890123-ab';

      const middleware = validateId('id');
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(next).not.toHaveBeenCalled();
    });

    it('should reject ID without hyphen separator', () => {
      req.params.id = '1234567890123abc123def';

      const middleware = validateId('id');
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(next).not.toHaveBeenCalled();
    });

    it('should reject missing ID', () => {
      req.params.id = undefined;

      const middleware = validateId('id');
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Missing id',
        })
      );
    });

    it('should reject non-string ID', () => {
      req.params.id = 12345;

      const middleware = validateId('id');
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should work with custom parameter name', () => {
      req.params.runId = '1234567890123-abc123def';

      const middleware = validateId('runId');
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
