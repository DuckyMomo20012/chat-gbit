<div align="center">

  <img src="https://user-images.githubusercontent.com/64480713/223781223-95ecf2a4-8301-4264-807d-f12220e0a148.svg" height="128" />

  <h1>Chat GBit</h1>

  <p>
    A simple Chat GPT clone
  </p>

<!-- Badges -->
<p>
  <a href="https://github.com/DuckyMomo20012/chat-gbit/graphs/contributors">
    <img src="https://img.shields.io/github/contributors/DuckyMomo20012/chat-gbit" alt="contributors" />
  </a>
  <a href="">
    <img src="https://img.shields.io/github/last-commit/DuckyMomo20012/chat-gbit" alt="last update" />
  </a>
  <a href="https://github.com/DuckyMomo20012/chat-gbit/network/members">
    <img src="https://img.shields.io/github/forks/DuckyMomo20012/chat-gbit" alt="forks" />
  </a>
  <a href="https://github.com/DuckyMomo20012/chat-gbit/stargazers">
    <img src="https://img.shields.io/github/stars/DuckyMomo20012/chat-gbit" alt="stars" />
  </a>
  <a href="https://github.com/DuckyMomo20012/chat-gbit/issues/">
    <img src="https://img.shields.io/github/issues/DuckyMomo20012/chat-gbit" alt="open issues" />
  </a>
  <a href="https://github.com/DuckyMomo20012/chat-gbit/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/DuckyMomo20012/chat-gbit.svg" alt="license" />
  </a>
</p>

<h4>
    <a href="https://github.com/DuckyMomo20012/chat-gbit/">View Demo</a>
  <span> · </span>
    <a href="https://github.com/DuckyMomo20012/chat-gbit">Documentation</a>
  <span> · </span>
    <a href="https://github.com/DuckyMomo20012/chat-gbit/issues/">Report Bug</a>
  <span> · </span>
    <a href="https://github.com/DuckyMomo20012/chat-gbit/issues/">Request Feature</a>
  </h4>
</div>

<br />

<!-- Table of Contents -->

# :notebook_with_decorative_cover: Table of Contents

