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

console.log(chalk.bold.white("\nThanks for installing ") + chalk.bold.cyan("crocodocs@" + require("./package.json").version))
console.log(chalk.bold.white("\nThis package allows you documentating your source codes in more simple steps.\n\n"))

console.log(chalk.bold.yellow("Usage"))

console.log(chalk.bold.white("\n1. To create an information about script description, create a single comment contains ") + chalk.bold.green("CROCOS") + chalk.bold.white(" following your script's description e.g ") + chalk.bold.green("//CROCOS This Is The Index Script"))
console.log(chalk.bold.white("\n2. To create an information about function, create a single comment contains ") + chalk.bold.green("CROCOF") + chalk.bold.white(" above your function, then next to it add your function's description e.g ") + chalk.bold.green("//CROCOF This Is Initialization's Function\n\n"))

console.log(chalk.bold.yellow("Commands"))

console.log(chalk.bold.green("\n1. npx crocodocs run") + chalk.bold.white(" to generate the documentation after done editing project. Must run it from the project root path."))
console.log(chalk.bold.green("\n2. npx crocodocs clean") + chalk.bold.white(" to clean all the documentation pdf files. Must run it from the project root path."))
console.log(chalk.bold.green("\n3. npx crocodocs -h") + chalk.bold.white(" to see help instructions.\n\n\n"))