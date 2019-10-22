# Welcome to crocodocs

Cutting the complexity in the making of a documentation

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

After done with commenting scripts, to export a documentation just run ```npx crocodocs create``` in command prompt / terminal at project's root path, your documentation should be opened directly after finish exporting, you can also find the file at PROJECT'S_ROOT_PATH/documentation/index.html

### Result

![alt text](https://raw.githubusercontent.com/reynaldpn/crocodocs/master/screenshots/1.png)

### Customizing documentation preferences

If there is no ```crocodocs_prefs.json``` file in project's root path, the file will be created right before processing the making of the documentation. This file contains name and colors (in web color format) preferences you can edit as you want anyway.

```
{
    "colors": {
		"navbar": "goldenrod",
		"date": "#000",
		"list_container": "rgb(50,50,50)",
		"list_of_contents_title": "rgb(255,255,255)",
		"list_of_contents": "gold",
		"content_container": "#000",
		"title": "rgb(255,255,255)",
		"script_name": "rgb(255,255,255)",
		"type": "red",
		"name": "gold",
		"description": "lightgray",
		"param_type": "greenyellow",
		"param_name": "gold",
		"param_description": "darkgray"
	},
	"name": "ProjectName"
}
```