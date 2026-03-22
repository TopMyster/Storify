let API_KEY: string = '';
let content: string | undefined;
let isSelfGenerated: boolean = true;

(document.getElementById('generate') as HTMLElement).addEventListener('click', function (): void {
    isSelfGenerated = true;
    generate();
});

(document.getElementById('random') as HTMLElement).addEventListener('click', function (): void {
    isSelfGenerated = false;
    generate();
});

async function generate(): Promise<void> {
  const userinput = (document.getElementById('usertext') as HTMLInputElement).value;
  let content: string | undefined;

  if (isSelfGenerated === true) {
    content = `generate a childrens story based on the topic ${userinput} and dont ask any follow up questions. Have the title of the story be be the first sentance then one line under it the story. make the story at least 6 paragraphs long. Make the story not have any vulgar words or inappropiate topics. It shouldnt be over 2800 characters including spaces.`;
  } else if (isSelfGenerated === false) {
    content = `generate a childrens story based on a random topic. Do not repeat stories and make sure to generate the full story. make the storys at least 6 paragraphs long. Make the story not have any vulgar words or inappropiate topics. It shouldnt be over 2800 characters including spaces`;
  }

  const result = document.getElementById('result') as HTMLElement;

  try {
    const response: Response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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

    interface ChatChoice {
      message?: { content?: string };
      text?: { content?: string };
    }

    interface ChatResponse {
      choices?: ChatChoice[];
    }

    const data: ChatResponse = await response.json();
    console.log("Response data:", data);

    if (data.choices && data.choices.length > 0) {
      (document.getElementById('resultdiv') as HTMLElement).style.display = 'block';
      const reply: string =
        data.choices[0].message?.content ||
        data.choices[0].text?.content ||
        "No reply received.";
      result.textContent = reply;
      (document.getElementById('suggestions') as HTMLElement).style.display = 'none';
    } else {
      console.error("Unexpected response format:", data);
      result.textContent = "This feature is not working at this time";
    }
  } catch (err) {
    console.error("Error during fetch:", err);
    result.textContent = "This feature is not working at this time";
  }
}

function suggest1(): void {
  (document.getElementById('usertext') as HTMLInputElement).value = 'Create a story about friends';
}

function suggest2(): void {
  (document.getElementById('usertext') as HTMLInputElement).value = 'Make a nice bedtime story';
}

function suggest3(): void {
  (document.getElementById('usertext') as HTMLInputElement).value = 'Write a story with morals';
}

function suggest4(): void {
  (document.getElementById('usertext') as HTMLInputElement).value = "Tell a story that's funny";
}

(document.getElementById('sharebtn') as HTMLElement).addEventListener("click", async (): Promise<void> => {
  const shareData: ShareData = {
    title: "Here is a child friendly story",
    text: `${(document.getElementById('result') as HTMLElement).textContent}`,
    url: "https://storify.vercel.app",
  };

  try {
    await navigator.share(shareData);
  } catch (err) {
    console.log(err);
  }
});
