var mapMain;
var tbDraw;
// @formatter: off
require(["esri/map",
        "esri/dijit/Legend",
        "esri/dijit/Search",
        "esri/dijit/Scalebar",
        "esri/dijit/BasemapToggle",
        "esri/dijit/OverviewMap",
        "esri/layers/ArcGISDynamicMapServiceLayer",
        "esri/layers/FeatureLayer",

        "esri/symbols/SimpleFillSymbol",
        "esri/symbols/SimpleLineSymbol",
        "esri/symbols/SimpleMarkerSymbol",


        "esri/toolbars/draw",
        "esri/graphic",
        "esri/tasks/query",

        "dojo/on",


        "dijit/layout/TabContainer",
        "dijit/layout/ContentPane",
        "dijit/layout/BorderContainer",
        "dijit/form/Button",
        "dojo/domReady!"
    ],
    function(
        Map,
        Legend,
        Search,
        Scalebar,
        BasemapToggle,
        OverviewMap,
        ArcGISDynamicMapServiceLayer,
        SimpleFillSymbol,
        SimpleLineSymbol,
        SimpleMarkerSymbol,

        FeatureLayer,
        Draw,
        Graphic,
        Query,



        on

    ) {

        // @formatter: on

        // Inquiry buttoms

        on(dojo.byId("pintaYQuery"), "click", fPintaYQuery);
        on(dojo.byId("progButtonNode"), "click", fQueryEstados);


        // Step: Wire the draw tool initialization function

        // mapMain.on("load", fPintaYQuery);


        // Implement the Draw toolbar

        function fPintaYQuery() {
            // alert("Evento del botón Seleccionar ciudades");
            var tbDraw = new Draw(mapMain);
            tbDraw.on("draw-end", displayPolygon);
            tbDraw.activate(Draw.POLYGON);
        }

        // Draw the polygon  

        function displayPolygon(evt) {

            var geometryInput = evt.geometry;

            var tbDrawSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
                new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT,
                    new Color([255, 255, 0]), 2), new Color([255, 255, 0, 0.2]));

            mapMain.graphics.clear();

            /*
             * Step: Construct and add the polygon graphic
             */

            var graphicPolygon = new Graphic(geometryInput, tbDrawSymbol);

            mapMain.graphics.add(graphicPolygon);

            // Call the next function
            selectCities(geometryInput);

        }



        function fQueryEstados() {
            alert("Evento del botón Ir a estado");
        }

        // URL variables

        var sUrlUSAService = "http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer";
        var sUrlCities = "http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/0";
        var sUrlState = "http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/2";

        // add USA map service to the map
        var lyrUSA = new ArcGISDynamicMapServiceLayer(sUrlUSAService, {
            opacity: 0.25
        });
        lyrUSA.setVisibleLayers([0, 1, 2, 3]);

        // Create the map
        mapMain = new Map("map", {
            basemap: "satellite",
            center: [-122.30, 37.75], // long, lat
            zoom: 10,
            sliderStyle: "small"
        });


        mapMain.addLayer(lyrUSA);

        /*mapMain.on("load", function(evt) {
            mapMain.resize();
            mapMain.reposition();

        });
*/
        // Step: Add ad search widget
        var dijitSearch = new Search({
            map: mapMain,
            autoComplete: true
        }, "divSearch");
        dijitSearch.startup();

        /*
         * Step: Add a legend once all layers have been added to the map
         */
        mapMain.on("layers-add-result", function(evt) {
            var dijitLegend = new Legend({
                map: mapMain,
                arrangement: Legend.ALIGN_RIGHT
            }, "legendDiv");
            dijitLegend.startup();
        });

        /*
         * Step: Add a the scalebar widget to the map
         */
        var dijitScale = new Scalebar({
            map: mapMain,
            scalebarUnit: "metric",
            attachTo: "bottom-center"
        });

        /* Step: Add the BaseMapToggle widget to the map
         */
        var toggle = new BasemapToggle({
            map: mapMain,
            visible: true,
            basemap: "topo",
        }, "BasemapToggle");
        toggle.startup();

        /* Step: Create a overview
         */
        var overviewMap = new OverviewMap({
            map: mapMain,
            visible: true,
            width: 150,
            attachTo: "bottom-left"
        }, );
        overviewMap.startup();

    });