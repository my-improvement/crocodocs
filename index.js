#!/usr/bin/env node

const commander = require('commander')
const fs = require('fs')
const open = require('open')

const results = []

const path = require('path')

commander
.version(require("./package.json").version)
.description('Cutting the complexity in the making of a documentation')

commander
.command('create')
.description('Create the documentation')
.action(() => create())

commander.parse(process.argv)

function create() {
    const files = getAllFilesObject('.')

    if(files.length > 0) {
        readFile(files[files.length - 1])
    }
}

function readFile(file) {
    fs.readFile(file.path, {encoding: 'utf-8'}, function(err, data) {
        if (err) throw error

        if(file.path != "./index.js") { //DELETE THIS WHEN NOT TESTING
            let lines = data.split('\n')

            for(let i = 0; i < lines.length; i++) {
                const lowercasedLine = lines[i].toLowerCase()

                const isHavingData = lowercasedLine.includes("//des ") || lowercasedLine.includes("//fun ") || lowercasedLine.includes("//var ")

                let alreadyRegisteredInIndex = -1

                for(let j = 0; j < results.length; j++) {
                    if(results[j].filePath == file.path) {
                        alreadyRegisteredInIndex = j

                        break
                    }
                }

                if(isHavingData) {
                    if(alreadyRegisteredInIndex == -1) {
                        results.push(
                            {
                                filePath: file.path,
                                description: "",
                                elements: []
                            }
                        )
                    }

                    alreadyRegisteredInIndex = results.length - 1

                    const pickedResult = results[alreadyRegisteredInIndex]

                    if(lowercasedLine.includes("//des ")) {
                        pickedResult.description = lines[i].trim().substring(6, lines[i].length)
                    } else if(lowercasedLine.includes("//fun ")) {
                        pickedResult.elements.push({
                            ...GetNameTypeAndDescription(lines[i]),
                            elementType: "function",
                            parameters: []
                        })

                        let parameterFoundAtNextLine = 1

                        while(parameterFoundAtNextLine != -1) {
                            let nextLine = lines[i + parameterFoundAtNextLine]

                            let lowercasedNextLine = nextLine.toLowerCase()

                            if(lowercasedNextLine.includes("//param")) {
                                pickedResult.elements[pickedResult.elements.length - 1].parameters.push(GetNameTypeAndDescription(nextLine))

                                parameterFoundAtNextLine++
                            } else {
                                parameterFoundAtNextLine = -1
                            }
                        }
                    } else if(lowercasedLine.includes("//var ")) {
                        pickedResult.elements.push({
                            ...GetNameTypeAndDescription(lines[i]),
                            elementType: "variable",
                        })
                    }
                }
            }
        }

        if(file.nextFile != null) {
            readFile(file.nextFile)
        } else {
            const fs = require('fs')

            if (!fs.existsSync('crocodocs')){
                fs.mkdirSync('crocodocs')
            }

            if (!fs.existsSync('crocodocs/documentation')){
                fs.mkdirSync('crocodocs/documentation')
            }

            if (fs.existsSync('crocodocs/documentation/index.html') && fs.existsSync('crocodocs/documentation/styles.css')){
                if (!fs.existsSync('crocodocs/old_documentation')){
                    fs.mkdirSync('crocodocs/old_documentation')
                }

                let revisionNumber = 1

                while(fs.existsSync('crocodocs/old_documentation/' + revisionNumber.toString())) {
                    ++revisionNumber
                }

                fs.mkdirSync('crocodocs/old_documentation/' + revisionNumber.toString())

                fs.rename('crocodocs/documentation/index.html', 'crocodocs/old_documentation/' + revisionNumber.toString() + '/index.html', (err) => {
                    if (err) throw err

                    fs.rename('crocodocs/documentation/styles.css', 'crocodocs/old_documentation/' + revisionNumber.toString() + '/styles.css', (err) => {
                        if (err) throw err

                        SetupNewDocumentation()
                    })
                })
            } else {
                SetupNewDocumentation()
            }
        }
    })
}

