# Welcome to crocodocs

Cutting the complexity in the making of a documentation

This package allows you to convert unique comments to interactive HTML documentation document

![alt text](https://raw.githubusercontent.com/reynaldpn/crocodocs/master/screenshots/1.png)

### Installation

You only need [Node.js](https://nodejs.org/en/) to run this package

### Usage

Comment your lines with

```//Des YourDescription``` this will declare a script with description in the documentation

```//VAR TypeData; VariableName; YourDescription``` this will declare a variable with name, type data and description in the documentation

```//FUN TypeData; FunctionName; YourDescription``` this will declare a function with name, type data and description in the documentation

```//PARAM TypeData; ParameterName; YourDescription``` this will declare a function parameter with name, type data and description in the documentation

Your variable or function with / without parameter comments should be exactly above the variable or the function

### Example

```
//DES This is a sample hello-world script in react-native

import React from "react"

import {
    Text,
    View
} from "react-native"

export default class HelloWorld extends React.Component {
    //VAR String; textValue; This variable contains a text that to be shown at the screen
    textValue = "Hello World"

    render() {
        return (
            <View
                style = {{
                    alignItems: "center",
                    flex: 1,
                    justifyContent: "center"
                }}
            >
                <Text
                    style = {{
                        fontSize: 24
                    }}
                >
                    {GetTextValue()}
                </Text>
            </View>
        )
    }

    //FUN String; GetTextValue(); This function is used to get textValue state
    //PARAM String; additionalText; Additional text to be added at textValue
    GetTextValue(additionalText) {
        return this.state.textValue + additionalText
    }
}
```

### Exporting a documentation

After done with commenting scripts, to export a documentation just run ```npx crocodocs create``` in command prompt / terminal at project's root path, your documentation should be opened directly after finish exporting, you can also find the file at PROJECT'S_ROOT_PATH/crocodocs/documentation/index.html

### Customizing documentation preferences

If there is no ```preferences.json``` file in crocodocs folder in the project's root path, the file will be created right before processing the making of the documentation. This file contains colors (in web color format), font family to be used and project name to be displayed preferences that you can edit as you want anyway.

```
{
    colors: {
        navbar: "crimson",
        date: "#000",
        list_container: "rgb(50,50,50)",
        list_of_contents_title: "rgb(255,255,255)", 
        folder: "gainsboro",
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
    },
    font_family: "'Lucida Console', Monaco, monospace",
	name: "ProjectName"
}
```

Run ```npx crocodocs create``` at project's root path in the command prompt / terminal again to get documentation with the latest preferences.

### Removing caches

If you want to delete all the documentation and preferences data run ```npx crocodocs clear-cache``` at project's root path folder in command prompt / terminal or simply delete the crocodocs folder.

### Removing comments and caches

To delete all comments ( ```//des```, ```//fun```, ```//var```, ```//param``` ) and caches in the project run ```npx crocodocs erase-all``` at project's root path folder in command prompt / terminal.

Make sure you have back up files if you want to revert it again.

### Sample Project To Test

You can find the sample project to test [here](https://github.com/reynaldpn/crocodocs/tree/master/SampleProject), if you want to test directly clone the github repository