require("dotenv").config();

const https = require("https");
const http = require("http");
const axios = require("axios");

const { ALL_PLAYERS, ALL_TOURS, DOMEN } = process.env;

async function getStaticPaths() {
  const playersReq = await axios.get(ALL_PLAYERS);
  const players = await playersReq;

  const toursReq = await axios.get(ALL_TOURS);
  const tours = await toursReq;

  const pathsPlayers = players.data
    .filter((pl) => pl.id && pl.name)
    .map((pl) => {
      return `${DOMEN}/player/${pl.id.toString()}/${pl.name.toString()};`;
    });

  const pathsTours = tours.data
    .filter((it) => it.tourLeague && it.tourName && !it.tourYear)
    .map((tr) => {
      return `${DOMEN}/${tr.tourLeague}/${tr.tourName};`;
    });

  const pathsToursWithYear = tours.data
    .filter((it) => it.tourLeague && it.tourName && it.tourYear)
    .map((tr) => {
      return `${DOMEN}/${tr.tourLeague}/${
        tr.tourName
      }/${it.tourYear.toString()};`;
    });

  const allLinks = pathsPlayers.concat(pathsTours).concat(pathsToursWithYear);

  protocol = DOMEN.includes("https") ? https : http;

  allLinks.forEach((element, i) => {
    setTimeout(() => {
      //   axios
      //     .get(element)
      //     .then((res) => {
      //       console.log(
      //         element,
      //         `statusCode: ${res.status}`,
      //         `time: ${i * 1500}`
      //       );
      //     })
      //     .catch((error) => {
      //       console.error(element, "error");
      //     });

      const req = protocol.request(element, (res) => {
        console.log(`statusCode: ${res.statusCode}`);

        res.on("data", (d) => {
          console.log(
            element,
            `statusCode: ${res.statusCode}`,
            `time: ${i * 1500}`
          );
        });
      });

      req.on("error", (error) => {
        console.error(element, "error");
      });

      req.end();
    }, i * 1500);
  });
}

getStaticPaths();
