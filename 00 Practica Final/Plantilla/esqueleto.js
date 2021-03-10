require([
            ...
        ],
        function(
            ...
        ) {

            on(dojo.byId("pintaYQuery"), "click", function() {

                tb = new Draw(map);
                tb.activate(Draw.POLYGON);

                tb.on("draw-end", function(evt) {
                    map.graphics.clear();

                    map.graphics.add(new Graphic(evt.geometry, tbSymbolCities));

                    var queryCities = new Query();
                    queryCities.geometry = evt.geometry;
                    ftCities.selectFeatures(queryCities, FeatureLayer.SELECTION_NEW, function(g) {
                        ...
                    });
                });

            });

            on(dojo.byId("progButtonNode"), "click", function() {

                ftStates.setSelectionSymbol(sbState);

                var queryState = new Query();
                queryState.where = `state_name = '${dojo.byId("dtb").value}'`;

                ftStates.selectFeatures(queryState, FeatureLayer.SELECTION_NEW, function(selection) {
                    var centerSt = graphicsUtils.graphicsExtent(selection).getCenter();
                    map.centerAt(centerSt);
                });

            });

            on(dojo.byId("clear"), "click", function() {
                ftCities.clearSelection();
                map.graphics.clear();
                tb.deactivate()
            });

            map = new Map("map", {
                basemap: "topo",
                extent: extentInitial, //define la extension inical del mapa
                zoom: 4,
                sliderStyle: "small",
            });

            var ftCities = new FeatureLayer("http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/0", {
                outFields: ["*"]
            });

            var ftStates = new FeatureLayer("http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/2", {
                infoTemplate: new PopupTemplate({
                    ...
                }), //llama la ventana emergente
                outFields: ["*"] //llama a todos los campos de la capa
            });

            map.addLayers([ftStates, ftCities]);
        }