function SetupNewDocumentation() {
    const fileName = 'crocodocs/documentation/index.html'

    fs.copyFile(__dirname + '/resources/styles.css', 'crocodocs/documentation/styles.css', (err) => {
        if (err) throw err
        
        fs.copyFile(__dirname + '/resources/documentation-source.html', fileName, (err) => {
            if (err) throw err

            let data = fs.readFileSync(fileName, 'utf-8')

            let newValue = data.replace("var array = []", "var array = " + JSON.stringify(results, null, 4))

            newValue = newValue.replace("[DATE]", (new Date()).toDateString())

            if (!fs.existsSync('crocodocs/preferences.json')){
                const styles = {
                    colors: {
                        navbar: "crimson",
                        date: "#000",
                        list_container: "rgb(50,50,50)",
                        list_of_contents_title: "rgb(255,255,255)", 
                        list_of_contents: "skyblue",
                        content_container: "#000",
                        title: "rgb(255,255,255)",
                        script_name: "rgb(255,255,255)",
                        type: "red",
                        name: "gold",
                        description: "lightgray",
                        param_type: "greenyellow",
                        param_name: "gold",
                        param_description: "darkgray"
                    }
                }

                styles.name = path.basename(path.resolve("."))

                fs.writeFileSync('crocodocs/preferences.json', JSON.stringify(styles, null, "\t"), 'utf-8')
            }

            fs.readFile('crocodocs/preferences.json', {encoding: 'utf-8'}, function(err, data) {
                if (err) throw error

                const json = JSON.parse(data)

                newValue = newValue.replace("[PROJECT_NAME_TITLE]", json.name || projectName)

                newValue = newValue.replace("[PROJECT_NAME]", json.name || projectName)

                if(typeof json.colors === 'object' && json.colors != undefined) {
                    let styles = fs.readFileSync('crocodocs/documentation/styles.css', 'utf-8')

                    if(json.colors.navbar != undefined) {
                        styles = styles.replace("/*navbar*/background-color: crimson", "/*navbar*/background-color: " + json.colors.navbar)
                    }

                    if(json.colors.date != undefined) {
                        styles = styles.replace("/*date*/color: black", "/*date*/color: " + json.colors.date)
                    }

                    if(json.colors.list_container != undefined) {
                        styles = styles.replace("/*list_container*/background-color:rgb(50,50,50)", "/*list_container*/background-color: " + json.colors.list_container)
                    }

                    if(json.colors.content_container != undefined) {
                        styles = styles.replace("/*content_container*/background-color:#000", "/*content_container*/background-color: " + json.colors.content_container)
                    }

                    if(json.colors.title != undefined) {
                        styles = styles.replace("/*title*/color: white", "/*title*/color: " + json.colors.title)
                    }

                    if(json.colors.list_of_contents_title != undefined) {
                        styles = styles.replace("/*list_of_contents_title*/color: white", "/*list_of_contents_title*/color: " + json.colors.list_of_contents_title)
                    }

                    if(json.colors.list_of_contents != undefined) {
                        styles = styles.replace("/*list_of_contents*/color: skyblue", "/*list_of_contents*/color: " + json.colors.list_of_contents)
                    }

                    if(json.colors.script_name != undefined) {
                        styles = styles.replace("/*script_name*/color: white", "/*script_name*/color: " + json.colors.script_name)
                    }

                    if(json.colors.type != undefined) {
                        styles = styles.replace("/*type*/color: red", "/*type*/color: " + json.colors.type)
                    }

                    if(json.colors.name != undefined) {
                        styles = styles.replace("/*name*/color: gold", "/*name*/color: " + json.colors.name)
                    }

                    if(json.colors.description != undefined) {
                        styles = styles.replace("/*description*/color: lightgray", "/*description*/color: " + json.colors.description)
                    }

                    if(json.colors.param_type != undefined) {
                        styles = styles.replace("/*param_type*/color: greenyellow", "/*param_type*/color: " + json.colors.param_type)
                    }

                    if(json.colors.param_name != undefined) {
                        styles = styles.replace("/*param_name*/color: gold", "/*param_name*/color: " + json.colors.param_name)
                    }

                    if(json.colors.param_description!= undefined) {
                        styles = styles.replace("/*param_description*/color: darkgray", "/*param_description*/color: " + json.colors.param_description)
                    }

                    fs.writeFileSync('crocodocs/documentation/styles.css', styles, 'utf-8')
                }

                fs.writeFileSync(fileName, newValue, 'utf-8')

                const chalk = require('chalk')

                console.log(chalk.default.green("\nYour documentation has been created at ./crocodocs/documentation/index.html\n"))

                setTimeout(() => open(fileName), 1500)
            })
        })
    })
}

function GetNameTypeAndDescription(line) {
    const splittedText = line.split(';')

    const typeString = splittedText[0].trim()

    const type = typeString.split(" ").length == 2 ? typeString.split(" ")[1] : ""

    return {
        name: splittedText[1].trim(),
        type: type,
        description: splittedText[2].trim()
    }
}

//File Helpers

function getAllFilesObject(dirPath) {
    let allFilesPath = getListAllFilesPath(dirPath).reverse()

    const files = []

    let previousFile = null

    for(const path of allFilesPath) {
        const newFile = {
            path: path,
            nextFile: previousFile
        }

        files.push(newFile)

        previousFile = newFile
    }

    return files
}

function getListAllFilesPath(dirPath, files_) {
    files_ = files_ || []

    const files = fs.readdirSync(dirPath)

    for (const file of files){
        const name = dirPath + '/' + file

        if (fs.statSync(name).isDirectory()){
            getListAllFilesPath(name, files_)
        } else {
            files_.push(name)
        }
    }

    return files_
}