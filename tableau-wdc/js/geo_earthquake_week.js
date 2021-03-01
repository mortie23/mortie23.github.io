(function () {
  var myConnector = tableau.makeConnector();

  myConnector.getSchema = function (schemaCallback) {
    var cols = [
      {
        id: "ids",
        alias: "ID",
        dataType: tableau.dataTypeEnum.string,
        columnRole: tableau.columnRoleEnum.dimension,
        columnType: tableau.columnTypeEnum.discrete,
      },
      {
        id: "mag",
        alias: "Magnitude",
        dataType: tableau.dataTypeEnum.float,
        columnRole: tableau.columnRoleEnum.measure,
        columnType: tableau.columnTypeEnum.continuous,
      },
      {
        id: "title",
        alias: "Title",
        dataType: tableau.dataTypeEnum.string,
        columnRole: tableau.columnRoleEnum.dimension,
        columnType: tableau.columnTypeEnum.discrete,
      },
      {
        id: "geometry",
        alias: "geometry",
        dataType: tableau.dataTypeEnum.geometry,
      },
    ];

    var tableSchema = {
      id: "geo_earthquake_week",
      alias: "GEO EarthQuake 4.5 week",
      columns: cols,
    };

    schemaCallback([tableSchema]);
  };

  myConnector.getData = function (table, doneCallback) {
    loadJSON("geo_earthquake_week", function (resp) {
      var respJson = JSON.parse(resp);
      var dataarray = respJson.features,
        tableData = [];

      // Iterate over the JSON object
      for (var i = 0, len = dataarray.length; i < len; i++) {
        tableData.push({
          ids: dataarray[i].properties.ids,
          mag: dataarray[i].properties.mag,
          title: dataarray[i].properties.title,
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
    tableau.connectionName = "GEO EarthQuake 4.5 week";
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
