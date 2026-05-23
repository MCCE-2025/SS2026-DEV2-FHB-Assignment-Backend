# syntax=docker/dockerfile:1

# Base images are pinned by digest so a fresh registry build cannot silently
# reintroduce a vulnerable layer the GHA cache already saw. Dependabot
# (package-ecosystem: docker) bumps both digests + version comments weekly.
# Both stages run the same Node major (Active LTS, currently 24) on Debian 12
# so the deps stage's compiled node_modules ABI matches the distroless runtime.
FROM node:24-bookworm-slim@sha256:242549cd46785b480c832479a730f4f2a20865d61ea2e404fdb2a5c3d3b73ecf AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts

FROM gcr.io/distroless/nodejs24-debian12:nonroot@sha256:14d42e2511532589a7c7e01a753667a74fcc96266e137e8125006b87b0c32d0a AS runtime
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY package.json index.js app.js ./
COPY services ./services
USER nonroot:nonroot
EXPOSE 3001
CMD ["index.js"]
