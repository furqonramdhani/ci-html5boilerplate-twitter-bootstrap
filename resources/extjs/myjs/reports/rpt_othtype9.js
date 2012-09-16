Ext.Loader.setConfig({enabled: true});
Ext.Loader.setPath('Ext.ux', base_url+'/js/ext-4.1/ux');
//Ext.Loader.setPath('Ext.ux.exporter', base_url+'/js/ext-4.1/ux/exporter');
Ext.require([
    'Ext.grid.*',
    'Ext.data.*',
    'Ext.form.field.Number',
    'Ext.chart.*',
    'Ext.layout.container.Fit',
    'Ext.panel.*',
    'Ext.ModelManager',
    'Ext.util.*',
    'Ext.toolbar.Paging',
    'Ext.form.Panel',
    'Ext.tab.*',
    'Ext.window.*',
    'Ext.tip.*',
    'Ext.layout.container.Border',
    'Ext.ux.container.ButtonSegment'
//    ,
//    'Ext.ux.grid.Printer',
//    'Ext.ux.exporter.*',
//    'Ext.ux.exporter.Button',
//    'Ext.ux.exporter.Formatter',
//    'Ext.ux.exporter.csvFormatter.CsvFormatter',
//    'Ext.ux.exporter.excelFormatter.Workbook',
//    'Ext.ux.exporter.excelFormatter.Worksheet',
//    'Ext.ux.exporter.excelFormatter.Cell',
//    'Ext.ux.exporter.excelFormatter.Style',
//    'Ext.ux.exporter.excelFormatter.ExcelFormatter',
//    'Ext.ux.exporter.Exporter'
]);

