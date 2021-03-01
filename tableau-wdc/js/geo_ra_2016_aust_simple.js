(function () {
  var myConnector = tableau.makeConnector();

  myConnector.getSchema = function (schemaCallback) {
    var cols = [
      {
        id: "RA_CODE16",
        alias: "Remoteness Code",
        dataType: tableau.dataTypeEnum.string,
        columnRole: tableau.columnRoleEnum.dimension,
        columnType: tableau.columnTypeEnum.discrete,
      },
      {
        id: "RA_NAME16",
        alias: "Remoteness Name",
        dataType: tableau.dataTypeEnum.string,
        columnRole: tableau.columnRoleEnum.dimension,
        columnType: tableau.columnTypeEnum.discrete,
      },
      {
        id: "STE_CODE16",
        alias: "State Code",
        dataType: tableau.dataTypeEnum.string,
        columnRole: tableau.columnRoleEnum.dimension,
        columnType: tableau.columnTypeEnum.discrete,
      },
      {
        id: "STE_NAME16",
        alias: "State Name",
        dataType: tableau.dataTypeEnum.string,
        columnRole: tableau.columnRoleEnum.dimension,
        columnType: tableau.columnTypeEnum.discrete,
      },
      {
        id: "AREASQKM16",
        alias: "Area (Square Kms)",
        dataType: tableau.dataTypeEnum.float,
        columnRole: tableau.columnRoleEnum.measure,
        columnType: tableau.columnTypeEnum.continuous,
      },
      {
        id: "geometry",
        alias: "geometry",
        dataType: tableau.dataTypeEnum.geometry,
      },
    ];

    var tableSchema = {
      id: "geo_ra_2016_aust_simple",
      alias: "Geo RA 2016",
      columns: cols,
    };

    schemaCallback([tableSchema]);
  };

  myConnector.getData = function (table, doneCallback) {
    loadJSON("geo_ra_2016_aust_simple", function (resp) {
      var respJson = JSON.parse(resp);
      var dataarray = respJson.features,
        tableData = [];

      // Iterate over the JSON object
      for (var i = 0, len = dataarray.length; i < len; i++) {
        tableData.push({
          RA_CODE16: dataarray[i].properties.RA_CODE16,
          RA_NAME16: dataarray[i].properties.RA_NAME16,
          STE_CODE16: dataarray[i].properties.STE_CODE16,
          STE_NAME16: dataarray[i].properties.STE_NAME16,
          AREASQKM16: dataarray[i].properties.AREASQKM16,
          geometry: dataarray[i].geometry,
        });
      }

      table.appendRows(tableData);
      doneCallback();
    });
  };

  tableau.registerConnector(myConnector);
})();

$(document).ready(function () {
  $("#submitButton").click(function () {
    tableau.connectionName = "Geo RA 2016";
    tableau.submit();
  });
});

// Helper function that loads a json and a callback to call once that file is loaded
function loadJSON(path, cb) {
  var obj = new XMLHttpRequest();
  obj.overrideMimeType("application/json");
  obj.open("GET", "../json/" + path + "." + "geojson", true);
  obj.onreadystatechange = function () {
    if (obj.readyState == 4 && obj.status == "200") {
      console.log(obj.responseText);
      cb(obj.responseText);
    }
  };
  obj.send(null);
}
