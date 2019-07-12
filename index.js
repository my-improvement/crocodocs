#!/usr/bin/env node

const CFonts = require('cfonts')
const chalk = require('chalk')
const commander = require('commander')
const fs = require('fs')
const open = require('open')
const PDFDocument = require('pdfkit')

commander
.version(require("./package.json").version)
.description('Crocodic\'s Documentation Tool')

commander
.command('run')
.description('Generate documentation')
.action(() => {
    run()
})

var docName = ""

commander.parse(process.argv)

async function run() {
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

    console.log(chalk.bold.cyan('Crocodic\'s Documentation Tool\n\n'))

    let filesPath = getListAllFiles('.')

    filesPath.reverse()

    let files = []

    let previousFile = null

    for(let i = 0; i < filesPath.length; i++) {
        let newFile = {
            path: filesPath[i],
            nextFile: previousFile
        }

        files.push(newFile)

        previousFile = newFile
    }

    if(files.length > 0) {
        readFile(files[files.length - 1], null)
    }
}

function generateDocName() {
    let dirName = "Documentation"

    !fs.existsSync(dirName) && fs.mkdirSync(dirName)

    let index = 0

    let name = dirName + "/" + index.toString()

    do {
        name = dirName + "/" + (++index).toString()
    } while (fs.existsSync("./" + name + ".pdf"))

    return name += ".pdf"
}

function readFile(file, recentDoc) {
    let doc = recentDoc

    fs.readFile(file.path, {encoding: 'utf-8'}, function(err, data) {
        if (err) throw error

        let result = {
            information: "",
            functions: []
        }

        let dataArray = data.split('\n')

        for (let index = 0; index < dataArray.length; index++) {
            let trimmedLine = dataArray[index].trim()

            if (trimmedLine.toLowerCase().includes("crocos")) {
                result.information = result.information + (result.information != "" ? "\n" : "") + trimmedLine.substr(trimmedLine.toLowerCase().indexOf("crocos") + 4).trim()
            }
            
            if (trimmedLine.toLowerCase().includes("crocof")) {
                let name = ""

                if(index < dataArray.length - 1) {
                    let currentIndex = index + 1

                    while(dataArray[currentIndex].indexOf("{") == -1 && currentIndex < dataArray.length - 1) {
                        name = name + dataArray[currentIndex]
                        name = name.trim()

                        currentIndex++;
                    } 

                    name = name + dataArray[currentIndex].substr(0, dataArray[currentIndex].indexOf("{") - 1)
                }

                let parameters = name.substr(name.indexOf("("))
                parameters = parameters.replace(/\s/g,'')

                name = name.substr(0, name.indexOf("(")).replace(/ +(?= )/g,'').trim()

                if(name != "") {
                    let description = trimmedLine.substr(trimmedLine.toLowerCase().indexOf("crocof") + 4).trim()

                    if(description == "") {
                        description = "** no description **"
                    }

                    result.functions.push({
                        name: name,
                        parameters: parameters,
                        description: description
                    })
                }
            }
        }

        if(result.information != "" || result.functions.length > 0) {
            console.log(chalk.bold.white(process.cwd().split("/")[process.cwd().split("/").length - 1] + file.path.substr(1)),chalk.bold.gray(result.information,"\n"))
            
            if(doc == null) {
                doc = new PDFDocument()

                docName = generateDocName()

                doc.pipe(fs.createWriteStream(docName))
            }

            doc.fillColor("teal").text("• " + file.path.split("/")[file.path.split("/").length - 1] + " - " + process.cwd().split("/")[process.cwd().split("/").length - 1] + file.path.substr(1))
            doc.fillColor("black").text("  " + result.information)
        }

        if(result.functions.length > 0) {
            console.log(chalk.bold.yellow("Functions Found :"))

            doc.fillColor("gray").text("\n  Functions :\n\n").fillColor("black")

            for (let i = 0; i < result.functions.length; i++) {
                console.log(chalk.bold.red(result.functions[i].name), chalk.bold.green(result.functions[i].description))

                doc.fillColor("red").text("  " + result.functions[i].name, {continued: true}).fillColor("blue").text(result.functions[i].parameters)
                doc.fillColor("black").text("  " + result.functions[i].description)
                
                doc.text("\n")
            }

            console.log()
        }

        if(file.nextFile != null) {
            if(result.information != "" || result.functions.length > 0) {
                doc.text("\n")
            }

            readFile(file.nextFile, doc)
        } else {
            if(doc != null) {
                doc.end()
            }

            open(docName); 
        }
    })
}

function getListAllFiles (dir, files_) {
    files_ = files_ || [];

    let files = fs.readdirSync(dir);

    for (var i in files){
        let name = dir + '/' + files[i]

        if (fs.statSync(name).isDirectory()){
            getListAllFiles(name, files_)
        } else {
            files_.push(name)
        }
    }

    return files_
}