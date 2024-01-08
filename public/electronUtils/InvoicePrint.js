const { PosPrinter } = require("electron-pos-printer");

const InvoicePrint = (data) => {

  const kotPrint = [
    {
      type: "text",
      value: data.data,
      style: {},
    },
  ];

  const options = {
    preview: false,
    margin: "0px 0px 0px 0px",
    silent: true,
    copies: 1,
    printerName: data.printerName,
    timeOutPerLine: 600,
    pageSize: "76mm", // page size,
    color: false,
    printBackground: false,
    dpi: 300,
  };

  PosPrinter.print(kotPrint, options).catch((error) => {
    console.error(error);
  });
};

module.exports = { InvoicePrint };
