module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      [
        "babel-preset-expo",
        {
          jsxImportSource: "nativewind",
          unstable_transformImportMeta: true,
          reanimated: false,
        },
      ],
      "nativewind/babel",
    ],
    plugins: [],
  };
};
