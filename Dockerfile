#from what image we want to build from
FROM node:lts-alpine As development

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY tsconfig*.json ./
COPY package*.json ./

RUN npm install

# Copy application sources (.ts, .tsx, js)
COPY . .

# Build application (produces dist/ folder)
RUN npm run build

EXPOSE 3000

CMD [ "node", "dist/main" ]


##PRODUCTION##


FROM node:lts-alpine As production

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
# Copy configuration files
COPY package*.json ./

# Install dependencies from package-lock.json, see https://docs.npmjs.com/cli/v7/commands/npm-ci
RUN npm install --only=production

COPY . .

COPY --from=development /usr/src/app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main"]