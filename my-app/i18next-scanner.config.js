module.exports = {
  input: ["src/**/*.{js,jsx,ts,tsx}"],
  output: "./",
  options: {
    debug: false,
    removeUnusedKeys: false,
    sort: true,
    func: {
      list: ["t"],
      extensions: [".js", ".jsx", ".ts", ".tsx"],
    },
    lngs: ["en", "hi", "fr", "es", "pt", "zh"],
    defaultLng: "en",
    defaultNs: "translation",
    resource: {
      loadPath: "src/assets/Language/Locales/{{lng}}.json",
      savePath: "src/assets/Language/Locales/{{lng}}.json",
      jsonIndent: 2,
      lineEnding: "\n",
    },
    keySeparator: false,
    nsSeparator: false,
  },
};
