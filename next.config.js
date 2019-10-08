require('dotenv').config();

const VALID_KEYS = ['ID', 'SECRET'];

const env = Object.entries(process.env)
  .filter(([k]) => VALID_KEYS.includes(k))
  .reduce((p, [k, v]) => ({ ...p, [k]: v }), {});

const withCSS = require('@zeit/next-css');
module.exports = withCSS({ env });
