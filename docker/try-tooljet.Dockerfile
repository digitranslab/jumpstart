FROM digitranslab/jumpstart-ce:latest

# copy postgrest executable
COPY --from=postgrest/postgrest:v10.1.1.20221215 /bin/postgrest /bin

# Install Postgres
USER root
RUN wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add -
RUN echo "deb http://apt.postgresql.org/pub/repos/apt/ bullseye-pgdg main" | tee /etc/apt/sources.list.d/pgdg.list
RUN echo "deb http://deb.debian.org/debian"
RUN apt update && apt -y install postgresql-13 postgresql-client-13 supervisor
USER postgres
RUN service postgresql start && \
    psql -c "create role jumpstart with login superuser password 'postgres';"
USER root

RUN echo "[supervisord] \n" \
    "nodaemon=true \n" \
    "\n" \
    "[program:postgrest] \n" \
    "command=/bin/postgrest \n" \
    "autostart=true \n" \
    "autorestart=true \n" \
    "\n" \
    "[program:jumpstart] \n" \
    "command=/bin/bash -c '/app/server/scripts/init-db-boot.sh' \n" \
    "autostart=true \n" \
    "autorestart=true \n" \
    "stderr_logfile=/dev/stdout \n" \
    "stderr_logfile_maxbytes=0 \n" \
    "stdout_logfile=/dev/stdout \n" \
    "stdout_logfile_maxbytes=0 \n" | sed 's/ //' > /etc/supervisor/conf.d/supervisord.conf

# ENV defaults
ENV JUMPSTART_HOST=http://localhost \
    PORT=80 \
    NODE_ENV=production \
    LOCKBOX_MASTER_KEY=replace_with_lockbox_master_key \
    SECRET_KEY_BASE=replace_with_secret_key_base \
    PG_DB=jumpstart_production \
    PG_USER=jumpstart \
    PG_PASS=postgres \
    PG_HOST=localhost \
    ENABLE_JUMPSTART_DB=true \
    JUMPSTART_DB_HOST=localhost \
    JUMPSTART_DB_USER=jumpstart \
    JUMPSTART_DB_PASS=postgres \
    JUMPSTART_DB=jumpstart_db \
    PGRST_HOST=http://localhost:3000 \
    PGRST_DB_URI=postgres://jumpstart:postgres@localhost/jumpstart_db \
    PGRST_JWT_SECRET=r9iMKoe5CRMgvJBBtp4HrqN7QiPpUToj \
    ORM_LOGGING=true \
    DEPLOYMENT_PLATFORM=docker:local \
    HOME=/home/appuser \
    TERM=xterm

# Prepare DB and start application
ENTRYPOINT service postgresql start 1> /dev/null && /usr/bin/supervisord
