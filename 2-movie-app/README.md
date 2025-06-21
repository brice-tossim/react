# Find Your Movies built using React + TypeScript + Tailwind CSS + Docker

> ⚠️ **Warning:** This project is still under active development. Features and documentation may change frequently.

This documentation provides instructions for setting up and running the project.

<div>
  <a href="https://www.loom.com/share/84cf7e9fcb5a43ef829f687a8d88971a">
    <p>Preview</p>
  </a>
  <a href="https://www.loom.com/share/84cf7e9fcb5a43ef829f687a8d88971a">
    <img style="max-width:300px;" src="https://cdn.loom.com/sessions/thumbnails/84cf7e9fcb5a43ef829f687a8d88971a-2b98e9bcf241ac35-full-play.gif">
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
- TMDB API Key (for fetching movie data)

## Setup

1. Clone the repository:

```bash
git clone https://github.com/bricioo/react.git
cd 2-movie-app
```

2. Copy the `env.local.example` file to `.env.local` and add your `TMDB API key` to the variable `VITE_TMDB_API_KEY`:

```bash
cp env.local.example .env.local
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
