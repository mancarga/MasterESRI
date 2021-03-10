var map;
var tbDraw;
// @formatter: off
require(["esri/map",

        "esri/dijit/Legend",
        "esri/dijit/Search",
        "esri/dijit/Scalebar",
        "esri/dijit/BasemapToggle",
        "esri/dijit/OverviewMap",
        "esri/dijit/HomeButton",

        "esri/layers/ArcGISDynamicMapServiceLayer",
        "esri/layers/FeatureLayer",
        "esri/graphic",
        "esri/graphicsUtils",
        "dojo/_base/Color",
        "esri/toolbars/draw",
        "esri/tasks/query",


        "dojo/dom-construct",
        "esri/symbols/SimpleFillSymbol",
        "esri/symbols/SimpleLineSymbol",
        "esri/symbols/SimpleMarkerSymbol",

        "esri/dijit/Popup",
        "esri/dijit/PopupTemplate",
        "dojo/dom-class",

        "dgrid/OnDemandGrid",
        "dgrid/Selection",




        "dojo/on",
        "dojo/store/Memory",
        "dojo/_base/declare",
        "dojo/_base/array",


        "dijit/form/ComboBox",
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
        HomeButton,

        ArcGISDynamicMapServiceLayer,
        FeatureLayer,
        Graphic,
        graphicsUtils,
        Color,
        Draw,
        Query,

        domConstruct,
        SimpleFillSymbol,
        SimpleLineSymbol,
        SimpleMarkerSymbol,

        Popup,
        PopupTemplate,
        domClass,
        Grid,
        Selection,
        on,
        Memory,
        declare,
        array,
        ComboBox
    ) {

        // @formatter: on

        /*******************************************************
         * ********* STEP DEFINE SERVER AND LAYERS ************** 
         *******************************************************/


        // URL variables

        var sUrlUSAService = "http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer";
        var sUrlCities = "http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/0";
        var sUrlState = "http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/2";

        // add USA map service to the map
        var lyrUSA = new ArcGISDynamicMapServiceLayer(sUrlUSAService, {
            opacity: 1
        });
        lyrUSA.setVisibleLayers([0, 1, 2]);

        // Step: Specify the output fields

        var outFieldsCities = ["st", "areaname", "pop2000"];
        var outFieldsStates = ["state_name", "pop2000", "pop00_sqmi", "ss6.gdb.States.area"]


        // Construct the Cities layer
        var lyrCities = new FeatureLayer(sUrlCities, {
            outFields: outFieldsCities,
            visible: true
        });

        // Construct the State layer
        var lyrStates = new FeatureLayer(sUrlState, {
            outFields: outFieldsStates,
            visible: true
        });

        /************************************************************
         * ********* STEP DEFINE MAP TOOLS AND WIDGETS ************** 
         ***********************************************************/

        // Create the map
        map = new Map("map", {
            basemap: "satellite",
            center: [-90.40, 45.75], // long, lat
            zoom: 4,
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


        //Step: Add a legend once all layers have been added to the map

        map.on("load", function(evt) {
            var dijitLegend = new Legend({
                map: map,
                arrangement: Legend.ALIGN_RIGHT
            }, "legendDiv");
            dijitLegend.startup();
        });


        // Step: Add a the scalebar widget to the map

        var dijitScale = new Scalebar({
            map: map,
            scalebarUnit: "metric",
            attachTo: "bottom-center"
        });

        // Step: Add the BaseMapToggle widget to the map

        var toggle = new BasemapToggle({
            map: map,
            visible: true,
            basemap: "topo",
        }, "BasemapToggle");
        toggle.startup();

        // Step: Create a overview

        var overviewMap = new OverviewMap({
            map: map,
            visible: true,
            width: 150,
            attachTo: "bottom-left"
        }, );
        overviewMap.startup();

        // Step: Create HomeButton

        var home = new HomeButton({
            map: map
        }, "HomeButton");
        home.startup();

        /**********************************************
         * ********* STEP INQUIRY CITIES ************** 
         **********************************************/

        on(dojo.byId("pintaYQuery"), "click", fPintaYQuery);

        // start Draw on cliCking button SELECT CITIES

        function fPintaYQuery() {
            var tbDraw = new Draw(map);
            tbDraw.on("draw-complete", addToMap);
            tbDraw.activate(Draw.POLYGON);
        }

        // Draw on the MAP marking area selected


        function addToMap(evt) {
            var geometryInput = evt.geometry;
            var tbDrawSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
                new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT, new Color([255, 0, 0]), 2), new Color([255, 255, 0, 0.2]));
            map.graphics.clear();
            var graphicPolygon = new Graphic(geometryInput, tbDrawSymbol);
            map.graphics.add(graphicPolygon);
            selectCities(geometryInput);
        }

        // Highlight the area selected with different symbol


        function selectCities(geometryInput) {
            var symbolSelected = new SimpleMarkerSymbol({
                "type": "esriSMS",
                "style": "esriSMSCircle",
                "color": [255, 0, 0, 128],
                "size": 50,
                "outline": {
                    "color": [255, 0, 0, 214],
                    "width": 1
                }
            });
            lyrCities.setSelectionSymbol(symbolSelected);

            var queryCities = new Query();
            queryCities.geometry = geometryInput;
            lyrCities.on("selection-complete", populateGrid);
            lyrCities.selectFeatures(queryCities, FeatureLayer.SELECTION_NEW, function(feature) {
                debugger
            });
        }

        // Getting data from feature layer to list on the screen

        function populateGrid(results) {
            var dataCities;
            dataCities = array.map(results.features, function(feature) {
                return {
                    "st": feature.attributes[outFieldsCities[0]],
                    "areaname": feature.attributes[outFieldsCities[1]],
                    "pop2000": feature.attributes[outFieldsCities[2]],
                }
            });
            var memStore = new Memory({
                data: dataCities
            });
            gridCities.set("store", memStore);

        }

        // list on the screen the data


        var gridCities = new(declare([Grid, Selection]))({
            bufferRows: Infinity,
            columns: {
                st: "Estado",
                areaname: "Ciudad",
                pop2000: "Población"
            }
        }, "queryCities");


        // Clean button cities

        on(dojo.byId("clearCities"), "click", CleanDrawQuery);

        function CleanDrawQuery() {
            map.graphics.clear();
            lyrCities.clearSelection();
            // map.setExtent([-90.40, 45.75])
        };


        /**********************************************
         * ********* STEP INQUIRY STATES ************** 
         **********************************************/
        on(dojo.byId("progButtonNode"), "click", fQueryEstados);

        function fQueryEstados() {
            map.graphics.clear();
            lyrCities.clearSelection();
            var sbState = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
                new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 0, 0]), 2), new Color([255, 0, 0, 0.5]));
            lyrStates.setSelectionSymbol(sbState);

            var queryState = new Query();
            queryState.where = `state_name = '${dojo.byId("dtb").value}'`;


            lyrStates.selectFeatures(queryState, FeatureLayer.SELECTION_NEW, function(selection) {
                map.setExtent(graphicsUtils.graphicsExtent(lyrStates.getSelectedFeatures()), true)
            });

        }

        //Array USA States:
        var StateStore = new Memory({
            data: [{ name: "Alabama" }, { name: "Alaska" }, { name: "Arizona" }, { name: "Arkansas" }, { name: "California" }, { name: "Colorado" },
                { name: "Connecticut" }, { name: "Delaware" }, { name: "District of Columbia" }, { name: "Florida" }, { name: "Georgia" }, { name: "Hawaii" },
                { name: "Idaho" }, { name: "Illinois" }, { name: "Indiana" }, { name: "Iowa" }, { name: "Kansas" }, { name: "Kentucky" }, { name: "Louisiana" },
                { name: "Maine" }, { name: "Maryland" }, { name: "Massachusetts" }, { name: "Michigan" }, { name: "Minnesota" }, { name: "Mississippi" },
                { name: "Missouri" }, { name: "Montana" }, { name: "Nebraska" }, { name: "Nevada" }, { name: "New Hampshire" }, { name: "New Jersey" },
                { name: "New Mexico" }, { name: "New York" }, { name: "North Carolina" }, { name: "North Dakota" }, { name: "Ohio" }, { name: "Oklahoma" },
                { name: "Oregon" }, { name: "Pennsylvania" }, { name: "Rhode Island" }, { name: "South Carolina" }, { name: "South Dakota" }, { name: "Tennessee" },
                { name: "Texas" }, { name: "Utah" }, { name: "Vermont" }, { name: "Virginia" }, { name: "Washington" }, { name: "West Virginia" }, { name: "Wisconsin" },
                { name: "Wyoming" }
            ]
        });
        // ComboBox memory Array

        var comboBox = new ComboBox({
            id: "dtb",
            name: "state",
            value: "Washington",
            store: StateStore,
            autoComplete: true,
            searchAttr: "name"
        }, "dtb");




        /********************************************************************
         ************** STEP CREATE AN INQUIRY STATES POP UP **************** 
         *******************************************************************/

        var sfs = new SimpleFillSymbol("solid", new Color([111, 0, 255, 0.15]), 2);

        var popup = new Popup({
            fillSymbol: sfs,
            titleInBody: true
        }, domConstruct.create("map"));
        var template = new PopupTemplate({
            title: "Datos del Estado de: {STATE_NAME}",

            fieldInfos: [{
                fieldName: "pop2000",
                label: "Población:",
                visible: true
            }, {
                fieldName: "pop00_sqmi",
                label: "Población por milla²:",
                visible: true
            }, {
                fieldName: "ss6.gdb.States.area",
                label: "Area:",
                visible: true
            }],
        });

        var featureLayer = new FeatureLayer("http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/2", {
            mode: FeatureLayer.MODE_ONDEMAND,
            outFields: ["*"],
            infoTemplate: template
        });
        map.addLayer(featureLayer);

    });