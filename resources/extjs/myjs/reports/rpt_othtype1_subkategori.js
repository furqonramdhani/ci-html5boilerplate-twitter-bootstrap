Ext.Loader.setConfig({enabled: true});
Ext.Loader.setPath('Ext.ux', base_url+'/js/ext-4.1/ux');
Ext.Loader.setPath('Ext.ux.exporter', base_url+'/js/ext-4.1/ux/exporter');
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
    'Ext.ux.exporter.*',
    'Ext.ux.exporter.Button',
    'Ext.ux.exporter.Formatter',
    'Ext.ux.exporter.csvFormatter.CsvFormatter',
    'Ext.ux.exporter.excelFormatter.Workbook',
    'Ext.ux.exporter.excelFormatter.Worksheet',
    'Ext.ux.exporter.excelFormatter.Cell',
    'Ext.ux.exporter.excelFormatter.Style',
    'Ext.ux.exporter.excelFormatter.ExcelFormatter',
    'Ext.ux.exporter.Exporter'
]);

Ext.onReady(function () {
    var textArea;
    var currentDate = new Date();
    var currentYear = Ext.Date.format(currentDate, 'Y');
    yearName = Ext.Date.format(currentDate, 'Y');
    var monthValue='00';
    monthName='00';
    var yearValue=currentYear;

    Ext.define('GroupCategoryModel', {
        extend: 'Ext.data.Model',
        fields: [
            {name:'building_category',type:'string'},
            {name:'ttl_perokok',type:'integer'}
           ]
    });
    var storeChart = Ext.create('Ext.data.JsonStore', {
        model: 'GroupCategoryModel',
        proxy: {
            type: 'ajax',
            url: base_url+'/index.php/interface/location/json_report_type1_per_subcategory?year='+yearName+'&month='+monthName,
            reader: {
                type: 'json',
                root: 'data'
            }
        }
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
        width: 600,
        height: 400,
        title: 'Jumlah ditemukannya orang merokok didalam gedung  per Kategori',
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
            id:'chart',
            animate: true,
            shadow: true,
            store: storeChart,
            axes: [{
                type: 'Numeric',
                position: 'left',
                fields: ['ttl_perokok'],
                title: 'Total',
                grid: true,
                minimum: 0,
                maximum: 300
            }, {
                type: 'Category',
                position: 'bottom',
                fields: ['building_category'],
                // title: 'Kategori',
                label: {
                    rotate: {
                        degrees: 45
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
                yField: ['ttl_perokok'],
                highlight: true,
                tips: {
                    trackMouse: true,
                    width: 180,
                    height: 100,
                    renderer: function(storeItem, item) {
                        this.setTitle(storeItem.get('building_category'));
                        this.update('Total Kasus : '+storeItem.get('ttl_perokok'));
                    }
                },
                label: {
                    display: 'insideEnd',
                    field: ['ttl_perokok'],
                    renderer: Ext.util.Format.numberRenderer('0'),
                    orientation: 'horizontal',
                    color: '#333',
                    'text-anchor': 'middle'
                },
                style: {
                    fill: '#38B8BF'
                }
            }]
        }
    });

    var grid = Ext.create('Ext.grid.Panel', {
        store: storeChart,
        width: '300',
        title: 'Jumlah ditemukannya orang merokok didalam gedung  per Kategori',
        loadMask: true,
        selType: 'rowmodel',
        dockedItems: [{
            xtype: 'toolbar',

            items: [
                {
                    xtype: 'exporterbutton',
                    formatter: 'excel',

                    text: 'Export-to-Excel'

                },{
                    xtype: 'exporterbutton',
                    formatter: 'csv',
                    downloadImage: base_url+'/images/downloadcsv.png'

                }]
        }],
        columns: [
//            Ext.create('Ext.grid.RowNumberer'), //2
            {
                header: 'Sub Kategori Lokasi',
                text: 'Sub Kategori Lokasi', //4
                // xtype:'templatecolumn',
                width: 200,
                dataIndex: 'building_category'

            },
            // {
            //     header: 'Total Gedung',
            //     text: 'Total Gedung', //5 xtype: 'booleancolumn',
            //     width: 100,
            //     dataIndex: 'total_gedung'

            // },{
            //     header: 'Total Pengaduan',
            //     text: 'Total Pengaduan', //5 xtype: 'booleancolumn',
            //     width: 100,
            //     dataIndex: 'total_pengaduan'

            // },
            {
                header: 'Total Kasus',
                text: 'Total Kasus', //5 xtype: 'booleancolumn',
                width: 100,
                dataIndex: 'ttl_perokok'

            }

        ],
        renderTo: 'gridReport2'

    });

    grid.show();


    // Panel Prompt Box
    Ext.create('Ext.panel.Panel', {
        renderTo: 'prompt-box2',
        width: '100%',
        layout: {
            align: 'middle',
            pack: 'center',
            type: 'hbox'
        },
        collapsed: false,
        collapsible: true,
        title: 'Filter',
        titleCollapse: true,
        style:'margin:5px;padding:10px;',

        items: [{
            xtype: 'combo',
            label:'Bulan',
            id:'monthFilter',
            store: storeMonth,
            multiSelect: true,
            displayField: 'monthNameID',
            valueField:'code',
            value:'00',
            width: 150,
            labelWidth: 100,
            queryMode: 'local',
            style:'padding-right:5px;margin-right:5px;',
            listeners:{

            }
        }, {
            xtype: 'combo',
            label:'Tahun',
            id:'yearFilter',
            store: storeYear,
            displayField: 'code',
            valueField:'code',
            value:currentYear,
            width: 150,
            labelWidth: 100,
            queryMode: 'local',
            style:'padding-right:5px;margin-right:5px;',
            listeners:{

            }
        },{

            xtype: 'button',
            height: 25,
            width: 150,
            autoWidth: false,
            style:'padding-right:5px;margin-right:5px;',
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
                    url: base_url+'/index.php/interface/location/json_report_type1_per_subcategory?year='+yearName+'&month='+monthName,
                    reader: {
                        type: 'json',
                        root: 'data'
                    }
                }

                storeChart.removeAll(false);
                // storeChart.add(mData);
                storeChart.setProxy(proxy);
                storeChart.load();


//                Ext.getCmp('chart').getStore().load();


            }

        }]
    });

    storeChart.load();

});