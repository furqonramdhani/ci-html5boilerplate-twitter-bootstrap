Ext.require('Ext.chart.*');
Ext.require('Ext.layout.container.Fit');

Ext.onReady(function () {
    var textArea;

	
	Ext.define('GroupCategoryModel', {
	        extend: 'Ext.data.Model',
	        fields: ['building_category', 'total']
	    });
	var store1 = Ext.create('Ext.data.JsonStore', {
	        model: 'GroupCategoryModel',
	        proxy: {
	            type: 'ajax',
	            url: base_url+'/index.php/home/json_listing_group_category',
	            reader: {
	                type: 'json',
	                root: 'data'
	            }
	        }
	    });
		store1.load();
		
	   


	    var panel1 = Ext.create('widget.panel', {
	        width: '100%',
	        height: 300,
	        title: 'Jumlah Gedung/tempat dalam daftar pengawasan',
	        renderTo: 'chart-1',
	        layout: 'fit',
	        // tbar: [{
	        // 	            text: 'Reload Data',
	        // 	            handler: function() {
	        // 	                store1.loadData(generateData());
	        // 	            }
	        // 	        }],
	        items: {
	            xtype: 'chart',
	            animate: true,
	            shadow: true,
	            store: store1,
	            axes: [{
	                type: 'Numeric',
	                position: 'left',
	                fields: ['total'],
	                title: 'Jumlah',
	                grid: true,
	                minimum: 0,
	                maximum: 800
	            }, {
	                type: 'Category',
	                position: 'bottom',
	                fields: ['building_category'],
	                // title: 'Kategori',
	                label: {
	                    rotate: {
	                        degrees: 20
	                    }
	                }
	            }],
	            series: [{
	                type: 'column',
	                axis: 'left',
	                // gutter: 80,
	                xField: 'building_category',
	                yField: ['total'],
	                tips: {
	                    trackMouse: true,
	                    width: 180,
	                    height: 50,
	                    renderer: function(storeItem, item) {
	                        this.setTitle(storeItem.get('building_category'));
	                        this.update(storeItem.get('total'));
	                    }
	                },
                    label: {
                        display: 'outside',
                        field: ['total'],
                        renderer: function(value, metaData, record, rowIdx, colIdx, store, view){
                            return value ;
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
	
	
	
});