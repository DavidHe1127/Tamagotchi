import utils from './index';
import * as promptData from '../data/prompt.json';

describe('test utils', () => {
  it('Build prompt with given data', () => {
    const prompt = utils.buildPrompt(promptData.title, promptData.options);
    expect(prompt).toMatchSnapshot();
  });

  it('print message in expected format', () => {
    const format = '\x1b[32m%s\x1b[0m';
    const msg = 'this is a test';

    jest.spyOn(global.console, 'log');
    utils.msg(msg);

    expect(console.log).toHaveBeenCalledWith(format, msg);
  });
});
