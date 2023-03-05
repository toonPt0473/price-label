import React, { useRef, useState } from "react";
import ReactToPrint from "react-to-print";
import Barcode from "react-barcode";
import logo from "./images/logo.png";

import * as XLSX from "xlsx/xlsx.mjs";

import "./App.css";

function App() {
  const [excel, setExcel] = useState(null);
  const printRef = useRef(null);
  function excelFileToJSON(file) {
    try {
      var reader = new FileReader();
      reader.readAsBinaryString(file);
      reader.onload = function (e) {
        var data = e.target.result;
        var workbook = XLSX.read(data, {
          type: "binary",
        });
        var result = {};
        workbook.SheetNames.forEach(function (sheetName) {
          var roa = XLSX.utils.sheet_to_row_object_array(
            workbook.Sheets[sheetName]
          );
          if (roa.length > 0) {
            result[sheetName] = roa;
          }
        });
        setExcel(result.sheet);
        console.log(result);
      };
    } catch (e) {
      console.error(e);
    }
  }
  function upload() {
    var files = document?.getElementById("file_upload")?.files;
    if (files.length === 0) {
      alert("Please choose any file...");
      return;
    }
    var filename = files[0].name;
    var extension = filename.substring(filename.lastIndexOf(".")).toUpperCase();
    if (extension === ".XLS" || extension === ".XLSX") {
      excelFileToJSON(files[0]);
    } else {
      alert("Please select a valid excel file.");
    }
  }
  return (
    <div className="App">
      <h1>ทำป้ายราคา</h1>
      <input type="file" id="file_upload" />
      <button onClick={upload}>Upload</button>
      {excel && (
        <div
          ref={printRef}
          style={{
            margin: "auto",
            padding: 20,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            width: 740,
          }}
        >
          {excel.map((e) => {
            return (
              <div
                style={{
                  minWidth: 220,
                  width: 220,
                  border: "1px solid black",
                  padding: "4px 10px",
                  margin: "4px 4px 0 0",
                  pageBreakInside: "avoid",
                }}
              >
                <div style={{ textAlign: "left" }}>
                  <img src={logo} style={{ width: 60 }} alt="" />
                </div>
                <p
                  style={{
                    width: 210,
                    textOverflow: "clip",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    margin: "0 0 10px 0",
                    fontSize: "0.9rem",
                    fontWeight: "bold",
                    lineHeight: "1.2rem",
                    textAlign: "left",
                  }}
                >
                  {e.name}
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 4,
                    marginBottom: 6,
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      flexGrow: 0,
                      width: "60%",
                      minWidth: "60%",
                      maxWidth: "60%",
                      fontSize: "0.7rem",
                      textAlign: "left",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Barcode
                      value={e.barcode}
                      height={40}
                      width={0.95}
                      margin={0}
                      displayValue={false}
                    />
                    <p style={{ margin: 0 }}>{e.barcode}</p>
                  </div>
                  <div
                    style={{
                      flex: 1,
                      width: "39%",
                      minWidth: "39%",
                      maxWidth: "39%",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        background: "#BFBFBF",
                        fontSize: "1rem",
                      }}
                    >
                      {e.unit}
                    </div>
                    <div style={{ width: "100%", background: "#E7EEDE" }}>
                      <p style={{ fontSize: 30, margin: 0, padding: "10px 0" }}>
                        {e.price || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {excel && (
        <ReactToPrint
          // eslint-disable-next-line
          trigger={() => <a href="#">Print this out!</a>}
          content={() => printRef.current}
        />
      )}
    </div>
  );
}

export default App;
