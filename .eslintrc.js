module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true
  },
  extends: [
    'standard'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 2018
  },
  rules: {
    "quotes": [2, "single", {
      "avoidEscape": true
    }],
    "no-console": process.env.STAGE === "prod" ? "error" : "warn",
    "semi": [2, "always"]
  }
}
