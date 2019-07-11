const CFonts = require('cfonts')
const chalk = require('chalk')

CFonts.say('CROCODOCS', {
    font: 'block',              // define the font face
    align: 'left',              // define text alignment
    colors: ['cyan'],           // define all colors
    background: 'transparent',  // define the background color, you can also use `backgroundColor` here as key
    letterSpacing: 1,           // define letter spacing
    lineHeight: 1,              // define the line height
    space: true,                // define if the output text should have empty lines on top and on the bottom
    maxLength: '5',             // define how many character can be on one line
})

console.log("\nThanks for installing",chalk.bold.cyan("crocodocs ",require("./package.json").version))
console.log("\nThis package allows you documentating your source codes in more simple steps.\n")
console.log("Usage")
console.log("\n1. To create an information about script description, create a single comment contains >-> then your description e.g",chalk.bold.yellow("//>-> This Is Index Script"))
console.log("\n2. To create an information about function, create a single comment contains >->->, then your description e.g",chalk.bold.yellow("//>->-> This Is Initialization Function"))
console.log("\n3. To generate the documentation after done editing project, simply move your terminal path to your project root path then run",chalk.bold.yellow("crocodocs run\n\n"))