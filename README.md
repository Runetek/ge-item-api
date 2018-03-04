# OSRS Grand Exchange API and Crawler

Fault tolerant Old School RuneScape item price crawler and API.

## Setup 

### Docker
```
# Clone repository
git clone https://github.com/Runetek/ge-item-api
cd ge-item-api

# Build Dockerfile
docker-compose build

# Crawl GE Database
docker-compose run geitemapi crawler

# Start API server
docker-compose start

# Stop API server
docker-compose stop
```

### Requirements

* [rabbit-server](https://www.rabbitmq.com/download.html)
* MongoDB ≥ v3.0
* Node JS ≥ 5

### Install

1. `git clone https://github.com/Runetek/ge-item-api`
2. `cd ge-item-api`
3. `npm install`


Starting the crawler:

`npm run crawler`

Starting the API server (after crawling the GE database at least once):

`npm start`

After the item prices have been crawled, you can start hitting the API in your browser.
With the limits imposed by RuneScape's servers it takes roughly 4-5 hours to crawl the
entire Grand Exchange. At the time of writing there are just under 3100 tradable items
indexed on the Grand Exchange API.
