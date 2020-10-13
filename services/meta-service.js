const { errors } = require('../constants/index');

// Meta Crawling 
const {getMetadata} = require('page-metadata-parser');
const domino = require('domino');
const fetch = require('node-fetch');

module.exports.getMetadataFromUrl = async ({ url }) => {
  console.log(url);

  try {
    // Meta Crawling 
    const response = await fetch(url);
    const html = await response.text();
    const doc = domino.createWindow(html).document;
    const metadata = getMetadata(doc, url);

    return metadata;
  } catch (err) {
    console.error(err);
    throw new Error(errors.GET_TOTAL_PLAYER_COUNT_FAILED.message);
  }
};
