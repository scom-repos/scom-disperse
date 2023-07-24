const theme = {
    backgroundColor: {
        type: 'string',
        format: 'color'
    },
    fontColor: {
        type: 'string',
        format: 'color'
    },
    secondaryColor: {
        type: 'string',
        title: 'Block Background Color',
        format: 'color'
    },
    secondaryFontColor: {
        type: 'string',
        title: 'Step Font Color',
        format: 'color'
    },
    inputBackgroundColor: {
        type: 'string',
        format: 'color'
    },
    inputFontColor: {
        type: 'string',
        format: 'color'
    },
    // buttonBackgroundColor: {
    // 	type: 'string',
    // 	format: 'color'
    // },
    // buttonFontColor: {
    // 	type: 'string',
    // 	format: 'color'
    // }
}

export default {
    general: {
        dataSchema: {
            type: 'object',
            properties: {}
        }
    },
    theme: {
        dataSchema: {
            type: 'object',
            properties: {
                "dark": {
                    type: 'object',
                    properties: theme
                },
                "light": {
                    type: 'object',
                    properties: theme
                }
            }
        }
    }
}