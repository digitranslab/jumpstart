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

- Runs the JumpStart server on the port 80 on your machine.
- Container has postgres already configured within. All the data will be available in the docker volume `jumpstart_data`.
- You can make use of `--env` or `--env-file` flag to test against various env configurables mentioned [here](https://docs.jumpstart.com/docs/setup/env-vars).
- Use `docker stop jumpstart` to stop the container and `docker start jumpstart` to start the container thereafter.

#### Dynamic Port Setup
To run the JumpStart server on a different port, such as 8080 or any other port of your choice, use the following command:

```sh
docker run \
  --name jumpstart \
  --restart unless-stopped \
  -p 8080:8080 \
  -e PORT=8080 \
  --platform linux/amd64 \
  -v jumpstart_data:/var/lib/postgresql/13/main \
  digitranslab/js-try:EE-LTS-latest
```

- This command will start the JumpStart server on port 8080.
- The `-e PORT=8080` flag sets the `PORT` environment variable to 8080, allowing the JumpStart server to listen on port 8080.

By following these instructions, you can easily run the JumpStart server on the port of your choice, ensuring flexibility in your setup.



