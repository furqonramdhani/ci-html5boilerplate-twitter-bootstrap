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
        fields: ['building_city', 'total', ]
    });
    var store = Ext.create('Ext.data.JsonStore', {
        model: 'LocationModel',
        id:'LocationStores',
		pageSize:100,
		remoteSort: true,
        proxy: {
            type: 'ajax',
	            url: base_url+'/index.php/home/json_listing_group_city',
            reader: {
                type: 'json',
                root: 'data',
				totalProperty: 'total'
            },
 			simpleSortMode: true
        }
    });
   
			   // trigger the data store load
	    store.load();
	



	var grid = Ext.create('Ext.grid.Panel', {
	store: store,
	width: '300',
	title: 'Region',
	loadMask: true,
	selType: 'rowmodel',
	columns: [
	           // Ext.create('Ext.grid.RowNumberer'), //2
	{
		text: 'Region', //4
		          // xtype:'templatecolumn',
		width: 200,
		dataIndex: 'building_city'

		},{
		text: 'Total', //5 xtype: 'booleancolumn',
		width: 75,
		dataIndex: 'total'
		
		}
		
			],
		// plugins: [RowEditing]
	//	,
		listeners: {
	            
				
	      },
				renderTo: 'gridReport'
		
		});



});
