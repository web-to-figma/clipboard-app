import {useCallback, useState} from 'react'
import './App.css'
import {readClipboard, writeToClipboard} from "./utils";

function App() {
    const [copied, setCopied] = useState<boolean>(false)

    const onCapture = useCallback(async () => {
        const clipboardText = await readClipboard()
        console.log(clipboardText)
        await writeToClipboard(clipboardText)
        setCopied(true)
        setTimeout(() => {setCopied(false)}, 3000)
    }, [])

  return (
    <div className={"flex flex-col gap-4"}>
        <button className={`border rounded-md bg-black px-3 py-2 text-white flex items-center justify-center`} onClick={onCapture}>
            {!copied && 'Copy to clipboard'}
            {copied &&
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            }
        </button>
    </div>
  )
}

export default App
