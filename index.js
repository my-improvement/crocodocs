#!/usr/bin/env node

const commander = require('commander')
const fs = require('fs')
const open = require('open')

const results = []

const path = require('path')

commander
.version(require("./package.json").version)
.description('Easily create a documentation, without the tears 😭')

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

                const isHavingData = lowercasedLine.includes("//des") || lowercasedLine.includes("//fun") || lowercasedLine.includes("//var")

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
                                functions: [],
                                variables: []
                            }
                        )
                    }

                    alreadyRegisteredInIndex = results.length - 1

                    const pickedResult = results[alreadyRegisteredInIndex]

                    if(lowercasedLine.includes("//des")) {
                        pickedResult.description = lines[i].trim().substring(6, lines[i].length)
                    } else if(lowercasedLine.includes("//fun")) {
                        pickedResult.functions.push({
                            ...GetNameTypeAndDescription(lines[i]),
                            parameters: []
                        })

                        let parameterFoundAtNextLine = 1

                        while(parameterFoundAtNextLine != -1) {
                            let nextLine = lines[i + parameterFoundAtNextLine]

                            let lowercasedNextLine = nextLine.toLowerCase()

                            if(lowercasedNextLine.includes("//param")) {
                                pickedResult.functions[pickedResult.functions.length - 1].parameters.push(GetNameTypeAndDescription(nextLine))

                                parameterFoundAtNextLine++
                            } else {
                                parameterFoundAtNextLine = -1
                            }
                        }
                    } else if(lowercasedLine.includes("//var")) {
                        pickedResult.variables.push(GetNameTypeAndDescription(lines[i]))
                    }
                }
            }
        }

        if(file.nextFile != null) {
            readFile(file.nextFile)
        } else {
            const fs = require('fs')

            if (!fs.existsSync('documentation')){
                fs.mkdirSync('documentation')
            }

            const fileName = 'documentation/index.html'

            fs.copyFile(__dirname + '/resources/styles.css', 'documentation/styles.css', (err) => {
                if (err) throw err
                
                fs.copyFile(__dirname + '/resources/documentation-source.html', fileName, (err) => {
                    if (err) throw err
    
                    let data = fs.readFileSync(fileName, 'utf-8')
    
                    let newValue = data.replace("var array = []", "var array = " + JSON.stringify(results, null, 4))

                    newValue = newValue.replace("[DATE]", (new Date()).toDateString())

                    if (fs.existsSync('./crocodocs_prefs.json')){
                        fs.readFile('./crocodocs_prefs.json', {encoding: 'utf-8'}, function(err, data) {
                            if (err) throw error

                            const json = JSON.parse(data)

                            newValue = newValue.replace("[PROJECT_NAME]", json.name || projectName)

                            if(typeof json.colors === 'object' && json.colors != undefined) {
                                let styles = fs.readFileSync('documentation/styles.css', 'utf-8')

                                if(json.colors.navbar != undefined) {
                                    styles = styles.replace("/*navbar*/background-color: goldenrod", "/*navbar*/background-color: " + json.colors.navbar)
                                }

                                if(json.colors.date != undefined) {
                                    styles = styles.replace("/*date*/color: black", "/*date*/color: " + json.colors.date)
                                }

                                if(json.colors.content_container != undefined) {
                                    styles = styles.replace("/*content_container*/background-color:dimgray", "/*content_container*/background-color: " + json.colors.content_container)
                                }

                                if(json.colors.title != undefined) {
                                    styles = styles.replace("/*title*/color: white", "/*title*/color: " + json.colors.title)
                                }

                                if(json.colors.list_of_contents_title != undefined) {
                                    styles = styles.replace("/*list_of_contents_title*/color: white", "/*list_of_contents_title*/color: " + json.colors.list_of_contents_title)
                                }

                                if(json.colors.list_of_contents != undefined) {
                                    styles = styles.replace("/*list_of_contents*/color: gold", "/*list_of_contents*/color: " + json.colors.list_of_contents)
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

                                fs.writeFileSync('documentation/styles.css', styles, 'utf-8')
                            }
    
                            fs.writeFileSync(fileName, newValue, 'utf-8')
            
                            open(fileName)
                        })
                    } else {
                        newValue = newValue.replace("[PROJECT_NAME]", path.basename(path.resolve(".")))
    
                        fs.writeFileSync(fileName, newValue, 'utf-8')
        
                        open(fileName)
                    }
                })
            })
        }
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
    const allFilesPath = getListAllFilesPath(dirPath)

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