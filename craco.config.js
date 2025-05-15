const CracoLessPlugin = require('craco-less');

const bg_color = "#24292F";

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              // '@primary-color': '#1409FF',
              '@font-size-base': '16px',
              '@font-size-lg': '18px',
              "@text-color": "#ffffff",
              "@font-family": "Roboto, Arial",
              '@component-background': '#24292F',
              "@modal-header-bg": bg_color,
              "@modal-content-bg": bg_color,
              "@modal-footer-bg": bg_color,
              "@drawer-bg": bg_color,
              "@tooltip-bg": bg_color,
              "@padding-md": "24px",
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ]
};