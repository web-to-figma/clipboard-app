export const blobToBase64 = (blob: Blob) => {
    const reader = new FileReader()
    reader.readAsDataURL(blob)
    return new Promise(resolve => {
        reader.onloadend = () => {
            resolve(reader.result)
        }
    })
}

export const readClipboard = async () => {
    const result: {[type: string]: string}[] = []
    // noinspection TypeScriptValidateTypes
    // @ts-ignore
    const items = await navigator.clipboard.read({unsanitized: ['text/html']})
    for(const item of items) {
        result.push({})
        for(const type of item.types) {
            const blob = await item.getType(type)
            result[result.length - 1][type] = (await blobToBase64(blob)) as string
        }
    }

    return JSON.stringify(result)
}

export const writeToClipboard = async (clipboardText: string) => {
    if(clipboardText) {
        const blob = new Blob([clipboardText], { type: 'text/plain' });
        await navigator.clipboard.write([new ClipboardItem({'text/plain': blob})])
    }
}

export const copyToClipboard = async (clipboardText: string) => {
    if(clipboardText) {
        const data = JSON.parse(clipboardText)
        const items: ClipboardItem[] = []
        for(const part of data) {
            const content: {[type: string]: Blob} = {}
            for(const type in part) {
                const response = await fetch(part[type])
                content[type] = await response.blob()
            }
            const item = new ClipboardItem(content)
            items.push(item)
        }

        console.log(items)
        await navigator.clipboard.write(items)
    }
}