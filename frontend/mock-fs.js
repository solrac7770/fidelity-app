export const readFileSync = () => Buffer.from('');
export const writeFileSync = () => {};
export const existsSync = () => false;
export const readdirSync = () => [];
export const promises = {
  readFile: async () => Buffer.from(''),
  writeFile: async () => {},
  readdir: async () => []
};
export default {
  readFileSync, writeFileSync, existsSync, readdirSync, promises
};
