var express = require("express");
var router = express.Router();
const log4js = require("log4js");
const logger = log4js.getLogger("API");
const util = require("util");

const cpcb = require("../sources/cpcb");
const hysplit = require("../sources/hysplit");
const testSource = require("../sources/testSource");
const scheduler = require("../scheduler");

const statusHandler = require("../handlers/server_status")

// router.get("/demo1", async function (req, res, next) {
//   startTime = Date.now();
//   let scraperesult = await cpcb.scrape({});
//   //let scraperesult = {};
//   let mapResult = await cpcb.mapCSV();
//   res.setHeader("Content-Type", "application/json");
//   res.end(
//     JSON.stringify({
//       result: "Succesfull",
//       msg: "Demo 1 Ran succesfully",
//       details: {
//         scraperesult: scraperesult,
//         mapResult: mapResult,
//         jobStart: startTime,
//       },
//     })
//   );
// });

// router.get("/demo2", async function (req, res, next) {
//   await hysplit.scrape();
//   await hysplit.closeBrowser();
//   await hysplit.convertKMZ();
//   let mappingResult = await hysplit.mapCSV({});
//   res.setHeader("Content-Type", "application/json");
//   res.end(
//     JSON.stringify({
//       result: "Succesfull",
//       msg: "Demo 2 Ran succesfully",
//     })
//   );
// });

// router.get("/mapCSV", async function (req, res, next) {
//   switch (req.query.source) {
//     case "cpcb":
//       let result = await cpcb.mapCSV(req.query);
//       res.setHeader("Content-Type", "application/json");
//       res.end(
//         JSON.stringify({
//           result: "Succesfull",
//           msg: result.msg,
//         })
//       );
//       break;
//     default:
//       res.setHeader("Content-Type", "application/json");
//       res.end(
//         JSON.stringify({
//           result: "ERROR",
//           msg: "Source name doesn't match",
//         })
//       );
//       break;
//   }
// });

// router.get("/scrape", async function (req, res, next) {
//   switch (req.query.source) {
//     case "cpcb":
//       let result = await cpcb.scrape(req.query);
//       res.setHeader("Content-Type", "application/json");
//       res.end(
//         JSON.stringify({
//           result: "Succesfull",
//           msg: result.msg,
//         })
//       );
//       break;
//     case "test":
//       let r = await testSource.test(req.query);
//       res.setHeader("Content-Type", "application/json");
//       res.end(
//         JSON.stringify({
//           result: "Succesfull",
//           msg: r.msg,
//         })
//       );
//       break;
//     default:
//       res.setHeader("Content-Type", "application/json");
//       res.end(
//         JSON.stringify({
//           result: "ERROR",
//           msg: "Source name doesn't match",
//         })
//       );
//       break;
//   }
// });

router.get("/status", async function (req, res, next) {
  try {
    statusData = await statusHandler.handleGetStatus(req.query);
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        "payload": statusData,
        "msg": "Success... OK",
      })
    );
  } catch (err) {
    res.setHeader("Content-Type", "application/json");
    res.statusCode = 404;
    res.end(
      JSON.stringify({
        "error": err,
        "msg": "Error... Failed",
      })
    );
  }
});

router.get("/systems", async function (req, res, next) {
  res.setHeader("Content-Type", "application/json");
  // var cpcb_lastRun,
  //   cpcb_lastMode,
  //   hysplit_lastRun,
  //   hysplit_lastMode,
  //   modis_lastRun,
  //   modis_lastMode;

  // var file_cpcb = fs.readFile("logs/app.log", "utf8", function (err, doc) {
  //   var cpcb_parsed_log = doc.match(
  //     /\[\d\d\d\d-(0?[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[01])\T(00|[0-9]|1[0-9]|2[0-3]):([0-9]|[0-5][0-9]):([0-9]|[0-5][0-9])\.([0-9]+)\] \[\w+\] (cpcb-scraper)/g
  //   );
  //   var cpcbstat = cpcb_parsed_log[cpcb_parsed_log.length - 1];
  //   var cpcbtime_mode = cpcbstat.match(/\[(.*?)\]/g);
  //   cpcb_lastRun = cpcbtime_mode[0].substring(1, cpcbtime_mode[0].length - 1);
  //   cpcb_lastMode = cpcbtime_mode[1].substring(1, cpcbtime_mode[1].length - 1);

  //   var hysplit_parsed_log = doc.match(
  //     /\[\d\d\d\d-(0?[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[01])\T(00|[0-9]|1[0-9]|2[0-3]):([0-9]|[0-5][0-9]):([0-9]|[0-5][0-9])\.([0-9]+)\] \[\w+\] (hysplit-scraper)/g
  //   );
  //   var hysplitstat = hysplit_parsed_log[hysplit_parsed_log.length - 1];
  //   var hysplittime_mode = hysplitstat.match(/\[(.*?)\]/g);
  //   hysplit_lastRun = hysplittime_mode[0].substring(
  //     1,
  //     hysplittime_mode[0].length - 1
  //   );
  //   hysplit_lastMode = hysplittime_mode[1].substring(
  //     1,
  //     hysplittime_mode[1].length - 1
  //   );

  //   var modis_parsed_log = doc.match(
  //     /\[\d\d\d\d-(0?[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[01])\T(00|[0-9]|1[0-9]|2[0-3]):([0-9]|[0-5][0-9]):([0-9]|[0-5][0-9])\.([0-9]+)\] \[\w+\] (modis-scraper)/g
  //   );
  //   var modisstat = modis_parsed_log[modis_parsed_log.length - 1];
  //   var modistime_mode = modisstat.match(/\[(.*?)\]/g);
  //   modis_lastRun = modistime_mode[0].substring(
  //     1,
  //     modistime_mode[0].length - 1
  //   );
  //   modis_lastMode = modistime_mode[1].substring(
  //     1,
  //     modistime_mode[1].length - 1
  //   );
  // });
  scheduler.getStatus(req.app);
  res.end(
    JSON.stringify({
      systemList: [{
          name: "cpcb",
          //isRunning: "enabled",
          status: req.app.get("statusVars").cpcbJobStatus,
          //   cron: "* * * * *",
          //   rdfCache: 0,
          // lastRun: cpcb_lastRun,
          // lastRunMode: cpcb_lastMode,
          description: "cpcb desc",
        },
        {
          name: "hysplit",
          //isRunning: "enabled",
          status: req.app.get("statusVars").hysplitJobStatus,
          //   cron: "* * * * *",
          //   rdfCache: 0,
          // lastRun: hysplit_lastRun,
          // lastRunMode: hysplit_lastMode,
          description: "trajectory desc",
        },
      ],
      msg: "Success... OK",
    })
  );
});