Ext.onReady(function () {
    var textArea;
    var typeReport=1;
    var currentDate = new Date();
    var currentYear = Ext.Date.format(currentDate, 'Y');
    yearName = Ext.Date.format(currentDate, 'Y');
    var monthValue='0';
    monthName=0;
    var yearValue=currentYear;

    // Kategori
    Ext.define('GroupCategoryModel', {
        extend: 'Ext.data.Model',
        fields: [
            {name:'category',type:'string'},
            {name:'building_category',type:'string'},
            {name:'ttl_taat',type:'integer'},
            {name:'ttl_taat_percent',type:'float'},
            {name:'ttl_tidaktaat',type:'integer'},
            {name:'ttl_tidaktaat_percent',type:'float'}
        ]
    });
    var storeChart = Ext.create('Ext.data.JsonStore', {
        model: 'GroupCategoryModel',
        proxy: {
            type: 'ajax',
            url: base_url+'/index.php/interface/location/json_report_type9_per_category?year='+yearName+'&month='+monthName,
            reader: {
                type: 'json',
                root: 'data'
            }
        },
        groupField: 'category'
    });

    // Sub Kategori
    Ext.define('GroupCategoryModel2', {
        extend: 'Ext.data.Model',
        fields: [
            {name:'category',type:'string'},
            {name:'building_category',type:'string'},
            {name:'ttl_taat',type:'integer'},
            {name:'ttl_taat_percent',type:'float'},
            {name:'ttl_tidaktaat',type:'integer'},
            {name:'ttl_tidaktaat_percent',type:'float'}
        ]
    });
    var storeChart2 = Ext.create('Ext.data.JsonStore', {
        model: 'GroupCategoryModel2',
        proxy: {
            type: 'ajax',
            url: base_url+'/index.php/interface/location/json_report_type9_per_subcategory?year='+yearName+'&month='+monthName,
            reader: {
                type: 'json',
                root: 'data'
            }
        },
        groupField: 'category'
    });

    // district

    Ext.define('GroupCategoryModel3', {
        extend: 'Ext.data.Model',
        fields: [
            {name:'category',type:'string'},
            {name:'building_city',type:'string'},
            {name:'ttl_taat',type:'integer'},
            {name:'ttl_taat_percent',type:'float'},
            {name:'ttl_tidaktaat',type:'integer'},
            {name:'ttl_tidaktaat_percent',type:'float'}
        ]
    });
    var storeChart3 = Ext.create('Ext.data.JsonStore', {
        model: 'GroupCategoryModel3',
        proxy: {
            type: 'ajax',
            url: base_url+'/index.php/interface/location/json_report_type9_per_district?year='+yearName+'&month='+monthName,
            reader: {
                type: 'json',
                root: 'data'
            }
        },
        groupField: 'category'
    });

    Ext.define('MonthModel', {
        extend: 'Ext.data.Model',
        fields: ['code', 'monthNameEN','monthNameID']
    });
    var storeMonth = Ext.create('Ext.data.Store', {
        model: 'MonthModel',
        autoLoad:true,
        autoDestroy: true,
        data: monthData
    });

    Ext.define('YearModel', {
        extend: 'Ext.data.Model',
        fields: ['code']
    });
    var storeYear = Ext.create('Ext.data.Store', {
        model: 'YearModel',
        autoLoad:true,
        autoDestroy: true,
        data: yearData
    });

    var panelChart = Ext.create('widget.panel', {
        width: '100%',
        height: 400,
        title: 'Overall level of compliance (all criteria included)',
        renderTo: 'chart-1',
        layout: 'fit',
        style:'font-size:8px;',
        tbar: [{
            text: 'Save Chart',
            handler: function() {
                Ext.MessageBox.confirm('Confirm Download', 'Would you like to download the chart as an image?', function(choice){
                    if(choice == 'yes'){
                        Ext.getCmp('chart').save({
                            type: 'image/png'
                        });
                    }
                });
            }
        }],
        items: {
            xtype: 'chart',
            id:'chart',
            animate: true,
            shadow: true,
            store: storeChart,
            axes: [{
                type: 'Numeric',
                position: 'left',
                fields: ['ttl_taat'],
                title: 'Total',
                grid: true,
                minimum: 0,
                maximum: 300
            }, {
                type: 'Category',
                position: 'bottom',
                fields: ['building_category'],
                title: 'Kategori',
                label: {
                    font:'9px Helvetica, sans-serif',
                    rotate: {
                        degrees: 10
                    }
                }
            }],
            background: {
                gradient: {
                    id: 'backgroundGradient',
                    angle: 45,
                    stops: {
                        0: {
                            color: '#ffffff'
                        },
                        100: {
                            color: '#eaf1f8'
                        }
                    }
                }
            },
            series: [{
                type: 'column',
                axis: 'left',
                // gutter: 80,
                xField: 'building_category',
                yField: ['ttl_taat'],
                highlight: true,
                tips: {
                    trackMouse: true,
                    width: 180,
                    height: 100,
                    renderer: function(storeItem, item) {
                        this.setTitle(storeItem.get('building_category'));
                        this.update('Total Taat : '+storeItem.get('ttl_taat')+'<br />'+'Total Tidak Taat : '+storeItem.get('ttl_tidaktaat')+'<br />');
                    }
                },
                label: {
                    display: 'outside',
                    field: ['ttl_taat'],
                    renderer: Ext.util.Format.numberRenderer('0'),
                    orientation: 'horizontal',
                    color: '#333',
                    'text-anchor': 'middle',
                    font:'10px Helvetica, sans-serif'

                },
                style: {
                    fill: '#38B8BF'

                }
            }]
        }
    });


    // chart Kategori in Percent
    var panelChart2 = Ext.create('widget.panel', {
        width: '100%',
        height: 400,
        autoSize:true,
        title: 'Overall level of compliance (all criteria included)',
        renderTo: 'chart-2',
        layout: 'fit',
        tbar: [{
            text: 'Save Chart',
            handler: function() {
                Ext.MessageBox.confirm('Confirm Download', 'Would you like to download the chart as an image?', function(choice){
                    if(choice == 'yes'){
                        Ext.getCmp('chart2').save({
                            type: 'image/png'
                        });
                    }
                });
            }
        }],
        items: {
            xtype: 'chart',
            id:'chart2',
            animate: true,
            shadow: true,
            store: storeChart,
            axes: [{
                type: 'Numeric',
                position: 'left',
                fields: ['ttl_taat_percent'],
                title: 'Total',
                grid: true,
                minimum: 0,
                maximum: 100
            }, {
                type: 'Category',
                position: 'bottom',
                fields: ['building_category'],
                title: 'Kategori',
                label: {
                    font:'9px Helvetica, sans-serif',
                    rotate: {
                        degrees: 10
                    }
                }
            }],
            background: {
                gradient: {
                    id: 'backgroundGradient',
                    angle: 45,
                    stops: {
                        0: {
                            color: '#ffffff'
                        },
                        100: {
                            color: '#eaf1f8'
                        }
                    }
                }
            },
            series: [{
                type: 'column',
                axis: 'left',
                // gutter: 80,
                xField: 'building_category',
                yField: ['ttl_taat_percent'],
                highlight: true,
                tips: {
                    trackMouse: true,
                    width: 180,
                    height: 100,
                    renderer: function(storeItem, item) {
                        this.setTitle(storeItem.get('building_category'));
                        this.update('Total Taat : '+storeItem.get('ttl_taat')+'<br />'+'Total Tidak Taat : '+storeItem.get('ttl_tidaktaat')+'<br />');
                    }
                },
                label: {
                    display: 'outside',
                    field: ['ttl_taat_percent'],
                    renderer: function(value, metaData, record, rowIdx, colIdx, store, view){
                        return value + '% ';
                    },
                    //renderer: Ext.util.Format.numberRenderer('0'),
                    orientation: 'horizontal',
                    color: '#333',
                    font:'9px Helvetica, sans-serif',
                    'text-anchor': 'middle'
                },
                style: {
                    fill: '#38B8BF'

                }
            }]
        }
    });

    // chart Sub Kategori in Percent
    var panelChart3 = Ext.create('widget.panel', {
        width: '100%',
        height: 400,
        autoSize:true,
        title: 'Overall level of compliance (all criteria included)',
        renderTo: 'chart-2',
        layout: 'fit',
        tbar: [{
            text: 'Save Chart',
            handler: function() {
                Ext.MessageBox.confirm('Confirm Download', 'Would you like to download the chart as an image?', function(choice){
                    if(choice == 'yes'){
                        Ext.getCmp('chart3').save({
                            type: 'image/png'
                        });
                    }
                });
            }
        }],
        items: {
            xtype: 'chart',
            id:'chart3',
            animate: true,
            shadow: true,
            store: storeChart2,
            axes: [{
                type: 'Numeric',
                position: 'left',
                fields: ['ttl_taat_percent'],
                title: 'Total',
                grid: true,
                minimum: 0,
                maximum: 100
            }, {
                type: 'Category',
                position: 'bottom',
                fields: ['building_category'],
                title: 'Sub Kategori',
                label: {
                    font:'9px Helvetica, sans-serif',
                    rotate: {
                        degrees: 10
                    }
                }
            }],
            background: {
                gradient: {
                    id: 'backgroundGradient',
                    angle: 45,
                    stops: {
                        0: {
                            color: '#ffffff'
                        },
                        100: {
                            color: '#eaf1f8'
                        }
                    }
                }
            },
            series: [{
                type: 'column',
                axis: 'left',
                // gutter: 80,
                xField: 'building_category',
                yField: ['ttl_taat_percent'],
                highlight: true,
                tips: {
                    trackMouse: true,
                    width: 180,
                    height: 100,
                    renderer: function(storeItem, item) {
                        this.setTitle(storeItem.get('building_category'));
                        this.update('Total Taat : '+storeItem.get('ttl_taat')+'<br />'+'Total Tidak Taat : '+storeItem.get('ttl_tidaktaat')+'<br />');
                    }
                },
                label: {
                    display: 'outside',
                    field: ['ttl_taat_percent'],
                    renderer: function(value, metaData, record, rowIdx, colIdx, store, view){
                        return value + '% ';
                    },
                    //renderer: Ext.util.Format.numberRenderer('0'),
                    orientation: 'horizontal',
                    color: '#333',
                    font:'9px Helvetica, sans-serif',
                    'text-anchor': 'middle'
                },
                style: {
                    fill: '#38B8BF'

                }
            }]
        }
    });

    // chart District in Percent
    var panelChart4 = Ext.create('widget.panel', {
        width: '100%',
        height: 400,
        autoSize:true,
        title: 'Overall level of compliance (all criteria included)',
        renderTo: 'chart-2',
        layout: 'fit',
        tbar: [{
            text: 'Save Chart',
            handler: function() {
                Ext.MessageBox.confirm('Confirm Download', 'Would you like to download the chart as an image?', function(choice){
                    if(choice == 'yes'){
                        Ext.getCmp('chart4').save({
                            type: 'image/png'
                        });
                    }
                });
            }
        }],
        items: {
            xtype: 'chart',
            id:'chart4',
            animate: true,
            shadow: true,
            store: storeChart3,
            axes: [{
                type: 'Numeric',
                position: 'left',
                fields: ['ttl_taat_percent'],
                title: 'Total',
                grid: true,
                minimum: 0,
                maximum: 100
            }, {
                type: 'Category',
                position: 'bottom',
                fields: ['building_city'],
                title: 'Wilayah',
                label: {
                    font:'9px Helvetica, sans-serif',
                    rotate: {
                        degrees: 10
                    }
                }
            }],
            background: {
                gradient: {
                    id: 'backgroundGradient',
                    angle: 45,
                    stops: {
                        0: {
                            color: '#ffffff'
                        },
                        100: {
                            color: '#eaf1f8'
                        }
                    }
                }
            },
            series: [{
                type: 'column',
                axis: 'left',
                // gutter: 80,
                xField: 'building_city',
                yField: ['ttl_taat_percent'],
                highlight: true,
                tips: {
                    trackMouse: true,
                    width: 180,
                    height: 100,
                    renderer: function(storeItem, item) {
                        this.setTitle(storeItem.get('building_city'));
                        this.update('Total Taat : '+storeItem.get('ttl_taat')+'<br />'+'Total Tidak Taat : '+storeItem.get('ttl_tidaktaat')+'<br />');
                    }
                },
                label: {
                    display: 'outside',
                    field: ['ttl_taat_percent'],
                    renderer: function(value, metaData, record, rowIdx, colIdx, store, view){
                        return value + '% ';
                    },
                    //renderer: Ext.util.Format.numberRenderer('0'),
                    orientation: 'horizontal',
                    color: '#333',
                    font:'9px Helvetica, sans-serif',
                    'text-anchor': 'middle'
                },
                style: {
                    fill: '#38B8BF'

                }
            }]
        }
    });

    var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
        clicksToEdit: 1
    });
    var showSummary = true;
    //kategori
    var grid = Ext.create('Ext.grid.Panel', {
        store: storeChart,
        width: '300',
        title: 'Overall level of compliance (all criteria included)',
        loadMask: true,
        renderTo: 'gridReport',

        dockedItems: [{
            dock: 'top',
            xtype: 'toolbar',
            items: [{
                icon: '/images/printer.png',
                text: 'Print',
                scope: this,
                handler : function(){
                    monthName = Ext.getCmp('monthFilter').getValue();
                    yearName = Ext.getCmp('yearFilter').getValue();
                    location.href = base_url+'/index.php/interface/report/rpt_location_per_category?year='+yearName+'&month='+monthName;
                }
            }]
        }],
        features: [{
            id: 'group',
            ftype: 'groupingsummary',
            groupHeaderTpl: '{name}',
            hideGroupedHeader: true,
            enableGroupingMenu: false
        }],
        columns: [{
            text: 'Kategori Lokasi',
            flex: 1,
            tdCls: 'task',
            sortable: true,
            dataIndex: 'category',
            hideable: false,
//            summaryType: 'count',
//            summaryRenderer: function(value, summaryData, dataIndex) {
//                return ((value === 0 || value > 1) ? '(' + value + ' Kategori)' : '(1 Kategori)');
//            }
        },  //Ext.create('Ext.grid.RowNumberer'), //2
            {
                header: 'Kategori Lokasi',
                text: 'Kategori Lokasi', //4
                // xtype:'templatecolumn',
                flex: 1,
                dataIndex: 'building_category',
//                summaryType: 'count',
//                summaryRenderer: function(value, summaryData, dataIndex) {
//                    return ((value === 0 || value > 1) ? '(' + value + ' Kategori)' : '(1 Kategori)');
//                }

            },
            {
                header: 'Total Taat',
                text: 'Total Taat', //5 xtype: 'booleancolumn',
                width: 100,
                dataIndex: 'ttl_taat',
//                summaryType: 'sum',
//                summaryRenderer: function(value, summaryData, dataIndex) {
//                    return value + ' ';
//                },
//                field: {
//                    xtype: 'numberfield'
//                }

            },
            {
                header: 'Total Taat (%)',
                text: 'Total Taat (%)', //5 xtype: 'booleancolumn',
                width: 100,
                dataIndex: 'ttl_taat_percent',
                renderer: function(value, metaData, record, rowIdx, colIdx, store, view){
                    return value + ' %';
                },
//                summaryType: 'average',
//                summaryRenderer: function(value, summaryData, dataIndex) {
//                    return Ext.util.Format.round(value,2) + ' %';
//                },
//                field: {
//                    xtype: 'numberfield'
//                }

            },
            {
                header: 'Total Tidak Taat',
                text: 'Total Tidak Taat', //5 xtype: 'booleancolumn',
                width: 100,
                dataIndex: 'ttl_tidaktaat',
//                summaryType: 'sum',
//                summaryRenderer: function(value, summaryData, dataIndex) {
//                    return value + ' ';
//                },
//                field: {
//                    xtype: 'numberfield'
//                }

            },
            {
                header: 'Total Tidak Taat (%)',
                text: 'Total Tidak Taat (%)', //5 xtype: 'booleancolumn',
                width: 100,
                dataIndex: 'ttl_tidaktaat_percent',
                renderer: function(value, metaData, record, rowIdx, colIdx, store, view){
                    return value + ' %';
                },
//                summaryType: 'average',
//                summaryRenderer: function(value, summaryData, dataIndex) {
//                    return Ext.util.Format.round(value,2) + ' %';
//                },
//                field: {
//                    xtype: 'numberfield'
//                }

            }

        ]


    });

    //Sub Kategori
    var grid2 = Ext.create('Ext.grid.Panel', {
        store: storeChart2,
        width: '300',
        title: 'Overall level of compliance (all criteria included)',
        loadMask: true,
        renderTo: 'gridReport',

        dockedItems: [{
            dock: 'top',
            xtype: 'toolbar',
            items: [{
                icon: '/images/printer.png',
                text: 'Print',
                scope: this,
                handler : function(){
                    monthName = Ext.getCmp('monthFilter').getValue();
                    yearName = Ext.getCmp('yearFilter').getValue();
                    location.href = base_url+'/index.php/interface/report/rpt_location_per_category?year='+yearName+'&month='+monthName;
                }
            }]
        }],
        features: [{
            id: 'group',
            ftype: 'groupingsummary',
            groupHeaderTpl: '{name}',
            hideGroupedHeader: true,
            enableGroupingMenu: false
        }],
        columns: [{
            text: 'Sub Kategori Lokasi',
            flex: 1,
            tdCls: 'task',
            sortable: true,
            dataIndex: 'category',
            hideable: false,
//            summaryType: 'count',
//            summaryRenderer: function(value, summaryData, dataIndex) {
//                return ((value === 0 || value > 1) ? '(' + value + ' Sub Kategori)' : '(1 Sub Kategori)');
//            }
        },  //Ext.create('Ext.grid.RowNumberer'), //2
            {
                header: 'Sub Kategori Lokasi',
                text: 'Sub Kategori Lokasi', //4
                // xtype:'templatecolumn',
                flex: 1,
                dataIndex: 'building_category',
//                summaryType: 'count',
//                summaryRenderer: function(value, summaryData, dataIndex) {
//                    return ((value === 0 || value > 1) ? '(' + value + ' Sub Kategori)' : '(1 Sub Kategori)');
//                }

            },
            {
                header: 'Total Taat',
                text: 'Total Taat', //5 xtype: 'booleancolumn',
                width: 100,
                dataIndex: 'ttl_taat',
//                summaryType: 'sum',
//                summaryRenderer: function(value, summaryData, dataIndex) {
//                    return value + ' ';
//                },
//                field: {
//                    xtype: 'numberfield'
//                }

            },
            {
                header: 'Total Taat (%)',
                text: 'Total Taat (%)', //5 xtype: 'booleancolumn',
                width: 100,
                dataIndex: 'ttl_taat_percent',
                renderer: function(value, metaData, record, rowIdx, colIdx, store, view){
                    return value + ' %';
                },
//                summaryType: 'average',
//                summaryRenderer: function(value, summaryData, dataIndex) {
//                    return Ext.util.Format.round(value,2) + ' %';
//                },
//                field: {
//                    xtype: 'numberfield'
//                }

            },
            {
                header: 'Total Tidak Taat',
                text: 'Total Tidak Taat', //5 xtype: 'booleancolumn',
                width: 100,
                dataIndex: 'ttl_tidaktaat',
//                summaryType: 'sum',
//                summaryRenderer: function(value, summaryData, dataIndex) {
//                    return value + ' ';
//                },
//                field: {
//                    xtype: 'numberfield'
//                }

            },
            {
                header: 'Total Tidak Taat (%)',
                text: 'Total Tidak Taat (%)', //5 xtype: 'booleancolumn',
                width: 100,
                dataIndex: 'ttl_tidaktaat_percent',
                renderer: function(value, metaData, record, rowIdx, colIdx, store, view){
                    return value + ' %';
                },
//                summaryType: 'average',
//                summaryRenderer: function(value, summaryData, dataIndex) {
//                    return Ext.util.Format.round(value,2) + ' %';
//                },
//                field: {
//                    xtype: 'numberfield'
//                }

            }

        ]


    });

    //district
    var grid3 = Ext.create('Ext.grid.Panel', {
        store: storeChart3,
        width: '300',
        title: 'Overall level of compliance (all criteria included)',
        loadMask: true,
        renderTo: 'gridReport',

        dockedItems: [{
            dock: 'top',
            xtype: 'toolbar',
            items: [{
                icon: '/images/printer.png',
                text: 'Print',
                scope: this,
                handler : function(){
                    monthName = Ext.getCmp('monthFilter').getValue();
                    yearName = Ext.getCmp('yearFilter').getValue();
                    location.href = base_url+'/index.php/interface/report/rpt_location_per_category?year='+yearName+'&month='+monthName;
                }
            }]
        }],
        features: [{
            id: 'group',
            ftype: 'groupingsummary',
            groupHeaderTpl: '{name}',
            hideGroupedHeader: true,
            enableGroupingMenu: false
        }],
        columns: [{
            text: 'Wilayah',
            flex: 1,
            tdCls: 'task',
            sortable: true,
            dataIndex: 'category',
            hideable: false,
//            summaryType: 'count',
//            summaryRenderer: function(value, summaryData, dataIndex) {
//                return ((value === 0 || value > 1) ? '(' + value + ' Wilayah)' : '(1 Wilayah)');
//            }
        },  //Ext.create('Ext.grid.RowNumberer'), //2
            {
                header: 'Wilayah',
                text: 'Wilayah', //4
                // xtype:'templatecolumn',
                flex: 1,
                dataIndex: 'building_city',
//                summaryType: 'count',
//                summaryRenderer: function(value, summaryData, dataIndex) {
//                    return ((value === 0 || value > 1) ? '(' + value + ' Wilayah)' : '(1 Wilayah)');
//                }

            },
            {
                header: 'Total Taat',
                text: 'Total Taat', //5 xtype: 'booleancolumn',
                width: 100,
                dataIndex: 'ttl_taat',
//                summaryType: 'sum',
//                summaryRenderer: function(value, summaryData, dataIndex) {
//                    return value + ' ';
//                },
//                field: {
//                    xtype: 'numberfield'
//                }

            },
            {
                header: 'Total Taat (%)',
                text: 'Total Taat (%)', //5 xtype: 'booleancolumn',
                width: 100,
                dataIndex: 'ttl_taat_percent',
                renderer: function(value, metaData, record, rowIdx, colIdx, store, view){
                    return value + ' %';
                },
//                summaryType: 'average',
//                summaryRenderer: function(value, summaryData, dataIndex) {
//                    return Ext.util.Format.round(value,2) + ' %';
//                },
//                field: {
//                    xtype: 'numberfield'
//                }

            },
            {
                header: 'Total Tidak Taat',
                text: 'Total Tidak Taat', //5 xtype: 'booleancolumn',
                width: 100,
                dataIndex: 'ttl_tidaktaat',
//                summaryType: 'sum',
//                summaryRenderer: function(value, summaryData, dataIndex) {
//                    return value + ' ';
//                },
//                field: {
//                    xtype: 'numberfield'
//                }

            },
            {
                header: 'Total Tidak Taat (%)',
                text: 'Total Tidak Taat (%)', //5 xtype: 'booleancolumn',
                width: 100,
                dataIndex: 'ttl_tidaktaat_percent',
                renderer: function(value, metaData, record, rowIdx, colIdx, store, view){
                    return value + ' %';
                },
//                summaryType: 'average',
//                summaryRenderer: function(value, summaryData, dataIndex) {
//                    return Ext.util.Format.round(value,2) + ' %';
//                },
//                field: {
//                    xtype: 'numberfield'
//                }

            }

        ]


    });

