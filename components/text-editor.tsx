"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Slider } from "@/components/ui/slider"
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  LinkIcon,
  Quote,
  Type,
  Moon,
  Sun,
  FileDown,
  Feather,
  Code,
} from "lucide-react"

const fonts = [
  { name: "Inter", value: "font-sans" },
  { name: "Georgia", value: "font-serif" },
  { name: "Menlo", value: "font-mono" },
  { name: "Playfair Display", value: "font-playfair" },
  { name: "Montserrat", value: "font-montserrat" },
  { name: "Lora", value: "font-lora" },
  { name: "Roboto Slab", value: "font-roboto-slab" },
  { name: "Open Sans", value: "font-open-sans" },
  { name: "Merriweather", value: "font-merriweather" },
]

export default function TextEditor() {
  const [text, setText] = useState("Add Your Markdown here <3")
  const [preview, setPreview] = useState("")
  const [fontSize, setFontSize] = useState(18)
  const [selectedFont, setSelectedFont] = useState(fonts[0])
  const [darkMode, setDarkMode] = useState(false)
  const [showFormatting, setShowFormatting] = useState(false)
  const [selectionPosition, setSelectionPosition] = useState({ top: 0, left: 0 })
  const [wordCount, setWordCount] = useState(0)
  const [charCount, setCharCount] = useState(0)
  const [markdownMode, setMarkdownMode] = useState(true)
  const editorRef = useRef(null)

  useEffect(() => {
    // Count words and characters
    const words = text.trim() ? text.trim().split(/\s+/).length : 0
    const chars = text.length
    setWordCount(words)
    setCharCount(chars)

    // Simple markdown to HTML conversion
    const html = text
      .replace(/^# (.*$)/gm, "<h1>$1</h1>")
      .replace(/^## (.*$)/gm, "<h2>$1</h2>")
      .replace(/^### (.*$)/gm, "<h3>$1</h3>")
      .replace(/\*\*(.*)\*\*/gm, "<strong>$1</strong>")
      .replace(/\*(.*)\*/gm, "<em>$1</em>")
      .replace(/\n/gm, "<br>")
      .replace(/^- (.*$)/gm, "<li>$1</li>")
      .replace(/<\/li><br><li>/g, "</li><li>")
      .replace(/<li>(.*)<\/li>/gm, "<ul><li>$1</li></ul>")
      .replace(/<\/ul><br><ul>/g, "</ul><ul>")
      .replace(/```(.*?)```/gs, "<pre><code>$1</code></pre>")
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\[([^\]]+)\]$$([^)]+)$$/g, '<a href="$2">$1</a>')
      .replace(/!\[([^\]]+)\]$$([^)]+)$$/g, '<img src="$2" alt="$1" />')

    setPreview(html)
  }, [text])

  const handleSelectionChange = useCallback(() => {
    const selection = window.getSelection()
    if (selection.toString().length > 0 && editorRef.current) {
      const range = selection.getRangeAt(0)
      const rect = range.getBoundingClientRect()
      const editorRect = editorRef.current.getBoundingClientRect()

      // Calculate position, ensuring the toolbar stays within viewport
      const top = rect.top - editorRect.top - 40
      let left = rect.left - editorRect.left + rect.width / 2

      // Ensure the toolbar doesn't go off-screen
      if (left < 100) left = 100
      if (left > editorRect.width - 100) left = editorRect.width - 100

      setSelectionPosition({
        top: top,
        left: left,
      })
      setShowFormatting(true)
    } else {
      setShowFormatting(false)
    }
  }, [])

  const insertMarkdown = (markdownSyntax) => {
    const textarea = document.getElementById("editor")
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = text.substring(start, end)

    let newText
    switch (markdownSyntax) {
      case "bold":
        newText = text.substring(0, start) + `**${selectedText || "bold text"}**` + text.substring(end)
        break
      case "italic":
        newText = text.substring(0, start) + `*${selectedText || "italic text"}*` + text.substring(end)
        break
      case "h1":
        newText = text.substring(0, start) + `# ${selectedText || "Heading 1"}` + text.substring(end)
        break
      case "h2":
        newText = text.substring(0, start) + `## ${selectedText || "Heading 2"}` + text.substring(end)
        break
      case "ul":
        newText = text.substring(0, start) + `- ${selectedText || "List item"}` + text.substring(end)
        break
      case "ol":
        newText = text.substring(0, start) + `1. ${selectedText || "List item"}` + text.substring(end)
        break
      case "link":
        newText =
          text.substring(0, start) + `[${selectedText || "Link text"}](https://example.com)` + text.substring(end)
        break
      case "image":
        newText =
          text.substring(0, start) +
          `![${selectedText || "Image alt text"}](https://example.com/image.jpg)` +
          text.substring(end)
        break
      case "code":
        newText = text.substring(0, start) + `\`${selectedText || "code"}\`` + text.substring(end)
        break
      case "quote":
        newText = text.substring(0, start) + `> ${selectedText || "Quote"}` + text.substring(end)
        break
      default:
        newText = text
    }

    setText(newText)
    setShowFormatting(false)

    // Focus back on the textarea
    setTimeout(() => {
      textarea.focus()
    }, 0)
  }

  const exportToWord = () => {
    // Create a Blob with the content
    const header = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' 
            xmlns:w='urn:schemas-microsoft-com:office:word' 
            xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset="utf-8">
        <title>Document</title>
        <style>
          body { font-family: ${selectedFont.name}, sans-serif; font-size: ${fontSize}px; }
        </style>
      </head>
      <body>
    `
    const footer = "</body></html>"
    const sourceHTML = header + preview + footer

    const source = "data:application/vnd.ms-word;charset=utf-8," + encodeURIComponent(sourceHTML)
    const fileDownload = document.createElement("a")

    document.body.appendChild(fileDownload)
    fileDownload.href = source
    fileDownload.download = "document.doc"
    fileDownload.click()
    document.body.removeChild(fileDownload)
  }

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-800"
      }`}
      ref={editorRef}
    >
      <div className="p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Feather className={`h-6 w-6 ${darkMode ? "text-gray-100" : "text-gray-800"}`} />
          <span className="font-medium text-lg">MarkText</span>
        </div>

        <div className="flex items-center gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Type className={`h-5 w-5 ${darkMode ? "text-gray-300" : "text-gray-600"}`} />
                <span className="sr-only">Font settings</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className={`w-80 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className={`font-medium text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Font</h4>
                  <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
                    {fonts.map((font) => (
                      <Button
                        key={font.value}
                        variant="outline"
                        className={`justify-start ${font.value} ${
                          selectedFont.value === font.value
                            ? darkMode
                              ? "border-gray-300 bg-gray-700"
                              : "border-gray-800 bg-gray-100"
                            : darkMode
                              ? "border-gray-700"
                              : "border-gray-200"
                        } ${darkMode ? "text-gray-200 hover:bg-gray-700" : "text-gray-800 hover:bg-gray-100"}`}
                        onClick={() => setSelectedFont(font)}
                      >
                        <span className={font.value}>{font.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <h4 className={`font-medium text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Font Size: {fontSize}px
                    </h4>
                  </div>
                  <Slider
                    defaultValue={[fontSize]}
                    min={12}
                    max={28}
                    step={1}
                    onValueChange={(value) => setFontSize(value[0])}
                    className={darkMode ? "bg-gray-800" : ""}
                  />
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <Sun className="h-5 w-5 text-gray-300" /> : <Moon className="h-5 w-5 text-gray-600" />}
            <span className="sr-only">Toggle dark mode</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => setMarkdownMode(!markdownMode)}
            title={markdownMode ? "Switch to normal text" : "Switch to markdown"}
          >
            <Code className={`h-5 w-5 ${darkMode ? "text-gray-300" : "text-gray-600"}`} />
            <span className="sr-only">Toggle markdown mode</span>
          </Button>

          <Button variant="ghost" size="icon" className="rounded-full" onClick={exportToWord}>
            <FileDown className={`h-5 w-5 ${darkMode ? "text-gray-300" : "text-gray-600"}`} />
            <span className="sr-only">Export to Word</span>
          </Button>
        </div>
      </div>

      <div className="flex-1 relative">
        {showFormatting && (
          <div
            className={`absolute z-10 flex items-center gap-1 p-1 rounded-lg shadow-lg ${
              darkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
            }`}
            style={{
              top: `${selectionPosition.top}px`,
              left: `${selectionPosition.left}px`,
              transform: "translateX(-50%)",
            }}
          >
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
              onClick={() => insertMarkdown("bold")}
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
              onClick={() => insertMarkdown("italic")}
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
              onClick={() => insertMarkdown("h1")}
            >
              <Heading1 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
              onClick={() => insertMarkdown("h2")}
            >
              <Heading2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
              onClick={() => insertMarkdown("link")}
            >
              <LinkIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
              onClick={() => insertMarkdown("quote")}
            >
              <Quote className="h-4 w-4" />
            </Button>
          </div>
        )}

        {markdownMode ? (
          <textarea
            id="editor"
            className={`w-full h-full p-8 outline-none resize-none ${selectedFont.value} ${
              darkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-800"
            } transition-colors duration-300`}
            style={{
              fontSize: `${fontSize}px`,
              height: "calc(100vh - 140px)",
              caretColor: darkMode ? "#f3f4f6" : "#1f2937",
            }}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onMouseUp={handleSelectionChange}
            onKeyUp={handleSelectionChange}
            placeholder="Start typing here..."
            spellCheck="false"
          />
        ) : (
          <div
            className={`w-full h-full p-8 outline-none ${selectedFont.value} prose max-w-none ${
              darkMode ? "bg-gray-900 text-gray-100 prose-invert" : "bg-white text-gray-800"
            } transition-colors duration-300`}
            style={{
              fontSize: `${fontSize}px`,
              height: "calc(100vh - 140px)",
              overflow: "auto",
            }}
            dangerouslySetInnerHTML={{ __html: preview }}
            onClick={() => setMarkdownMode(true)}
          />
        )}
      </div>

      <div className={`p-4 flex justify-end gap-6 text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
        <div>{wordCount} words</div>
        <div>{charCount} characters</div>
      </div>
    </div>
  )
}