- [About the Project](#star2-about-the-project)
  - [Screenshots](#camera-screenshots)
  - [Tech Stack](#space_invader-tech-stack)
  - [Features](#dart-features)
  - [Environment Variables](#key-environment-variables)
- [Getting Started](#toolbox-getting-started)
  - [Prerequisites](#bangbang-prerequisites)
  - [Run Locally](#running-run-locally)
- [Usage](#eyes-usage)
  - [Basic usage](#basic-usage)
  - [Set model for chat](#set-model-for-chat)
  - [Upload training chat](#upload-training-chat)
  - [MDX support](#mdx-support)
  - [Code highlighting](#code-highlighting)
- [Roadmap](#compass-roadmap)
- [Contributing](#wave-contributing)
  - [Code of Conduct](#scroll-code-of-conduct)
- [FAQ](#grey_question-faq)
- [License](#warning-license)
- [Contact](#handshake-contact)
- [Acknowledgements](#gem-acknowledgements)

<!-- About the Project -->

## :star2: About the Project

<!-- Screenshots -->

### :camera: Screenshots

<div align="center">
  <img src="https://github.com/DuckyMomo20012/chat-gbit/assets/64480713/8f23cd9d-7e55-45d5-867c-bdaf109a3247" alt="text_input" />
  <p>Text input demo</p>
</div>

<div align="center">
  <img src="https://github.com/DuckyMomo20012/chat-gbit/assets/64480713/12cc10ac-8cb5-44a7-81ae-8c7e32ab58fc" alt="text_input_dark_mode" />
  <p>Text input demo (dark mode)</p>
</div>

<div align="center">
  <img src="https://github.com/DuckyMomo20012/chat-gbit/assets/64480713/d28ec857-3eac-4837-b21f-1e7958422615" alt="voice_input" />
  <p>Voice input demo</p>
</div>

<div align="center">
  <img src="https://github.com/DuckyMomo20012/chat-gbit/assets/64480713/a0b3e3ee-a432-49ac-88f7-b94109a36854" alt="upload_training" />
  <p>Upload training chat</p>
</div>

<div align="center">
  <p>Code highlighting</p>
  <img src="https://github.com/DuckyMomo20012/chat-gbit/assets/64480713/7da33839-f03a-4224-bec1-aca3639e6ac5" alt="code_highlighting" />
</div>

<!-- TechStack -->

### :space_invader: Tech Stack

<details>
  <summary>Client</summary>
  <ul>
    <li><a href="https://www.typescriptlang.org/">Typescript</a></li>
    <li><a href="https://nextjs.org/">NextJS</a></li>
    <li><a href="https://redux-toolkit.js.org/">Redux Toolkit</a></li>
    <li><a href="https://tanstack.com/query/latest">TanStack Query</a></li>
    <li><a href="https://tailwindcss.com/">TailwindCSS</a></li>
    <li><a href="https://mantine.dev/">Mantine</a></li>
    <li><a href="https://eslint.org/">ESLint</a></li>
    <li><a href="https://prettier.io/">Prettier</a></li>
    <li><a href="https://iconify.design/">Iconify</a></li>
  </ul>
</details>

<details>
  <summary>Server</summary>
  <ul>
    <li><a href="https://www.postgresql.org/">PostgreSQL</a></li>
    <li><a href="https://nextjs.org/">NextJS</a></li>
    <li><a href="https://www.prisma.io/">Prisma</a></li>
  </ul>
</details>

<!-- Features -->

### :dart: Features

- Chat history. 🆕
- Simple authentication. 🆕
- Self-hosted AI server with [LocalAI](https://localai.io/). 🆕
- New chat completion.
- Voice input.
- Allow setting model for the chat.
- Upload training chat.
- Regenerate chat completion.
- MDX support.
- Code highlighting.

<!-- Env Variables -->

### :key: Environment Variables

To run this project, you will need to add the following environment variables to
your `.env` file:

- **NextAuth configs:**

  - `NEXTAUTH_SECRET`: Used to encrypt the NextAuth.js JWT, and to hash email
    verification tokens.

  - `NEXTAUTH_URL`: When deploying to production, set the `NEXTAUTH_URL` environment
    variable to the canonical URL of your site.

> [!NOTE]
> Doesn't have to set `NEXTAUTH_URL` when deploying to vercel.

- **App configs:**

  - `OPENAI_API_KEY`: OpenAI API key.

  - `LOCAL_AI_BASE_URL`: URL of the local AI server, this is used to connect to
    the local AI server.

  - `DATABASE_URL`: PostgreSQL database URL.

E.g:

```
# .env
NEXTAUTH_SECRET="my-secret-key"
NEXTAUTH_URL="http://localhost:3000/"
OPENAI_API_KEY="sk-***"
LOCAL_AI_BASE_URL="http://localhost:8080"
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/chatgbit"
```

You can also check out the file `.env.example` to see all required environment
variables.

<!-- Getting Started -->

## :toolbox: Getting Started

<!-- Prerequisites -->

### :bangbang: Prerequisites

- PostgreSQL: `16.1`.

- This project uses [pnpm](https://pnpm.io/) as package manager:

  ```bash
  npm install --global pnpm
  ```

- Docker & Docker Compose: This project uses Docker Compose to run the
  PostgreSQL database and the local AI server.

  - Install Docker: https://docs.docker.com/get-docker/

  - Install Docker Compose: https://docs.docker.com/compose/install/

<!-- Run Locally -->

### :running: Run Locally

Clone the project:

```bash
git clone https://github.com/DuckyMomo20012/chat-gbit.git
```

Go to the project directory:

```bash
cd chat-gbit
```

Install dependencies:

```bash
pnpm install
```

Start the database:

```bash
docker-compose up -d
```

Or, with the Local AI server (might take a while to download the model):

```bash
docker-compose up -d -profile local-ai
```

Run the migrations:

```bash
pnpm prisma:migrate
```

Start the server:

```bash
pnpm dev
```

<!-- Usage -->

## :eyes: Usage

<!-- Basic usage -->

### Basic usage

This app uses the new [Chat Completion
API](https://platform.openai.com/docs/api-reference/chat) to generate the chat.

You can communicate with the chatbot by:

- **Text input**: Typing in the input box and pressing the `Enter` key or
  clicking the `Send` button.

- **Voice input**: Click the `Start Recording` button to start recording your
  voice and click the `Stop Recording` button to stop recording. The server will
  try to transcribe your voice and send the text to the chatbot as the prompt.

  - This feature requires microphone permission. If you haven't granted the
    permission, the browser will ask you to grant permission.

  - You can ONLY record up to **30 seconds** of audio, this feature is intended
    to **reduce the cost**.

  - The audio data is persisted until the user submits the prompt, reloads the
    page, or start a new recording.

  - The record is saved as a `.webm` audio file and then send to the server.

  - This input will use the new Whisper API to generate the transcription. You
    can read more about the Whisper API
    [here](https://platform.openai.com/docs/guides/speech-to-text). Currently,
    the API only supports the `whisper-1` model.

  - When the user revokes the microphone permission during recording, the record
    is stopped **immediately**, but the voice input is changed to `inactive`
    mode about 10 seconds later (**not immediately**). The user **can still
    submit the audio before the record is stopped**.

Flow description:

- When there is no message in the chat, you can submit the prompt with
  the role `user` or with `system` by checking the `Set as system instruction`
  checkbox.

- When you submit the prompt with the role `user`, the chatbot will submit the
  request to the server. The server will call the OpenAI API to generate the
  next completion. After that, the server will send the completion back to the
  client.

  - While the client is fetching the completion, the user can't submit the next
    prompt or stop the generation.

- When the client is typing the completion, you can stop the generation by
  clicking the `Stop generating` button.

> [!NOTE]
> The completion is **already generated** and sent to the client
> before typing the completion. **So you are already billed for that
> completion (if you use OpenAI models)**.

- When there is no typing completion and not fetching the completion, you can
  regenerate the completion by clicking the `Regenerate response` button.

- When something went wrong and the completion wasn't added to the chat, you
  can:

  - Regenerate the completion.

  - Submit the prompt again. The new prompt will replace the old prompt in the
    chat.

<!-- Set model for chat -->

### Set model for chat

You can set the model for the chat by clicking the `Set model` button.

Available models:

- `gpt-3.5-turbo`
- `gpt-3.5-turbo-0301`: supported through at least June 1st.
- `ggml-gpt4all-j-v1.3-groovy.bin` (Self-hosted): Local AI chat model.
- `ggml-whisper-base.bin` (Self-hosted): Local AI transcription model.

> [!NOTE]
> You should change the model before submitting the prompt. Changing after
> submitting the prompt will have no effect.

<!-- Upload training chat -->

### Upload training chat

As the Chat Completion API supports the "hard-coded" chat, you now can
upload training chat to the chatbot by clicking the `Settings` button.

> [!CAUTION]
> Update training chat will delete all the chat history.

- The chat MUST follow [chat
  format](https://platform.openai.com/docs/guides/chat/introduction).

- User can also hide the training chat by clicking the `Hide training
messages` button.

- The form is validated while typing, so you can see the error message while
  typing.

<!-- MDX support -->

### MDX support

This app supports MDX v2. You now can create `.mdx` files for new routes. For
example, you can create a new route `/about` by creating a new file
`pages/about.mdx`.

This feature was intentionally added for parsing markdown content in the chat.
When parsing the markdown content, the content will be **safely** sanitized by
[`rehype-sanitize`](https://github.com/rehypejs/rehype-sanitize).

- Code blocks and inline code is allowed to keep the `className` attribute to
  support code highlighting.

> [!WARNING]
> The content in `.mdx` files are **not sanitized**. You should aware of the
> security risk.

<!-- Code highlighting -->

### Code highlighting

Now the app can support code highlighting in the chat (both prompt and
completion).

> [!NOTE]
> Writing markdown content for the prompt is **not recommended**. The prompt
> should be plain text.

- Code highlighting is not supported while typing, you still can see the backticks
  (**\`**) in the chat.

For example, when the message contains a code block or inline code:

- Code block (**\`\`\`**): The code block will be highlighted with
  `CodeHighlight` code highlight from the
  [@mantine/prism](https://mantine.dev/others/code-highlight/), due to the
  Mantine v7 upgrade.

  - If the code block has a language specified, e.g., `python`, the code block
    will be highlighted with the corresponding language if Prism supports it.

- Inline code (**\`**): The inline code will be highlighted with Mantine's
  [`Code`](https://mantine.dev/core/code/) component.

> [!NOTE]
> The code highlighting **won't effect the real prompt or completion**, even if
> the user stop the generation while typing the completion. The prompt or
> completion will be sent to the server as plain text.

<!-- Roadmap -->

## :compass: Roadmap

- [x] Load training chat from a local file or text input.
- [x] Hide message.
- [x] Display code block in completion.
- [ ] ~~Edit user prompt.~~
- [x] Support chat toolbar for the small screen.
- [ ] ~~Open the usage panel in a new tab.~~
- [ ] Regenerate mid chat completion.

<!-- Contributing -->

## :wave: Contributing

<a href="https://github.com/DuckyMomo20012/chat-gbit/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=DuckyMomo20012/chat-gbit" />
</a>

Contributions are always welcome!

<!-- Code of Conduct -->

### :scroll: Code of Conduct

Please read the [Code of Conduct](https://github.com/DuckyMomo20012/chat-gbit/blob/main/CODE_OF_CONDUCT.md).

<!-- FAQ -->

## :grey_question: FAQ

- Why do the app migrate from the Local Storage to the PostgreSQL database?

  - We want to add the multi chat feature, but it's hard to maintain the chat
    history in the Local Storage with Redux. We tried to implement this feature
    in the PRs [#38](https://github.com/DuckyMomo20012/chat-gbit/pull/38),
    [#39](https://github.com/DuckyMomo20012/chat-gbit/pull/39).

<!-- License -->

## :warning: License

Distributed under MIT license. See
[LICENSE](https://github.com/DuckyMomo20012/chat-gbit/blob/main/LICENSE)
for more information.

<!-- Contact -->

## :handshake: Contact

Duong Vinh - [@duckymomo20012](https://twitter.com/duckymomo20012) -
tienvinh.duong4@gmail.com

Project Link: [https://github.com/DuckyMomo20012/chat-gbit](https://github.com/DuckyMomo20012/chat-gbit).

<!-- Acknowledgments -->

## :gem: Acknowledgements

Here are useful resources and libraries that we have used in our projects:

- [Awesome Readme Template](https://github.com/Louis3797/awesome-readme-template):
  A detailed template to bootstrap your README file quickly.
