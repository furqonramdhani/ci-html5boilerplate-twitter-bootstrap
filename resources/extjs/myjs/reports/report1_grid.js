Ext.Loader.setConfig({enabled: true});
Ext.Loader.setPath('Ext.ux', base_url+'/js/ext-4.1/ux');
Ext.require([
    'Ext.grid.*',
    'Ext.data.*',
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
 	'Ext.ux.grid.Printer'
]);
var crud_action;
var building_parent;
var inst_id;


Ext.onReady(function(){
    Ext.define('LocationModel', {
        extend: 'Ext.data.Model',
        fields: ['building_category', 'jumlah', ]
    });

    var store = Ext.create('Ext.data.JsonStore', {
        model: 'LocationModel',
        id:'LocationStores',
		pageSize:100,
		remoteSort: true,
        autoLoad:true,
        proxy: {
            type: 'ajax',
            url: base_url+'/index.php/interface/location/json_group_listing_location',
            reader: {
                type: 'json',
                root: 'data',
				totalProperty: 'total'
            },
 			simpleSortMode: true
        }
    });
   

	var grid = Ext.create('Ext.grid.Panel', {
	store: store,
	width: '300',
	title: 'Types of venues monitored',
	loadMask: true,
	selType: 'rowmodel',
	columns: [
	 Ext.create('Ext.grid.RowNumberer'), //2
	{
		text: 'Type of Venues', //4
		          // xtype:'templatecolumn',
		width: 200,
		dataIndex: 'building_category'

		},{
		text: 'Total', //5 xtype: 'booleancolumn',
		width: 75,
		dataIndex: 'jumlah'
		
		}
		
			],
		// plugins: [RowEditing]
	//	,
		listeners: {
	            
				
	      },
				renderTo: 'gridReport'
		
		});



});
