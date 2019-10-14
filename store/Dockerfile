FROM ubuntu
MAINTAINER Wei CHEN <wei.chen@u-bordeaux.fr>

# Install node
RUN apt-get update -y \
	&& apt-get install curl -y
RUN curl -o /usr/local/bin/n https://raw.githubusercontent.com/visionmedia/n/master/bin/n
RUN chmod +x /usr/local/bin/n
RUN n latest

RUN adduser --quiet --disabled-password --shell /bin/bash --home /home/runner --gecos "User" store

USER store
RUN mkdir /tmp/store
WORKDIR /tmp/store
RUN mkdir routes
COPY routes/*.js routes/
COPY index.js .
COPY package.json .
COPY package-lock.json .
RUN npm install

EXPOSE 8086

CMD ["node","index.js","--mongo=mongo"]


