let API_KEY = ''
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

async function getKey() {
    const response = await fetch('storage.json')
    const data = await response.json()
    API_KEY = data.API_KEY;
}
getKey()

async function generate() {
  document.getElementById('suggestions').display = 'none'
  const userinput = document.getElementById('usertext').value
    if (self === true) {
    content = `generate a childrens story based on the topic ${userinput} and dont ask any follow up questions. Have the title of the story be be the first sentance then one line under it the story. make the story at least 6 paragraphs long. Make the story not have any vulgar words or inappropiate topics.`
} else if (self === false) {
    content = `generate a childrens story based on a random topic. Do not repeat stories and make sure to generate the full story. make the storys at least 6 paragraphs long. Make the story not have any vulgar words or inappropiate topics.`
}
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
        temperature: 1.5,
        max_tokens: 900, 
        top_p: 1,
        stream: false
      }),
    });

    const data = await response.json()
    console.log("Response data:", data)
    const result = document.getElementById('result')

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

function suggest1() {
  document.getElementById('usertext').value = 'Create a story about friends'
}

function suggest2() {
  document.getElementById('usertext').value = 'Make a nice bedtime story'
}

function suggest3() {
  document.getElementById('usertext').value = 'Write a story with morals'
}

function suggest4() {
  document.getElementById('usertext').value = "Tell a story that's funny"
}