router.get("/systems/enable", async function (req, res, next) {
  res.setHeader("Content-Type", "application/json");
  try {
    scheduler.initJobs(req.query.system);
    res.end(
      JSON.stringify({
        result: req.query.system + " is now enabled",
        msg: "Success... OK",
      })
    );
  } catch (error) {
    res.end(
      JSON.stringify({
        result: req.query.system + " could not be enabled",
        msg: "Failure...",
      })
    );
    logger.error(error);
  }
});

router.get("/systems/disable", async function (req, res, next) {
  res.setHeader("Content-Type", "application/json");
  try {
    scheduler.stopJobs(req.query.system);
    res.end(
      JSON.stringify({
        result: req.query.system + " is now enabled",
        msg: "Success... OK",
      })
    );
  } catch (error) {
    res.end(
      JSON.stringify({
        result: req.query.system + " could not be enabled",
        msg: "Failure...",
      })
    );
    logger.error(error);
  }
});
// Everything except rdf store
router.get("/systems/:system/clear", async function (req, res, next) {
  res.setHeader("Content-Type", "application/json");
  res.end(
    JSON.stringify({
      result: req.params.system + " files have been cleaned",
      msg: "Success... OK",
    })
  );
});
router.get("/systems/:system/run", async function (req, res, next) {
  res.setHeader("Content-Type", "application/json");
  res.end(
    JSON.stringify({
      result: req.params.system + " system is scheduled right now",
      msg: "Success... OK",
    })
  );
});
router.get("/systems/:system", async function (req, res, next) {
  switch (req.params.system) {
    case "cpcb":
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify({
          name: "cpcb",
          status: "enabled",
          isRunning: true,
          cron: "* * * * *",
          rdfCache: 0,
          lastRun: 1617662546090,
          description: "cpcb desc",
          history: [{
              jobStart: 1617662546090,
              rdf_files: [
                "baseURI/file1.owl",
                "baseURI/file2.owl",
                "baseURI/file3.owl",
                "baseURI/file4.owl",
              ],
            },
            {
              jobStart: 1617662543090,
              rdf_files: [
                "baseURI/file1.owl",
                "baseURI/file2.owl",
                "baseURI/file3.owl",
                "baseURI/file4.owl",
              ],
            },
          ],
          msg: "Success... OK",
        })
      );
      break;
    case "modis":
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify({
          name: "modis",
          status: "enabled",
          isRunning: true,
          cron: "* * * * *",
          rdfCache: 0,
          lastRun: 1617662546090,
          description: "modis desc",
          history: [{
              jobStart: 1617662546090,
              rdf_files: [
                "baseURI/file1.owl",
                "baseURI/file2.owl",
                "baseURI/file3.owl",
                "baseURI/file4.owl",
              ],
            },
            {
              jobStart: 1617662543090,
              rdf_files: [
                "baseURI/file1.owl",
                "baseURI/file2.owl",
                "baseURI/file3.owl",
                "baseURI/file4.owl",
              ],
            },
          ],
          msg: "Success... OK",
        })
      );
      break;
    case "trajectory":
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify({
          name: "trajectory",
          status: "enabled",
          isRunning: true,
          cron: "* * * * *",
          rdfCache: 0,
          lastRun: 1617662546090,
          description: "trajectory desc",
          history: [{
              jobStart: 1617662546090,
              rdf_files: [
                "baseURI/file1.owl",
                "baseURI/file2.owl",
                "baseURI/file3.owl",
                "baseURI/file4.owl",
              ],
            },
            {
              jobStart: 1617662543090,
              rdf_files: [
                "baseURI/file1.owl",
                "baseURI/file2.owl",
                "baseURI/file3.owl",
                "baseURI/file4.owl",
              ],
            },
          ],
          msg: "Success... OK",
        })
      );
      break;
    default:
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify({
          msg: 'No System found with name: "' +
            req.params.system +
            '"' +
            "... Failed",
        })
      );
  }
});
//IDK what to put here rn
router.get("/fuseki", async function (req, res, next) {
  res.setHeader("Content-Type", "application/json");
  res.end(
    JSON.stringify({
      isRunning: true,
      endpoint: "fuseki/endpoint",
      msg: "Success... OK",
    })
  );
});
module.exports = router;