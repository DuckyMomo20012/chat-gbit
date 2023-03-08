<div align="center">

  <img src="https://user-images.githubusercontent.com/64480713/223781223-95ecf2a4-8301-4264-807d-f12220e0a148.svg" height="128">

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
  - [New chat completion](#new-chat-completion)
  - [Basic usage](#basic-usage)
  - [Set model for chat](#set-model-for-chat)
  - [Monitor usage](#monitor-usage)
  - [Save chat history to local storage](#save-chat-history-to-local-storage)
  - [Clear chat history](#clear-chat-history)
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
  <p>Demo</p>
  <img src="https://user-images.githubusercontent.com/64480713/223768073-4b54adf6-3d08-40f4-9e17-cb7464fc15dd.png" alt="screenshot" />
</div>

<!-- TechStack -->

### :space_invader: Tech Stack

<details>
  <summary>Client</summary>
  <ul>
    <li><a href="https://www.javascript.com/">Javascript</a></li>
    <li><a href="https://reactjs.org/">React.js</a></li>
    <li><a href="https://nextjs.org/">NextJS</a></li>
    <li><a href="https://redux-toolkit.js.org/">Redux Toolkit</a></li>
    <li><a href="https://react-query.tanstack.com/">React Query</a></li>
    <li><a href="https://windicss.org/">WindiCSS</a></li>
    <li><a href="https://mantine.dev/">Mantine</a></li>
    <li><a href="https://storybook.js.org/">Storybook</a></li>
    <li><a href="https://eslint.org/">ESLint</a></li>
    <li><a href="https://prettier.io/">Prettier</a></li>
    <li><a href="https://iconify.design/">Iconify</a></li>
  </ul>
</details>

<details>
  <summary>Server</summary>
  <ul>
    <li><a href="https://nextjs.org/">NextJS</a></li>
  </ul>
</details>

<!-- Features -->

### :dart: Features

- New chat completion.
- Set model for chat.
- Monitor usage.
- Save chat history to local storage.
- Clear chat history.
- Regenerate chat completion.

<!-- Env Variables -->

### :key: Environment Variables

To run this project, you will need to add the following environment variables to
your `.env` file:

- **NextAuth configs:**

  `NEXTAUTH_SECRET`: Used to encrypt the NextAuth.js JWT, and to hash email
  verification tokens.

  `NEXTAUTH_URL`: When deploying to production, set the `NEXTAUTH_URL` environment
  variable to the canonical URL of your site.

  > **Note**: Doesn't have to set `NEXTAUTH_URL` when deploying to vercel.

- **App configs:**

  `OPENAI_API_KEY`: OpenAI API key.

E.g:

```
# .env
NEXTAUTH_SECRET="my-secret-key"
NEXTAUTH_URL="http://localhost:3000/"
OPENAI_API_KEY="sk-***"
```

You can also check out the file `.env.example` to see all required environment
variables.

<!-- Getting Started -->

## :toolbox: Getting Started

<!-- Prerequisites -->

### :bangbang: Prerequisites

This project uses [pnpm](https://pnpm.io/) as package manager:

```bash
npm install --global pnpm
```

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

Start the server:

```bash
pnpm dev
```

<!-- Usage -->

## :eyes: Usage

### New chat completion

This app uses the new [Chat Completion
API](https://platform.openai.com/docs/api-reference/chat) to generate the chat.

### Basic usage

You can communicate with the chatbot by typing in the input box and pressing the
`Enter` key or clicking the `Send` button.

- When there is no message in the chat, you can whether submit the prompt with
  the role `user` or with `system` by check the `Set as system instruction`
  checkbox.

- When you submit the prompt with the role `user`, the chatbot will submit the
  request to the server. The server will call the OpenAI API to generate the
  next completion. After that, the server will send the completion back to the
  client.

  - While the client is fetching the completion, user can't submit the next
    prompt or stop the generation.

- When the client is typing the completion, you can stop the generation by
  clicking the `Stop generating` button.

  > **Note**: The completion is **already generated** and sent to the client
  > before typing the completion. **So you are billed for that completion**.

- When there is no typing completion and not fetching completion, you can
  regenerate the completion by clicking the `Regenerate response` button.

- When something went wrong and the completion wasn't not added to the chat, you
  can:

  - Regenerate the completion.

  - Submit the prompt again. The new prompt will replace the old prompt in the
    chat.

### Set model for chat

You can set the model for the chat by clicking the `Set model` button.

Available models:

- `gpt-3.5-turbo`
- `gpt-3.5-turbo-0301`: supported through at least June 1st.

### Monitor usage

You can monitor the usage by clicking the `Usage` button.

The usage panel will show the usage tokens in the chat:

- `Current Tokens`: The current usage tokens of the messages **displaying in the
  chat**.

  - The `Next bill` will inform you the minimum cost of the next bill.

- `All-time Tokens`: The total usage user requested to the server. This will
  include the usage tokens of the messages **not displaying in the chat**, e.g.,
  stopped generation, regenerated, etc.

### Save chat history to local storage

By default the chat history will be saved to local storage. Therefore, you can
still see the chat history after refreshing the page.

### Clear chat history

You can clear the chat history by clicking the `Clear chat history` button. All
the data stored in local storage will be removed.

<!-- Roadmap -->

## :compass: Roadmap

- [ ] Load training conversation from local file or from text input.
- [ ] Hide message.
- [ ] Display code block in completion.
- [ ] Edit user prompt.
- [ ] Support chat toolbar for small screen.
- [ ] Open usage panel in new tab.

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

- Why there is a difference between `Current Tokens` and `All-time Tokens`?

  - `Current Tokens`: The current usage tokens of the messages **displaying in
    the chat**.

  - `All-time Tokens`: The total usage user requested to the server. This will
    include the usage tokens of the messages **not displaying in the chat**,
    e.g., stopped generation, regenerated, etc.

- Do you support other models?

  - No, the Chat Completion API only [supports](https://platform.openai.com/docs/api-reference/chat/create#chat/create-model) `gpt-3.5-turbo` and
    `gpt-3.5-turbo-0301`.

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
