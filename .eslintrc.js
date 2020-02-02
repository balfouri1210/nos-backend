module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true
  },
  extends: [
    "eslint:recommended",
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
    "semi": [2, "always"],
    "keyword-spacing": ["error", {
      "after": true
    }],
    "indent": ["error", 2]
  }
}
