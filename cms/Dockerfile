# NEW Lesson 4.1 — cms/Dockerfile   PROVIDED. Copy this file in; do not type it.
#
# A Dockerfile is a recipe. Each line is one step in preparing the image, and
# Docker runs them in order, once, when you build.
#
# Read it top to bottom before you run it. You are not expected to be able to
# write one of these yet.

# ---------------------------------------------------------------------------
# 1. START FROM A PREPARED IMAGE
# ---------------------------------------------------------------------------
# Somebody has already built an image containing Node 22 on a small Debian
# system. We start from theirs instead of installing Node ourselves.
#
# WHY node:22-slim AND NOT node:22-alpine
# Strapi resizes uploaded images using a library called sharp. On Alpine, sharp
# has to be compiled from source, which needs a compiler toolchain and fails in
# several interesting ways on Apple Silicon. The Debian image ships a version
# of sharp that already works. Slightly larger image, far fewer bad afternoons.
FROM node:22-slim

# git is needed by a small number of Strapi's dependencies during install.
RUN apt-get update && apt-get install -y --no-install-recommends git \
    && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=development

# ---------------------------------------------------------------------------
# 2. INSTALL THE DEPENDENCIES — ONE DIRECTORY ABOVE THE APPLICATION
# ---------------------------------------------------------------------------
# node_modules goes in /opt, and the Strapi project goes in /opt/app.
#
# That looks odd and it is deliberate. docker-compose.yml mounts your own
# cms/src and cms/config folders on top of /opt/app so that files you create in
# the admin panel appear on your disk. If node_modules lived inside /opt/app it
# would be hidden by that mount and nothing would start.
WORKDIR /opt/

# Only the two package files are copied at this point. Docker remembers the
# result of each step, so as long as these two files do not change, the long
# install below is skipped on every rebuild after the first.
COPY package.json package-lock.json ./

# npm ci installs the EXACT versions recorded in package-lock.json.
# npm install would be free to pick newer ones. Every student in this course
# gets an identical Strapi because of this one command.
RUN npm ci

# Put the installed command-line tools on the PATH.
ENV PATH=/opt/node_modules/.bin:$PATH

# ---------------------------------------------------------------------------
# 3. COPY THE PROJECT AND PRE-BUILD THE ADMIN PANEL
# ---------------------------------------------------------------------------
WORKDIR /opt/app
COPY . .

# Strapi's admin panel is a web application that has to be compiled before it
# can be served. Doing it here, once, during the build means the container
# starts in seconds rather than minutes every time you run it.
RUN npm run build

EXPOSE 1337

# `develop` rather than `start`: the Content-Type Builder — the whole point of
# Lesson 4.1 — is switched off when Strapi runs in production mode.
CMD ["npm", "run", "develop"]
