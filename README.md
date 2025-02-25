# Node Typescript Boilerplate Engine

Here are the setup instructions for node boilerplate project.

# 🏁 Installation

### 💻 Running locally

- Install [NodeJs](https://www.nodejs.org/).
- Clone the project repository.
- Navigate to the project directory.
- Create `.env` file in the root folder and copy paste the content of `.env.sample`, and add necessary credentials.
- Install the packages:
- **NOTE:** Recommended to use `yarn` insted of `npm`
- [Yarn](https://yarnpkg.com/)
- Install yarn globally

```bash
npm install --global yarn
```

```bash
yarn install
```

- **OR**

```bash
npm install
```

- If you get an error while installing dependency with npm, run the following command to install dependency. (ignore all peerDependencies when installing)

```bash
npm install --legacy-peer-deps
```

- Run the project in local:

```bash
npm run start
```

- You're all set. Enjoy Happy coding! ☠️

### 🐳 Using Docker (recommended)

- Install the [Docker](https://www.docker.com/products/docker-desktop/) Desktop app.
- Clone the project repository.
- Navigate to the project directory.
- Create `.env` file in the root folder and copy paste the content of `.env.sample`, and add necessary credentials.
- **NOTE:** If any changes are needed, you can update the steps accordingly in `Dockerfile`.
- **NOTE:** You can choose any name when building the image. I used `node-typescript-app` for this example.
- Build the docker image.

```bash
docker build -t node-typescript-app .
```

- Run the build image as docker container.

```bash
 docker run -p 3010:3010 node-typescript-app
```

- Verify the Application.
- All set! enjoy. ✌🏻

## 🎯 The boilerplate includes the following Core Backend Features and Development Utilities and Tools setup.

## 𝌘 Core Backend Features 𝌘

- **Database:** MongoDB
- **Middleware & Security:** CORS, JWT & Passport Auth, Roles & Permissions, Cookies
- **File Handling:** Multer File Upload, Static File Server
- **Error Handling:** Signal & Uncaught Error Exception, NodeJS Error Exception, Global Error
- **APIs & Communication:** REST APIs, GraphQL APIs, Socket, Swagger Docs
- **Deployment & Infrastructure:** Docker
- **Custom Data Handling:** Custom Types

## 𝌘 Development Utilities & Tools 𝌘

- **Development Utilities:** Nodemon, Babel, Husky
- **Code Quality Tools:** ESLint, Prettier
- **Security Tools:** Helmet, Rate Limiter, Express Basic Auth
- **Logging and Monitoring Tools:** Morgan, Winston

# 😈 Authors

- **Hardik Patel** ⚔️
