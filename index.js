const cloudinary = require("cloudinary");
const express = require("express");
const axios = require("axios");
const Jimp = require("jimp");
const app = express();
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret
});

app.get("/tag_image", async (req, res) => {
  const { url, textColor } = req.query;
  cloudinary.v2.uploader.upload(
    url,
    { categorization: "aws_rek_tagging", auto_tagging: 0.5 },
    async function(error, result) {
      if (!error) {
        if (result.tags.length > 0) {
          const tag = result.tags[0];
          console.log("Image tags", result.tags);
          const quoteData = await findQuote(tag);

          const text = quoteData.quote;
          console.log("Quote:", text);
          try {
            const imageWithQuote = await addQuouteToImage(text, url, textColor);
            res.send(imageWithQuote);
          } catch (e) {
            res.status(404).send(e);
          }
        }
      } else {
        res.status(404).send("Could not find anything :(");
      }
    }
  );
});

const colors = {
  black: [
    Jimp.FONT_SANS_16_BLACK,
    Jimp.FONT_SANS_32_BLACK,
    Jimp.FONT_SANS_64_BLACK
  ],
  white: [
    Jimp.FONT_SANS_16_WHITE,
    Jimp.FONT_SANS_32_WHITE,
    Jimp.FONT_SANS_64_WHITE
  ]
};

function addQuouteToImage(text, url, textColor = "black") {
  return new Promise(async function(resolve, reject) {
    let jimpFont;
    if (text.length > 170) {
      jimpFont = colors[textColor][0];
    } else if (text.length > 30) {
      jimpFont = colors[textColor][0];
    } else {
      jimpFont = colors[textColor][0];
    }

    const jimpImage = await Jimp.read(url);
    const font = await Jimp.loadFont(jimpFont);
    const jimpOptions = {
      text,
      alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
      alignmentY: Jimp.VERTICAL_ALIGN_BOTTOM
    };
    await jimpImage.print(font, 25, 0, jimpOptions, 450, 500);
    const buf = await jimpImage.getBufferAsync(Jimp.MIME_JPEG);
    cloudinary.v2.uploader
      .upload_stream({ resource_type: "raw" }, function(error, result) {
        if (!error) {
          resolve(result.url);
        } else {
          reject(error);
        }
      })
      .end(buf);
  });
}

function findQuote(tag) {
  return new Promise(function(resolve, reject) {
    console.log("Searching for", tag);
    const quotesApiRequest = `https://quotes.rest/quote/search?minlength=100&maxlength=300&query=${tag}&private=false`;
    axios(quotesApiRequest, {
      headers: {
        Accept: "application/json",
        "X-TheySaidSo-Api-Secret": process.env.quotesKey
      }
    })
      .then(quoteRes => {
        const result = quoteRes.data.contents;
        resolve(result);
      })
      .catch(error => {
        reject(error);
      });
  });
}

app.listen(process.env.PORT, () =>
  console.log(`Example app listening on port ${process.env.PORT}!`)
);
