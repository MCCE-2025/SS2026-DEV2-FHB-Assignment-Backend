# syntax=docker/dockerfile:1

# Base images are pinned by digest so a fresh registry build cannot silently
# reintroduce a vulnerable layer the GHA cache already saw. Dependabot
# (package-ecosystem: docker) bumps both digests + version comments weekly.
# Both stages run Node 24 Active LTS on Debian 13 (trixie) so node_modules ABI matches
# the distroless runtime. debian12 distroless tags are no longer rebuilt upstream.
FROM node:24.14.1-trixie-slim@sha256:9707cd4542f400df5078df04f9652a272429112f15202d22b5b8bdd148df494f AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts

FROM gcr.io/distroless/nodejs24-debian13:nonroot@sha256:4c11c00f9d72bbe5d42fbcab421229b3c046d949f4e0a8e2d50e88a9b319a9e2 AS runtime
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY package.json index.js app.js ./
COPY services ./services
USER nonroot:nonroot
EXPOSE 3001
CMD ["index.js"]
