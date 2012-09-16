Ext.require('Ext.chart.*');
Ext.require('Ext.layout.container.Fit');

Ext.onReady(function () {
    var textArea;

	
	Ext.define('GroupPengaduanModel', {
	        extend: 'Ext.data.Model',
	        fields: ['date_pelanggaran', 'total'],
	    });
	var store1 = Ext.create('Ext.data.JsonStore', {
	        model: 'GroupPengaduanModel',
	        proxy: {
	            type: 'ajax',
	            url: base_url+'/index.php/home/json_listing_group_pengaduan',
	            reader: {
	                type: 'json',
	                root: 'data'
	            }
	        }
	    });
		store1.load();
		
	   


	    var panel2 = Ext.create('widget.panel', {
	        width: 400,
	        height: 300,
	        title: 'Jumlah Pengaduan',
	        renderTo: 'chart-3',
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
	                maximum: 20
	            }, {
	                type: 'Category',
	                position: 'bottom',
	                fields: ['date_pelanggaran'],
	                // title: 'Kategori',
	                label: {
	                    rotate: {
	                        degrees: 45
	                    }
	                }
	            }],
	            series: [{
	                type: 'column',
	                axis: 'left',
	                // gutter: 80,
	                xField: 'date_pelanggaran',
	                yField: ['total'],
	                tips: {
	                    trackMouse: true,
	                    width: 180,
	                    height: 50,
	                    renderer: function(storeItem, item) {
	                        this.setTitle(storeItem.get('date_pelanggaran'));
	                        this.update(storeItem.get('total'));
	                    }
	                },
	                style: {
	                    fill: '#da4047'
	                }
	            }]
	        }
	    });
	
	
	
});