import { useState, useEffect } from 'react'
import "prismjs/themes/prism-tomorrow.css"
import Editor from "react-simple-code-editor"
import prism from "prismjs"
import Markdown from "react-markdown"
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from 'axios'
import './App.css'

function App() {
  const [code, setCode] = useState(`function sum() {
  return 1 + 1
}`)

  const [review, setReview] = useState(``)

  useEffect(() => {
    prism.highlightAll()
  }, [])

  async function reviewCode() {
    try {
      console.log("🔄 Sending request with code:", code)

      const response = await axios.post(
        "https://vercel-backend-sz35.vercel.app/",
        { code }
      )

      console.log("✅ Raw response:", response)
      console.log("✅ Response data:", response.data)

      // Check if backend returns { review: "..." } or just plain text
      if (response.data.review) {
        setReview(response.data.review)
      } else {
        setReview(typeof response.data === "string" ? response.data : JSON.stringify(response.data, null, 2))
      }
    } catch (error) {
      console.error("❌ Error fetching review:", error)

      if (error.response) {
        console.error("❌ Backend error response:", error.response.data)
        setReview(`⚠️ Backend error: ${error.response.data}`)
      } else {
        setReview("⚠️ Failed to fetch review. Check console for details.")
      }
    }
  }

  return (
    <>
      <main>
        <div className="left">
          <div className="code">
            <Editor
              value={code}
              onValueChange={(newCode) => setCode(newCode)}
              highlight={(code) =>
                prism.highlight(code, prism.languages.javascript, "javascript")
              }
              padding={10}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 16,
                border: "1px solid #ddd",
                borderRadius: "5px",
                height: "100%",
                width: "100%"
              }}
            />
          </div>
          <div onClick={reviewCode} className="review">
            Review
          </div>
        </div>

        <div className="right">
          <Markdown rehypePlugins={[rehypeHighlight]}>
            {review}
          </Markdown>
        </div>
      </main>
    </>
  )
}

export default App