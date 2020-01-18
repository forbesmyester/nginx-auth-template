FROM node:12

WORKDIR /proj
RUN npm install express express-session bunyan body-parser
COPY ./index.js /proj/index.js

CMD node ./index.js

