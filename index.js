const fetch = require('node-fetch');
const wallpaper = require('wallpaper');
const fs = require('fs').promises;

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

const DOWNLINK_SOURCES = 'https://downlinkapp.com/sources.json';
const MAP = 'Continental US';
const WALLPAPER_FILE = 'wallpaper.jpg';

async function init() {
  console.log("Fetching sources...");
  const { sources } = await getDownlinkSources();
  const map = sources.find(source => {
    return source.name === MAP;
  });
  await getWallpaper(map.url.full);
  await setWallpaper();
}

async function getWallpaper(url) {
  console.log(`Getting wallpaper from ${url}`);
  try {
    const response = await fetch(url);
  
    const image = await response.blob();
    const buffer = await image.arrayBuffer();
    await fs.writeFile('wallpaper.jpg', Buffer.from(buffer), 'binary');
  }
  catch (e) {
    console.log(e);
  }
}

async function setWallpaper() {
  console.log("Setting Wallpaper...");
  try {
    await wallpaper.set('wallpaper.jpg');
  } 
  catch (e) {
    console.error(e);
  }
}

async function getDownlinkSources() {
  try {
    const response = await fetch(DOWNLINK_SOURCES);
    if (!response.ok) {
      throw response;
    }
    return await response.json();
  }
  catch (e) {
    console.error(e);
    return null;
  }
}

init();