module.exports = {
  '*.{md,html,css}': 'prettier --write',
  '*.{js,jsx,ts,tsx}': ['prettier --write', 'eslint --fix'],
};
