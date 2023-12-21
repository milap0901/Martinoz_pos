// const { ThermalPrinter, PrinterTypes, CharacterSet, BreakLine } = require("node-thermal-printer");


// let printer = new ThermalPrinter({
//    type: PrinterTypes.EPSON, // Printer type: 'star' or 'epson'
//    interface: 'printer:ex-usb', // Printer interface
//    characterSet: CharacterSet.PC437_USA, // Printer character set - default: SLOVENIA
//    removeSpecialCharacters: true, // Removes special characters - default: false                                       // Set character for lines - default: "-"
//    breakLine: BreakLine.WORD, // Break line after WORD or CHARACTERS. Disabled with NONE - default: WORD
//    driver: require('printer'),
   
//    options: {

//         // Additional options
//         timeout: 5000, // Connection timeout (ms) [applicable only for network printers] - default: 3000
//    },
// });

// async function printBill(order) {




//    const {
//         customerName,
//         customerContact,
//         customerAdd,
//         customerLocality,
//         deliveryCharge,
//         packagingCharge,
//         discount,
//         paymentMethod,
//         orderType,
//         orderComment,
//         cartTotal,
//         tax,
//         subTotal,
//         tableNumber,
//         orderCart,
//    } = order;

   

//    let isConnected = await printer.isPrinterConnected();
//    console.log(isConnected);

//    printer.println("customerName");
//    printer.drawLine();
   
  
   
//    printer.cut();

//    try {
//         console.log("entered");
//         await printer.execute();
//         console.log("Print success.");
//    } catch (error) {
//         console.error("Print error:", error);
//    }
// }


// module.exports = { printBill };
