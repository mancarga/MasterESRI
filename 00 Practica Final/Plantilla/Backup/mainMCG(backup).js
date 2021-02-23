var map;
var tb;
// @formatter: off
require(["esri/map",
        "esri/dijit/Legend",
        "esri/dijit/Search",
        "esri/dijit/Scalebar",
        "esri/dijit/BasemapToggle",
        "esri/dijit/OverviewMap",
        "esri/layers/ArcGISDynamicMapServiceLayer",

        "dojo/on",


        "dijit/layout/TabContainer",
        "dijit/layout/ContentPane",
        "dijit/layout/BorderContainer",
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



        on

    ) {

        // @formatter: on

        // Inquiry buttoms

        on(dojo.byId("pintaYQuery"), "click", fPintaYQuery);
        on(dojo.byId("progButtonNode"), "click", fQueryEstados);

        /*
        Implement the Draw toolbar
             */

        function fPintaYQuery() {
            alert("Evento del botón Seleccionar ciudades");
        }

        function fQueryEstados() {
            alert("Evento del botón Ir a estado");
        }

        // URL variables

        var sUrlUSAService = "http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer";
        var sUrlStateLayer = "http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/2";

        // add USA map service to the map
        var lyrUSA = new ArcGISDynamicMapServiceLayer("http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer", {
            opacity: 0.5
        });

        // Create the map
        map = new Map("map", {
            basemap: "satellite",
            center: [-122.40, 37.75], // long, lat
            zoom: 13,
            sliderStyle: "small"
        });

        map.addLayer(lyrUSA);

        map.on("load", function(evt) {
            map.resize();
            map.reposition();

        });

        // Step: Add ad search widget
        var dijitSearch = new Search({
            map: map,
            autoComplete: true
        }, "divSearch");
        dijitSearch.startup();

        /*
         * Step: Add a legend once all layers have been added to the map
         */
        map.on("layers-add-result", function(evt) {
            var dijitLegend = new Legend({
                map: map,
                arrangement: Legend.ALIGN_RIGHT
            }, "legendDiv");
            dijitLegend.startup();
        });

        /*
         * Step: Add a the scalebar widget to the map
         */
        var dijitScale = new Scalebar({
            map: map,
            scalebarUnit: "metric",
            attachTo: "bottom-left"
        });

        /* Step: Add the BaseMapToggle widget to the map
         */
        var toggle = new BasemapToggle({
            map: map,
            visible: true,
            basemap: "topo",
        }, "BasemapToggle");
        toggle.startup();

        /* Step: Create a overview
         */
        var overviewMap = new OverviewMap({
            map: map,
            visible: true,
            attachTo: "bottom-right"
        }, );
        overviewMap.startup();

    });