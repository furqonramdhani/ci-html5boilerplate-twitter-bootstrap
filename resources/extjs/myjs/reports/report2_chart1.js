Ext.require('Ext.chart.*');
Ext.require('Ext.layout.container.Fit');

Ext.onReady(function () {
    var textArea;

	
	Ext.define('GroupCityModel', {
	        extend: 'Ext.data.Model',
	        fields: ['building_city', 'total']
	    });
	var store1 = Ext.create('Ext.data.JsonStore', {
	        model: 'GroupCityModel',
	        proxy: {
	            type: 'ajax',
	            url: base_url+'/index.php/home/json_listing_group_city',
	            reader: {
	                type: 'json',
	                root: 'data'
	            }
	        }
	    });
		store1.load();
		
	   


	    // var panel2 = Ext.create('widget.panel', {
	    // 	        width: 400,
	    // 	        height: 300,
	    // 	        title: 'Jumlah Lokasi per Kota',
	    // 	        renderTo: 'chart-2',
	    // 	        layout: 'fit',
	    // 	        // tbar: [{
	    // 	        // 	            text: 'Reload Data',
	    // 	        // 	            handler: function() {
	    // 	        // 	                store1.loadData(generateData());
	    // 	        // 	            }
	    // 	        // 	        }],
	    // 	        items: {
	    // 	            xtype: 'chart',
	    // 	            animate: true,
	    // 	            shadow: true,
	    // 	            store: store1,
	    // 	            axes: [{
	    // 	                type: 'Numeric',
	    // 	                position: 'left',
	    // 	                fields: ['total'],
	    // 	                title: 'Jumlah',
	    // 	                grid: true,
	    // 	                minimum: 0,
	    // 	                maximum: 500
	    // 	            }, {
	    // 	                type: 'Category',
	    // 	                position: 'bottom',
	    // 	                fields: ['building_city'],
	    // 	                // title: 'Kategori',
	    // 	                label: {
	    // 	                    rotate: {
	    // 	                        degrees: 45
	    // 	                    }
	    // 	                }
	    // 	            }],
	    // 	            series: [{
	    // 	                type: 'column',
	    // 	                axis: 'left',
	    // 	                // gutter: 80,
	    // 	                xField: 'building_city',
	    // 	                yField: ['total'],
	    // 	                tips: {
	    // 	                    trackMouse: true,
	    // 	                    width: 180,
	    // 	                    height: 50,
	    // 	                    renderer: function(storeItem, item) {
	    // 	                        this.setTitle(storeItem.get('building_city'));
	    // 	                        this.update(storeItem.get('total'));
	    // 	                    }
	    // 	                },
	    // 	                style: {
	    // 	                    fill: '#3877bf'
	    // 	                }
	    // 	            }]
	    // 	        }
	    // 	    });
	
	 var donut = false,
	        panel1 = Ext.create('widget.panel', {
	        width: 400,
	        height: 300,
	        title: 'Jumlah Lokasi per Kota',
	        renderTo: 'chart-2',
	        layout: 'fit',
	        items: {
	            xtype: 'chart',
	            id: 'chartCmp',
	            animate: true,
	            store: store1,
	            shadow: true,
	            legend: {
	                position: 'right'
	            },
	            insetPadding: 20,
	            theme: 'Base:gradients',
	            series: [{
	                type: 'pie',
	                field: 'total',
	                showInLegend: true,
	                donut: donut,
	                tips: {
	                  trackMouse: true,
	                  width: 140,
	                  height: 28,
	                  renderer: function(storeItem, item) {
	                    //calculate percentage.
	                    var totalx = 0;
	                    store1.each(function(rec) {
	                        totalx += rec.get('total');
	                    });
	                    this.setTitle(storeItem.get('building_city') + ': ' + Math.round(storeItem.get('total') ) );
	                  }
	                },
	                highlight: {
	                  segment: {
	                    margin: 20
	                  }
	                },
	                label: {
	                    field: 'building_city',
	                    display: 'rotate',
	                    contrast: true,
	                    font: '10px Arial'
	                }
	            }]
	        }
	    });
	
});