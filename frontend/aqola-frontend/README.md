# React App

- Created react app using the command: npx create-next-app@latest
- Documentation on this: https://nextjs.org/docs

# Docker build

## Setup

- Based on: https://nextjs.org/docs/app/getting-started/deploying#docker
- Both the docker ignore file and dockerfile are copied from next's repository
  - https://github.com/vercel/next.js/tree/canary/examples/with-docker
- Docker ignore file - acts like git ignore for the image
- Changes to next.config.ts
  - output: "standalone" added to the nextConfig

## To build image and run

- docker build -t "aqola-frontend" .
- docker run -p 3000:3000 "aqola-frontend"
