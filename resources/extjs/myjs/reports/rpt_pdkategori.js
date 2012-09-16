Ext.Loader.setConfig({enabled: true});
Ext.Loader.setPath('Ext.ux', base_url+'/js/ext-4.1/ux');
//Ext.Loader.setPath('Ext.ux.exporter', base_url+'/js/ext-4.1/ux/exporter');
Ext.require([
    'Ext.grid.*',
    'Ext.data.*',
    'Ext.chart.*',
    'Ext.layout.container.Fit',
    'Ext.panel.*',
    'Ext.ModelManager',
    'Ext.util.*',
    'Ext.toolbar.Paging',
    'Ext.ux.grid.FiltersFeature',
    'Ext.form.Panel',
    'Ext.tab.*',
    'Ext.window.*',
    'Ext.tip.*',
    'Ext.layout.container.Border',
    'Ext.ux.grid.Printer',
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
    var currentDate = new Date();
    var currentYear = Ext.Date.format(currentDate, 'Y');
    yearName = Ext.Date.format(currentDate, 'Y');
    var monthValue='0';
    monthName=0;
    var yearValue=currentYear;

    Ext.define('GroupCategoryModel', {
        extend: 'Ext.data.Model',
        fields: [
            {name:'category',type:'string'},
            {name:'building_category',type:'string'},
            {name:'total_gedung',type:'int'},
            {name:'total_gedung_percent',type:'float'},
            {name:'total_pengaduan',type:'int'},
            {name:'total_pengaduan_percent',type:'float'},
            {name:'total_pengawasan',type:'int'},
            {name:'total_pengawasan_percent',type:'float'}]
    });
    var storeChart = Ext.create('Ext.data.JsonStore', {
        model: 'GroupCategoryModel',
        proxy: {
            type: 'ajax',
            url: base_url+'/index.php/interface/location/json_group_location_per_category?year='+yearName+'&month='+monthName,
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
        title: 'Jumlah Pengaduan per Kategori',
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
                fields: ['total_pengaduan'],
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
                yField: ['total_pengaduan'],
                highlight: true,
                tips: {
                    trackMouse: true,
                    width: 180,
                    height: 100,
                    renderer: function(storeItem, item) {
                        this.setTitle(storeItem.get('building_category'));
                        this.update('Total Pengaduan : '+storeItem.get('total_pengaduan')+'<br />');
                    }
                },
                label: {
                    display: 'outside',
                    field: ['total_pengaduan'],
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


    // chart2
    var panelChart2 = Ext.create('widget.panel', {
        width: '100%',
        height: 400,
        autoSize:true,
        title: 'Jumlah Pengaduan per Kategori in Percent',
        renderTo: 'chart-2',
        layout: 'fit',
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
            id:'chart2',
            animate: true,
            shadow: true,
            store: storeChart,
            axes: [{
                type: 'Numeric',
                position: 'left',
                fields: ['total_pengaduan_percent'],
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
                yField: ['total_pengaduan_percent'],
                highlight: true,
                tips: {
                    trackMouse: true,
                    width: 180,
                    height: 100,
                    renderer: function(storeItem, item) {
                        this.setTitle(storeItem.get('building_category'));
                        this.update('Total Pengaduan : '+storeItem.get('total_pengaduan')+'<br />');
                    }
                },
                label: {
                    display: 'outside',
                    field: ['total_pengaduan_percent'],
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
    var grid = Ext.create('Ext.grid.Panel', {
        store: storeChart,
        width: '300',
        title: 'Jumlah Pengaduan per Kategori',
        loadMask: true,
        renderTo: 'gridReport',

//        selType: 'rowmodel',
//        dockedItems: [{
//            xtype: 'toolbar',
//
//            items: [
//                {
//                    xtype: 'exporterbutton',
//                    formatter: 'excel',
//
//                    text: 'Export-to-Excel'
//
//                },{
//                    xtype: 'exporterbutton',
//                    formatter: 'csv',
//                    downloadImage: base_url+'/images/downloadcsv.png'
//
//                }]
//        }],
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
            summaryType: 'count',
            summaryRenderer: function(value, summaryData, dataIndex) {
                return ((value === 0 || value > 1) ? '(' + value + ' Category)' : '(1 Category)');
            }
        },  //Ext.create('Ext.grid.RowNumberer'), //2
            {
                header: 'Kategori Lokasi',
                text: 'Kategori Lokasi', //4
                // xtype:'templatecolumn',
                flex: 1,
                dataIndex: 'building_category',
                summaryType: 'count',
                summaryRenderer: function(value, summaryData, dataIndex) {
                    return ((value === 0 || value > 1) ? '(' + value + ' Kategori)' : '(1 Kategori)');
                }

            },{
                header: 'Total Pengaduan',
                text: 'Total Pengaduan', //5 xtype: 'booleancolumn',
                width: 120,
                dataIndex: 'total_pengaduan',
                summaryType: 'sum',
                summaryRenderer: function(value, summaryData, dataIndex) {
                    return value + ' Pengaduan';
                },
                field: {
                    xtype: 'numberfield'
                }

            },
            {
                header: 'Total Pengaduan (%)',
                text: 'Persentase Pengaduan (%)', //5 xtype: 'booleancolumn',
                width: 120,
                dataIndex: 'total_pengaduan_percent',
                renderer: function(value, metaData, record, rowIdx, colIdx, store, view){
                    return value + ' %';
                },
                summaryType: 'average',
                summaryRenderer: function(value, summaryData, dataIndex) {
                    return Ext.util.Format.round(value,2) + ' %';
                },
                field: {
                    xtype: 'numberfield'
                }

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
//                Ext.Ajax.request({
//                    waitMsg: 'Please wait...',
//                    url: base_url+'/index.php/interface/location/json_group_location_per_subcategory?year='+yearName+'&month='+monthName,
//
//                    success: function(response){
//                      var obj = Ext.decode(response.responseText);
//                      var mData=[];
//
//                      for(var i=0;i<obj.data.length;i++){
//                         mData.push({building_category:obj.data.building_category,total_gedung:obj.data.total_gedung,total_pengaduan:obj.data.total_pengaduan,total_pengawasan:obj.data.total_pengawasan});
//                      }
//
//                    },
//                    failure: function(response){
//
//                    }
//                });
//
//
                var proxy = {
                    type: 'ajax',
                    url: base_url+'/index.php/interface/location/json_group_location_per_category?year='+yearName+'&month='+monthName,
                    reader: {
                        type: 'json',
                        root: 'data'
                    },
                    groupField:'category'
                }

                storeChart.removeAll(false);
                // storeChart.add(mData);
                storeChart.setProxy(proxy);
                storeChart.load();


//                Ext.getCmp('chart').getStore().load();


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
        items: [ {
            text: 'In Unit',
            handler:function(){
                //alert('halo');
                panelChart2.hide();
                panelChart.show();
            }
        }, {
            text: 'in Percent',
            handler:function(){
                panelChart.hide();
                panelChart2.show();
            }
        } ]
    });

    storeChart.load();
    panelChart2.hide();

});