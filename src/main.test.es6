/*global mocha,chai,sinon,expect,AssetionError,it,describe*/
import rewire from 'rewire';

describe('The Server', () => {
  let main;
  beforeEach(() => {
    main = rewire('./main');
  });
  it('Should create an Express server.', () => {
    main.start(8080);
  });
});
