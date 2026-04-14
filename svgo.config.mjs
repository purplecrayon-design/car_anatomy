export default {
  multipass: true,
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          removeViewBox: false,
          cleanupIds: false,
          removeDesc: false,
          removeTitle: false,
          collapseGroups: false,
          mergePaths: false,
          removeHiddenElems: true,
          removeMetadata: true,
          removeComments: true,
          removeEmptyContainers: true,
          convertPathData: { floatPrecision: 2 },
        },
      },
    },
  ],
};
