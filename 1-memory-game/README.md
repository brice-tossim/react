# Simple memory game built with React + TypeScript + Tailwind CSS + Docker

This documentation provides instructions for setting up and running the project.

<div>
  <a href="https://www.loom.com/share/f6f76bfd70e64538b2c7e88437dd49bb">
    <p>Preview</p>
  </a>
  <a href="https://www.loom.com/share/f6f76bfd70e64538b2c7e88437dd49bb">
    <img
      style="max-width: 300px"
      src="https://cdn.loom.com/sessions/thumbnails/f6f76bfd70e64538b2c7e88437dd49bb-d34f71239a7c760a-full-play.gif"
    />
  </a>
</div>

## Table of Contents

- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Running the Project](#running-the-project)
- [Docker Commands](#docker-commands)

## Prerequisites

- Docker and Docker Compose
- Git

## Setup

Clone the repository:

```bash
git clone https://github.com/bricioo/react.git
cd 1-memory-game
```

## Running the Project

```bash
./docker.sh up
```

Once the containers are up, you can access the application at `http://localhost:5173`.

## Docker Commands

| Command          | Description                |
| ---------------- | -------------------------- |
| ./docker.sh up   | Build and start containers |
| ./docker.sh logs | View container logs        |
| ./docker.sh down | Stop containers            |
