const buildPrompt = (title: string, options: string[]): string => {
  return options.reduce((prev, next, index) => {
    prev += `${index + 1}. ${next}\n`;
    return prev;
  }, `${title}\n\n`);
};

const msg = (msgText: string): void =>
  console.log('\x1b[32m%s\x1b[0m', msgText);

export default {
  buildPrompt,
  msg,
};
