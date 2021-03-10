function fQueryEstados() {

    var symbolSelectedCounties = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT, new Color([255, 255, 0]), 2), new Color([80, 0, 232, 0.2]));

    lyrStates.setSelectionSymbol(symbolSelectedCounties);

    var queryCounty = new QueryTask("http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/2");

    var query = new Query();

    var valorCombo = document.getElementById("dtb").value;

    valorCombo = `${valorCombo[0].toUpperCase()}${valorCombo.slice(1)}`;

    query.where = "state_name ='" + valorCombo + "'";

    query.returnGeometry = true;

    query.outFields = ["*"];

    lyrStates.selectFeatures(query, FeatureLayer.SELECTION_NEW, function() {

        map.setExtent(graphicsUtils.graphicsExtent(lyrStates.getSelectedFeatures()), true)

    });

}