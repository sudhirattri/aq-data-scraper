// import sqlite3 from "sqlite3";
// import { open } from "sqlite";
// import fs from "fs";

const sqlite3 = require("sqlite3");
const fs = require("fs");
const open = require("sqlite").open;
var log4js = require("log4js");
const logger = log4js.getLogger("filedb-dal");

/**
 * Functionalitites to support
 * 1. create tables as file stores for specific kinds of files
 * 2. insert Files as and when they are executed
 */

/**
 * FileID structure
 * src: source of data hysplit, cpcb, modis, etc
 * ext: csv, kmz, kml, etc.
 * table: rawData, turtle, edit, etc.
 * name: UID
 * path:
 */

var parentDict = "./AllFiles";

async function createTable(db, tableName) {
  try {
    let sql = `CREATE TABLE IF NOT EXISTS ${tableName} (path TEXT, type TEXT)`;
    await db.exec(sql, function (err) {
      if (err) {
        logger.log(err.message);
      }
      console.log("Cols path and type inserted");
    });
    console.log("table created");
  } catch (err) {
    console.log(err);
  }
}

async function genFileName(fileID, genOutFile = false, outFileExt = "csv") {
  fileID.path = `${parentDict}/${fileID.table}/${fileID.src}/${fileID.name}.${fileID.ext}`;
  fileID.dir = `${parentDict}/${fileID.table}/${fileID.src}`;
  fileID.absDir = `C:\\Users\\saadf\\Documents\\GitHub\\aq-data-scraper\\Allfiles\\${fileID.table}\\${fileID.src}`;
  if (genOutFile) {
    fileID.outfile = `${parentDict}/${fileID.table}/${fileID.src}/${fileID.name}.${outFileExt}`;
  }
  return fileID.path;
}

async function execNRemove(db, table, col, excFunc) {
  try {
    const result = await db.all(`SELECT ${col} FROM ${table}`);
    console.log("EXECNREMOVE RESULT: " + result);
    for (ele of result) {
      console.log(ele);
      const execRes = excFunc(ele.path);
      if (execRes >= 0) {
        const delRes = await db.run(
          `DELETE FROM ${table} WHERE ${col}=?`,
          ele.path
        );
        delFile(ele.path);
        let selRes = await getAll(db, table);
        console.log("DELRES " + selRes);
      }
    }
  } catch (err) {
    console.log(err);
  }
}

function delFile(path) {
  fs.stat(path, function (err, stats) {
    console.log(stats); //here we got all information of file in stats variable

    if (err) {
      return console.error(err);
    }

    fs.unlink(path, function (err) {
      if (err) return console.log(err);
      console.log("file deleted successfully");
    });
  });
}

async function getAll(db, table) {
  try {
    const result = await db.all(`SELECT * FROM ${table}`);
    console.log(result);
    return result;
  } catch (err) {
    console.log(err);
  }
}

async function fileExists(path) {
  fs.access(path, fs.F_OK, (err) => {
    if (err) {
      console.error(err);
      return false;
    }
    return true;
  });
}

async function writeToDB(db, fileID) {
  try {
    if (fileExists(fileID.path)) {
      console.log("file exists");
      await insertRow(db, fileID);
    }
  } catch (err) {
    console.error(err);
  }
}

async function insertRow(db, fileID) {
  console.log(fileID);
  console.log(fileID.table, fileID.path, fileID.src);
  let sql = `INSERT INTO ${fileID.table} (path, type) VALUES ('${fileID.path}', '${fileID.src}');`;
  try {
    const result = await db.exec(sql);
  } catch (err) {
    console.log(err);
  }
}

async function getDBConnection() {
  try {
    sqlite3.verbose();
    const pathsDb = await createDbConnection("./db/AllPaths.db");
    console.log("DB CONNECTION CREATED");
    return pathsDb;
  } catch (error) {
    console.error(error);
  }
}

async function createDbConnection(filename) {
  return open({ filename, driver: sqlite3.Database });
}

async function genRandomFile(path) {
  let lyrics =
    "But still I'm having memories of high speeds when the cops crashed\n" +
    "As I laugh, pushin the gas while my Glocks blast\n" +
    "We was young and we was dumb but we had heart";
  fs.writeFile(path, lyrics, (err) => {
    if (err) throw err;
    console.log("Lyric saved!");
  });
}

function readAndPrint(filepath) {
  fs.readFile(filepath, (error, data) => {
    if (error) {
      throw error;
    }
    console.log(data.toString());
  });
  return 2;
}

async function resetTable(db, table) {
  let sql = `DROP TABLE IF EXISTS ${table};`;
  try {
    await db.exec(sql);
  } catch (error) {
    logger.log(error);
  }
}

async function test() {
  //readAndPrint("./AllFiles/rawData/hysplit/usoogi.txt");
  const db = await getDBConnection();
  const createTblRes = await createTable(db, "rawData");
  let r = (Math.random() + 1).toString(36).substring(7);
  var fileId = {
    src: "hysplit",
    ext: "txt",
    name: r,
    table: "rawData",
  };
  let fn = await genFileName(fileId);
  !fs.existsSync(fileId.dir) && fs.mkdirSync(fileId.dir, { recursive: true });
  genRandomFile(fn);
  await writeToDB(db, fileId);
  const rest = await get(db, "rawData");
  console.log("Result OF select query " + rest);
  await execNRemove(db, fileId.table, "path", readAndPrint);
}

// function tester() {
//   test();
// }

// tester();

module.exports = {
  getDBConnection: getDBConnection,
  writeToDB: writeToDB,
  createTable: createTable,
  getAll: getAll,
  execNRemove: execNRemove,
  genFileName: genFileName,
  resetTable: resetTable,
};