//    grid.show();


    // Panel Prompt Box
    Ext.create('Ext.panel.Panel', {
        renderTo: 'prompt-box',
        width: '100%',
        frame:true,
        layout: {
            align: 'middle',
            pack: 'center',
            type: 'hbox'
        },
        collapsed: false,
        collapsible: false,
//        title: 'Filter',
        titleCollapse: true,
//        style:'margin:5px;padding:10px;',

        items: [{
            xtype: 'combo',
            fieldLabel:'Bulan',
            id:'monthFilter',
            store: storeMonth,
            multiSelect: true,
            displayField: 'monthNameID',
            valueField:'code',
//            value:'',
            width: 250,
            labelWidth: 100,
            queryMode: 'local',
            style:'padding-right:5px;margin-right:5px;',
            listeners:{

            }
        }, {
            xtype: 'combo',
            fieldLabel:'Tahun',
            id:'yearFilter',
            store: storeYear,
            displayField: 'code',
            valueField:'code',
            value:currentYear,
            width: 250,
            labelWidth: 100,
            queryMode: 'local',
            style:'padding-right:5px;margin-right:5px;',
            listeners:{

            }
        },{

            xtype: 'button',
            margin: '0px 0px 0px 6px',
            scale: 'medium',
            ui: 's-button',
            text: 'Apply',
            cls: 's-blue',
            disabled: false,
            text: 'Submit',
            handler:function(){
                monthName = Ext.getCmp('monthFilter').getValue();
                yearName = Ext.getCmp('yearFilter').getValue();
                console.log(yearName);

                if(typeReport==1){
                    var proxy = {
                        type: 'ajax',
                        url: base_url+'/index.php/interface/location/json_report_type9_per_category?year='+yearName+'&month='+monthName,
                        reader: {
                            type: 'json',
                            root: 'data'
                        },
                        groupField:'category'
                    }

                    storeChart.removeAll(false);
                    storeChart.setProxy(proxy);
                    storeChart.load();
                } else if(typeReport==2){
                    var proxy = {
                        type: 'ajax',
                        url: base_url+'/index.php/interface/location/json_report_type9_per_subcategory?year='+yearName+'&month='+monthName,
                        reader: {
                            type: 'json',
                            root: 'data'
                        },
                        groupField:'category'
                    }

                    storeChart2.removeAll(false);
                    storeChart2.setProxy(proxy);
                    storeChart2.load();
                } else {
                    var proxy = {
                        type: 'ajax',
                        url: base_url+'/index.php/interface/location/json_report_type9_per_district?year='+yearName+'&month='+monthName,
                        reader: {
                            type: 'json',
                            root: 'data'
                        },
                        groupField:'category'
                    }

                    storeChart3.removeAll(false);
                    storeChart3.setProxy(proxy);
                    storeChart3.load();
                }




            }

        }]
    });
    Ext.create('Ext.ux.container.ButtonSegment', {
        renderTo: 'button-box',
        style: 'text-align:center;',
        layout :{
            align: 'middle',
            pack: 'center',
            type: 'hbox'
        },
        defaults: {
            scale: 'medium'
        },
        items: [
//            {
//            text: 'In Unit',
//            handler:function(){
//                //alert('halo');
//                panelChart2.hide();
//                panelChart.show();
//            }
//        },
            {
                text: 'Kategori',
                handler:function(){
                    typeReport=1;
                    panelChart.hide();
                    panelChart2.show();
                    panelChart3.hide();
                    panelChart4.hide();
                    grid.show();
                    grid2.hide();
                    grid3.hide();

                }
            },
            {
                text: 'Sub Kategori',
                handler:function(){
                    typeReport=2;
                    storeChart2.load();
                    panelChart.hide();
                    panelChart2.hide();
                    panelChart3.show();
                    panelChart4.hide();
                    grid.hide();
                    grid2.show();
                    grid3.hide();
                }
            },
            {
                text: 'Wilayah',
                handler:function(){
                    typeReport=3;
                    storeChart3.load();
                    panelChart.hide();
                    panelChart2.hide();
                    panelChart3.hide();
                    panelChart4.show();
                    grid.hide();
                    grid2.hide();
                    grid3.show();
                }
            }
        ]
    });

    storeChart.load();
    grid.show();
    grid2.hide();
    grid3.hide();
    panelChart.hide();
    panelChart2.show();
    panelChart3.hide();
    panelChart4.hide();

});