# OpenHotel Auth

[![Static Badge](https://img.shields.io/badge/CC_BY--NC--SA_4.0-blue?style=for-the-badge&color=gray)](/LICENSE)
![GitHub branch check runs](https://img.shields.io/github/check-runs/openhotel/auth/master?style=for-the-badge)
[![GitHub Release](https://img.shields.io/github/v/release/openhotel/auth?style=for-the-badge)](https://github.com/openhotel/auth/releases/latest)
[![Static Badge](https://img.shields.io/badge/discord-b?style=for-the-badge&logo=discord&color=white)](https://discord.gg/qBZfPdNWUj)

---

- `OHAP`: `OpenHotel Auth Protocol`

Basic example with `OHAP` [/auth-example](https://github.com/openhotel/auth-example)

## How to run the project

### Dependencies

- Install `deno >= 1.44`
- Install `node >= 20`
- Install `yarn`

### Start project

- Run `deno task install` to install dependencies.
- Copy the `app/server/.env.example` file and rename it to `.env`. Then, configure it with your environment variables.
- Run `deno task start` to start the server.
- Set `version` to `development` in the `app/server/config.yml` file.
