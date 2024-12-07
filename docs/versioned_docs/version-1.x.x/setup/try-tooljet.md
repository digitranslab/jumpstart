---
id: try-jumpstart
title: Try JumpStart
---

# Try JumpStart
## On local with Docker

You can run the command below to have JumpStart up and running right away.

```bash
docker run \
  --name jumpstart \
  --restart unless-stopped \
  -p 80:80 \
  --platform linux/amd64 \
  -v jumpstart_data:/var/lib/postgresql/13/main \
  digitranslab/js-try:latest
```

*If you have any questions feel free to join our [Slack Community](https://jumpstart.com/slack) or send us an email at hello@jumpstart.com.*

#### Setup information

- Runs the JumpStart server on the port 3000 on your machine.
- Container has postgres already configured within. All the data will be available in the docker volume `jumpstart_data`.
- Default user credentials to login (email: `dev@jumpstart.io`, password: `password`).
- You can make use of `--env` or `--env-file` flag to test against various env configurables mentioned [here](https://docs.jumpstart.com/docs/setup/env-vars).
- Use `docker stop jumpstart` to stop the container and `docker start jumpstart` to start the container thereafter.

## On Play with docker

You can deploy JumpStart on PWD for free with the one-click-deployment button below.

  <a href="https://labs.play-with-docker.com/?stack=https://raw.githubusercontent.com/digitranslab/jumpstart/main/deploy/docker/play-with-docker.yml">
    <img src="https://raw.githubusercontent.com/play-with-docker/stacks/master/assets/images/button.png" alt="Try in PWD" height="32"/>
  </a>

#### Setup information

- Default user credentials to login (email: `dev@jumpstart.io`, password: `password`).
- Open port 3000 after the docker containers are up and running
- Visit the url shared on the dashboard to try out jumpstart
