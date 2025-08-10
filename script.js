const userinput = document.getElementById('usertext').value

let content
let self = true

document.getElementById('generate').addEventListener('click', function() {
    self = true
    generate()
})

document.getElementById('random').addEventListener('click', function() {
    self = false
    generate()
})

function startaudio() {
    let audio = new Audio('bg.mp3')
    audio.play()
}

async function generate() {
    if (self === true) {
    content = `generate a childrens story based on the topic ${userinput} and dont ask any follow up questions. Have the title of the story be be the first sentance then one line under it the story. make the story at least 4 paragraphs long.`
} else if (self === false) {
    content = `generate a childrens story based on a random topic`
}
  startaudio() 
   try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b",
        messages: [
          {
            role: "user",
            content: content,
          },
        ],
        temperature: 1,
        max_tokens: 200, 
        top_p: 1,
        stream: false
      }),
    });

    const data = await response.json()
    console.log("Response data:", data)

    if (data.choices && data.choices.length > 0) {
        document.getElementById('resultdiv').style.display = 'block'
      const reply =
        data.choices[0].message?.content ||
        data.choices[0].text?.content ||
        "No reply received.";
      result.textContent = reply
    } else {
      console.error("Unexpected response format:", data)
      result.textContent = "This feature is not working at this time"
    }
  } catch (err) {
    console.error("Error during fetch:", err)
    result.textContent = "This feature is not working at this time"
  }
}
