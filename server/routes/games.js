import express from "express";
import 'dotenv/config'

// Library for fetch requests
import fetch from "node-fetch";

const router = express.Router();

router.get('/search', async (req, res) => {
  try {
    const response = await fetch("https://api.igdb.com/v4/games",
      {
        method:'POST',
        headers: {
          'Accept': 'application/json',
          'Client-ID': process.env.API_CLIENT_ID,
          'Authorization': process.env.API_ACCESS_TOKEN
        },
        body: `
          fields cover.*,name,first_release_date; 
          search "${req.query.title}";
          where category != (1,2,3,4,5,7,8,12,13,14) & version_title = null;
        `
      })
    const results = await response.json()
    res.send(results).status(200)
  } catch (err) {
    console.error(err)
    res.send("An error occurred").status(500)
  }
})

router.get("/expandedSearch", async (req, res) => {
  try {
    const response = await fetch("https://api.igdb.com/v4/multiquery",
      {
        method:'POST',
        headers: {
          'Accept': 'application/json',
          'Client-ID': process.env.API_CLIENT_ID,
          'Authorization': process.env.API_ACCESS_TOKEN
        },
        body: `
          query games/count "Number of Results" {
            where name ~ *"${req.query.title}"* & category != (1,2,3,4,5,7,8,12,13,14);
          };

          query games "Search Results" {
            fields aggregated_rating,platforms.abbreviation,platforms.name,cover.*,name,first_release_date; 
            where name ~ *"${req.query.title}"* & category != (1,2,3,4,5,7,8,12,13,14);
            sort aggregated_rating desc;
          };
        `
      })
    const results = await response.json()
    res.send(results).status(200)
  } catch (err) {
    console.error(err)
    res.send("An error occurred").status(500)
  }
})

router.get("/", async (req, res) => {
  try {
    const genre = parseInt(req.query.genre)
    const platform = parseInt(req.query.platform)
    const year = parseInt(req.query.year)
    const sortCriteria = req.query.sortCriteria
    const sortDirection = parseInt(req.query.sortDirection) == 0 ? "desc" : "asc"
    const page = parseInt(req.query.page) - 1
    const add_filter = req.query.additionalFilter
    
    let release_date_filter = ""
    switch (year) {
      case 0:
        release_date_filter = `where first_release_date < ${Math.floor(Date.now() / 1000)}`
        break
      case 1:
        release_date_filter = `where first_release_date > ${Math.floor(Date.now() / 1000)}`
        break
      default:
        const start = Math.floor(new Date(Date.UTC(year, 0, 1, 0, 0, 0, 0)).getTime() / 1000)
        const end = Math.floor(new Date(Date.UTC(year, 11, 31, 23, 59, 59, 999)).getTime() / 1000)
        release_date_filter = `where first_release_date >= ${start} & first_release_date <= ${end}`
        break
    }
    
    const response = await fetch("https://api.igdb.com/v4/multiquery",
      {
        method:'POST',
        headers: {
          'Accept': 'application/json',
          'Client-ID': process.env.API_CLIENT_ID,
          'Authorization': process.env.API_ACCESS_TOKEN
        },
        body: `
          query games/count "Number of Matches" {
            fields name,cover.image_id,first_release_date,total_rating_count,total_rating;
            ${release_date_filter}${genre != 0 ? ` & genres = ${genre}` : ''}${platform != 0 ? ` & platforms = ${platform}` : ''}${add_filter != "undefined" ? ` & ${add_filter}` : ''} & category != (3,5,11) & version_title = null & cover != null;
          };
          query games "Custom filter" {
            fields category,name,cover.image_id,first_release_date,total_rating_count,total_rating;
            sort ${sortCriteria} ${sortDirection};
            limit 36;
            offset ${page * 36};
            ${release_date_filter}${genre != 0 ? ` & genres = ${genre}` : ''}${platform != 0 ? ` & platforms = ${platform}` : ''}${add_filter != "undefined" ? ` & ${add_filter}` : ''} & category != (3,5,11) & version_title = null & cover != null;
          };
        `
      })
    const results = await response.json()
    res.send(results).status(200)
  } catch (err) {
    console.error(err)
    res.send("An error occurred").status(500)
  }
})

router.get("/:id", async (req, res) => {
  try {
    const response = await fetch("https://api.igdb.com/v4/games",
      {
        method:'POST',
        headers: {
          'Accept': 'application/json',
          'Client-ID': process.env.API_CLIENT_ID,
          'Authorization': process.env.API_ACCESS_TOKEN
        },
        body: `
          fields artworks.image_id,collections,collections.name,collections.games.cover.image_id,collections.games.name,cover.image_id,first_release_date,genres.name,involved_companies.company.name,involved_companies.developer,involved_companies.publisher,name,platforms.abbreviation,platforms.name,total_rating,screenshots.image_id,summary,videos.*; 
          where id = ${req.params.id};
          `
      })
    const data = await response.json()
    
    res.send(data[0]).status(200)
  } catch (err) {
    console.error(err)
    res.send("An error occurred").status(500)
  }
})

router.get("/company/:id", async (req, res) => {
  try {
    const response = await fetch("https://api.igdb.com/v4/companies",
      {
        method:'POST',
        headers: {
          'Accept': 'application/json',
          'Client-ID': process.env.API_CLIENT_ID,
          'Authorization': process.env.API_ACCESS_TOKEN
        },
        body: `
          fields description,name;
          where id = ${parseInt(req.params.id)};
          limit 500;
        `
      })
    const results = await response.json()
    res.send(results[0]).status(200)
  } catch (err) {
    console.error(err)
    res.send("An error occurred").status(500)
  }
})

router.get("/series/:seriesId", async (req, res) => {
  try {
    const response = await fetch("https://api.igdb.com/v4/collections",
      {
        method:'POST',
        headers: {
          'Accept': 'application/json',
          'Client-ID': process.env.API_CLIENT_ID,
          'Authorization': process.env.API_ACCESS_TOKEN
        },
        body: `
          fields *,games.name,games.cover.image_id;
          where id = ${parseInt(req.params.seriesId)};
          limit 500;
        `
      })
    const results = await response.json()
    res.send(results[0]).status(200)
  } catch (err) {
    console.error(err)
    res.send("An error occurred").status(200)
  }
})


export default router;