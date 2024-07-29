export default {
  "extends": ["eslint:recommended", "plugin:react/recommended", "plugin:@typescript-eslint/recommended", "prettier"],
  "plugins": ["react", "react-native", "@typescript-eslint"],
  "parser": "@typescript-eslint/parser",
  "rules": {
    "prettier/prettier": "error"
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  }
}
