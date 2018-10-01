# memage-api

## Backend for the WWCHackathon2018 Second place winner app MEMAGE.

The app might have reached the limits of the cloudinary api, so it might not work: https://memage.herokuapp.com

Original idea:

1) Take a picture.
2) Apply https://cloudinary.com/addons#aws_rek_tagging on it.
3) Search the web with for funny quotes with tags from the image (we are using https://quotes.rest/).
4) Attach the quote to the image.

## To run the app locally:
You will need Cloudinary and quotes.rest keys to to run the application. 

![](https://i.imgur.com/trTjQxt.png)

```
  npm i
  npm run start
```

There're 2 endpoints:
- `GET /tag_image`

    Query params: `url`, `textColor` ('black' or 'white').

    Example:  `localhost:3000/tag_image?url=https://i.imgur.com/trTjQxt.png&textColor=white`

- `POST /upload_image`
   
   Body: image, query params: `textColor` ('black' or 'white')





![](https://i.imgur.com/WdsZEZy.png)
