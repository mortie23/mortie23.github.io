(function () {
  var myConnector = tableau.makeConnector();

  myConnector.getSchema = function (schemaCallback) {
    var cols = [
      {
        id: "name",
        dataType: tableau.dataTypeEnum.string,
      },
      {
        id: "sex",
        alias: "sex",
        dataType: tableau.dataTypeEnum.string,
      },
      {
        id: "age",
        dataType: tableau.dataTypeEnum.int,
      },
      {
        id: "height",
        dataType: tableau.dataTypeEnum.float,
      },
      {
        id: "weight",
        dataType: tableau.dataTypeEnum.float,
      },
    ];

    var tableSchema = {
      id: "class",
      alias: "class of students",
      columns: cols,
    };

    schemaCallback([tableSchema]);
  };

  myConnector.getData = function (table, doneCallback) {
    loadJSON("class", function (resp) {
      var respJson = JSON.parse(resp);
      var feat = respJson.class,
        tableData = [];

      // Iterate over the JSON object
      for (var i = 0, len = feat.length; i < len; i++) {
        tableData.push({
          name: feat[i].Name,
          sex: feat[i].Sex,
          age: feat[i].Age,
          height: feat[i].Height,
          weight: feat[i].Weight,
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
    tableau.connectionName = "class";
    tableau.submit();
  });
});

// Helper function that loads a json and a callback to call once that file is loaded
function loadJSON(path, cb) {
  var obj = new XMLHttpRequest();
  obj.overrideMimeType("application/json");
  obj.open("GET", "../json/" + path + ".json", true);
  obj.onreadystatechange = function () {
    if (obj.readyState == 4 && obj.status == "200") {
      console.log(obj.responseText);
      cb(obj.responseText);
    }
  };
  obj.send(null);
}
