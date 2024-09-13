import {useCallback, useEffect, useState} from 'react'
import './App.css'
import {blobToBase64} from "./utils";

function App() {
    const [clipboardText, setClipboardText] = useState<string>()

    useEffect(() => {
        const readClipboard = async () => {
            const result = []
            const items = await navigator.clipboard.read({unsanitized: ['text/html']})
            console.log(items)
            for(const item of items) {
                result.push({})
                for(const type of item.types) {
                    const blob = await item.getType(type)
                    result[result.length - 1][type] = await blobToBase64(blob)
                }
            }

            console.log(result)
            setClipboardText(JSON.stringify(result))
        }

        void readClipboard()
    }, [])

    const readClipboard = useCallback(async () => {
        const result = []
        const items = await navigator.clipboard.read({unsanitized: ['text/html']})
        console.log(items)
        for(const item of items) {
            result.push({})
            for(const type of item.types) {
                const blob = await item.getType(type)
                result[result.length - 1][type] = await blobToBase64(blob)
            }
        }

        console.log(result)
        const text = JSON.stringify(result)
        setClipboardText(text)
        return text
    }, [])

    const onCopy = useCallback(async () => {
        if(clipboardText) {
            const data = JSON.parse(clipboardText)
            const items = []
            for(const part of data) {
                const content = {}
                for(const type in part) {
                    const response = await fetch(part[type])
                    content[type] = await response.blob()
                }
                const item = new ClipboardItem(content)
                items.push(item)
            }

            await navigator.clipboard.write(items)
        }
    }, [clipboardText])

    const onCapture = useCallback(async () => {

    }, [])

  return (
    <div className={"flex flex-col gap-4"}>
        <textarea disabled={true} className={"w-[600px] h-[200px] hidden"} value={clipboardText}></textarea>
        <button onClick={onCopy}>Copy to clipboard</button>
    </div>
  )
}

export default App
