# OSRS Grand Exchange API and Crawler

Fault tolerant Old School RuneScape item price crawler and API.

## Setup 

### Requirements

* [rabbit-server](https://www.rabbitmq.com/download.html)
* MongoDB ≥ v3.0
* Node JS ≥ 5

### Install

1. `git clone https://github.com/Runetek/ge-item-api`
2. `cd ge-item-api`
3. `npm install`
4. `./node_modules/.bin/babel-node src/crawler/test.js`

After the item prices have been crawled, you can start hitting the API in your browser.
With the limits imposed by RuneScape's servers it takes roughly 4-5 hours to crawl the
entire Grand Exchange. At the time of writing there are just under 3100 tradable items
indexed on the Grand Exchange API.

## Todo/Notes

* Add Dockerfile and Docker Compose config for easy onboarding/deployment

