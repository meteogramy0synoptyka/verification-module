const express = require("express");
const bodyParser = require("body-parser");
const pino = require("express-pino-logger")();
const cors = require("cors");
var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://127.0.0.1:27017/";

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(pino);

let dbo = null;
let imgwPromise = null;
let imgw = new Map();

MongoClient.connect(url, function (err, db) {
  if (err) throw err;
  dbo = db.db("verificationservice");
});

function fetchImgw(row, col) {
  imgwPromise = dbo
    .collection("IMGW")
    .aggregate([
      {
        $match: {
          row: Number(row),
          col: Number(col),
        },
      },
    ])
    .toArray((err, results) => {
      results.forEach((result) => {
        const key = `${result.date_imgw}`;
        //console.log("IMGW key: ", key);
        //console.log("IMGW record: ", result);

        imgw.set(key, result);

        //console.log("get result is:", imgw.get(key));
        // console.log(`imgw map hasss ${imgw.size} records`);
      });
    });
}

//example fetch:
//ONE TESTCASE - it works !!!
//way - it takes
//http://localhost:3001/api/mongodata/filter?way=forecast&row=210&col=271&firstDate=2019-01-01T00:00:00.000Z&lastDate=2019-01-03T00:00:00.000Z
app.get("/api/mongodata/filter", async (req, res) => {
  //FIX - eliminate problem with data translations -> "+ vanish"

  console.log(
    req.query.way,
    req.query.row,
    req.query.col,
    ",",
    req.query.firstDate,
    req.query.lastDate
  );

  fetchImgw(req.query.row, req.query.col);
  //console.log("before await");
  await imgwPromise;
  //console.log("after await");

  //console.log("imgw IS", imgw);

  //console.log("");

  //for time measure purposes
  //const startProfile = new Date();
  //console.log(
  //   "start forecast is",
  //   req.query.firstDate,
  //   "from query is",
  //   "2019-01-01T00:00:00.000Z",
  //   "IS IT EQUAL?????",
  //   req.query.lastDate === "2019-01-01T00:00:00.000Z"
  // );

  const startProfile = new Date();

  let match_filter = 0;

  if (req.query.way === "forecast") {
    match_filter = {
      row: Number(req.query.row),
      col: Number(req.query.col),
      start_forecast: {
        $gte: new Date(req.query.firstDate),
        $lte: new Date(req.query.lastDate),
      },
    };
  }

  if (req.query.way === "oneforecast") {
    match_filter = {
      row: Number(req.query.row),
      col: Number(req.query.col),
      start_forecast: new Date(req.query.forecastDate),
    };
  }

  dbo
    .collection("UM")
    .aggregate([
      {
        $match: match_filter,
      },
      // {
      //   forecast_duration: {
      //     $divide: [
      //       {
      //         $subtract: ["$date_um", "$start_forecast"], //różnica w milisekundach
      //       },
      //       1000 * 3600,
      //     ],
      //   },
      // },
    ])
    .toArray((err, result) => {
      const endProfile = new Date();
      if (err) {
        //console.log("time", +endProfile - +startProfile);
        res.send(err);
        throw err;
      }
      //console.log(JSON.stringify(result));
      //console.log("time", +endProfile - +startProfile);
      //console.log("UM is", result);
      //console.log("IMGW resultS KEYS ARE", imgw.keys());
      res.send(
        result.map((value) => {
          const key = `${value.date_um}`;
          //console.log("UM: key is: ", key);
          //console.log("IMGW with key from UM ", imgw.get(key));
          //console.log("valueproduct is ", value);
          const object = {
            ...imgw.get(key),
            ...value,
          };

          // console.log("SERVER: object is", object);

          const { start_forecast, date_um, value_um, value_imgw } = object;
          // console.log("SERVER: value_imgw is: ", value_imgw);
          // console.log(
          //   "SERVER: date_imgw is: ",
          //   date_um,
          //   "type is",
          //   typeof date_um
          // );
          // console.log(
          //   "SERVER: date_imgw stringify is: ",
          //   JSON.stringify(date_um),
          //   "type is",
          //   typeof JSON.stringify(date_um)
          // );

          let date_um_str = JSON.stringify(date_um);
          let start_forecast_str = JSON.stringify(start_forecast);
          return {
            //date_um_str,
            // start_forecast_str,
            // value_um,
            // value_imgw,
            ...object,
            date_um_str,
            start_forecast_str,
          };
        })
      );
    });
});

app.get("/api/mongodata/listnodes", async (req, res) => {
  console.log("I am in load nodes section");
  dbo
    .collection("UM")
    .aggregate([{ $project: { row: 1, col: 1, _id: 0 } }])
    .toArray((err, result) => {
      let rowcolMap = new Map();
      result.map((point) => {
        rowcolMap.set(1000 * point.row + point.col, point);
      });
      res.send([...rowcolMap.values()]);
    });
});

app.listen(3001, () =>
  console.log("Express server is running on localhost:3001")
);
