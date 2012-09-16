Ext.Loader.setConfig({enabled: true});
Ext.Loader.setPath('Ext.ux', base_url+'/js/ext-4.1/ux');
Ext.require([
    'Ext.grid.*',
    'Ext.data.*',
    'Ext.panel.*',
  	'Ext.ux.grid.FiltersFeature',
  	'Ext.form.Panel',
    'Ext.tab.*',
    'Ext.window.*',
    'Ext.tip.*',
    'Ext.layout.container.Border'
]);
var crud_action='update';
Ext.onReady(function(){
    Ext.define('CategoryModel', {
        extend: 'Ext.data.Model',
        fields: ['cat_id', 'cat_code', 'sub_cat', 'cat_description']
    });
    var store = Ext.create('Ext.data.JsonStore', {
        model: 'CategoryModel',
        proxy: {
            type: 'ajax',
            url: base_url+'/index.php/interface/category/json_listing_category',
            reader: {
                type: 'json',
                root: 'data'
            }
        }
    });
    store.load();

	
	
	// var filters = {
	//        	ftype: 'filters',
	// 	       autoReload: false, //don't reload automatically
	// 	        local: true, //only filter locally
	//        // filters may be configured through the plugin,
	// 	       // or in the column definition within the headers configuration
	//         filters: [{
	// 	           type: 'list',
	// 			    dataIndex: 'building_city',
	// 		        options: ['Jakarta Pusat', 'Jakarta Utara', 'Jakarta Selatan', 'Jakarta Barat', 'Jakarta Timur'],
	// 		        phpMode: true
	//            },		{
	// 			           type: 'list',
	// 					    dataIndex: 'building_category',
	// 				        options: ['Angkutan Umum', 'Sarana Bermain Anak', 'Sarana Kesehatan', 'Tempat Belajar', 'Tempat Kerja', 'Tempat Umum'],
	// 				        phpMode: true
	// 		           }]
	//         
	//     };
	var win;
	var LocationForm;
	  LocationForm = Ext.create('Ext.form.Panel', {
	      frame: false,
	      width: 360,
	      bodyPadding: 5,
	    
	      fieldDefaults: {
	         labelAlign: 'left',
	         labelWidth: 90,
	         anchor: '100%'
		},
	      items: [{
	         xtype: 'hiddenfield', //1
	         name: 'hiddenfield1',
	         value: 'Hidden field value'
	      },{
	         xtype: 'textfield', //3
	         name: 'cat_code',
	         fieldLabel: 'Nama Kategori',
	         value: '',
			 allowBlank: false //1
		 },{
         xtype: 'textfield', //3
         name: 'sub_cat',
         fieldLabel: 'Nama Sub Kategori',
         value: '',
		 allowBlank: false //1
	      },{
		         xtype: 'textfield', //3
		         name: 'cat_description',
		         fieldLabel: 'Tipe Kategori',
		         value: '',
				 allowBlank: false //1
		      }],
				buttons: [{
				      text: 'Save',
				      handler: function() {
					   var form = this.up('form').getForm();
					
				       form.submit({
						          	url: base_url+'/index.php/interface/category/insert?v=insert',
						            waitMsg: 'Sending the info...',
						            success: function(fp, o) {
						               Ext.Msg.alert('Success', 'Form submitted.');
									   
						            }
						});
						
			 				win.hide(this, function() {
								store.sync();
								store.load();
						            });
					  } 
					},
					{
				      text: 'Close',
				      handler: function() {
				         win.hide();
						} 
				
				  }]		
			
			});
	
	 win = Ext.create('widget.window', {
			 title: 'Data Kategori',
           	 closable: true,
                closeAction: 'hide',
                width: 400,
                minWidth: 370,
                height: 160,
                layout: {
                    type: 'border',
                    padding: 5
                },
             items: [LocationForm]
	});
	
	function displayFormWindow(){
		if(!win.isVisible()){
			 
			win.show();
		//	storeName.load();
		} else {
			win.hide(this, function() {
		             
		            });
			win.toFront();
		}
	}

	var RowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
		 id: 'RowEditing',
         clicksToMoveEditor: 1,
		 autoCancel: false,
		 errorSummary : false
       });

	var grid = Ext.create('Ext.grid.Panel', {
	store: store,
	width: '100%',
	title: 'Daftar Kategori Lokasi',
	renderTo: 'location-grid',
	loadMask: true,
    // features: [filters],
	 selType: 'rowmodel',
	 dockedItems: [{
            xtype: 'toolbar',
            items: [
          	{
               icon: '/images/add.png', 
               text: 'Add',
               scope: this,
			   //handler :displayFormWindow
               handler : function(){
					RowEditing.cancelEdit();
					crud_action='insert';
	                store.insert(0, new CategoryModel());
	                RowEditing.startEdit(0, 0);



			   }
			},
			{
			   itemId: 'remove',
               icon: '/images/delete.png', 
               text: 'Delete',
               scope: this,
			   handler : function(){
					var sm = grid.getSelectionModel();
	                RowEditing.cancelEdit();
					var cat_id = sm.lastFocused.data.cat_id;
					var cat_code = sm.lastFocused.data.cat_code;
				
				//	console.log(inst_id);
	                //store.remove(sm.getSelection());
						Ext.MessageBox.confirm('Message', 'Apakah anda mau menghapus kategori ini ?' , function(btn){
								if(btn == 'yes')
								{
								//	var selections = rec.get('inst_id');

								//	var encoded_array = Ext.encode(selections);
									//alert(selections);
									Ext.Ajax.request({
										waitMsg: 'Please Wait',
										url: base_url+'/index.php/interface/category/delete',
										params: {
											task: "DELETE",
											row:  cat_id
										},
										success: function(response){
											var result=eval(response.responseText);
										//	alert(result);
											switch(result){
												case 1:
													//store.sync();
													store.load();
												break;
												default:
													Ext.MessageBox.alert('Warning','Could not delete.');
												break;
											}
										},
										failure: function(response){
											var result=response.responseText;
											Ext.MessageBox.alert('error','Could not connect to the database. Retry later');
										}
									});
								}
						});

	                if (store.getCount() > 0) {
	                    sm.select(0);
	                }
			   }
            },{
                    icon: '/images/printer.png',
                    text: 'Print',
                    scope: this,
                    handler : function(){
                        location.href = base_url+'/index.php/interface/report/rpt_category';
                        //	Ext.ux.grid.Printer.printAutomatically = false;
                        //	Ext.ux.grid.Printer.stylesheetPath = '/js/ext-4.1/ux/gridPrinterCss/print.css';
//	            	Ext.ux.grid.Printer.print(grid);
                    }
                }]
	}],
	// selModel: Ext.create('Ext.selection.CheckboxModel'), //1 
	columns: [
	           // Ext.create('Ext.grid.RowNumberer'), //2
	{
	    text: 'Kode',//3
		width: 50,
	    dataIndex: 'cat_id'
	},
	{
		text: 'Nama Kategori', //4
		          // xtype:'templatecolumn',
		width: 250,
		dataIndex: 'cat_code',
		editor: {
		         xtype:'textfield',
		         allowBlank:false
		      } //tpl: '{topic} {version}'
		},
		{
		text: 'Nama Sub Kategori', //4
		          // xtype:'templatecolumn',
		width: 250,
		dataIndex: 'sub_cat',
		editor: {
		         xtype:'textfield',
		         allowBlank:false
		      } //tpl: '{topic} {version}'
		}
		//,
		// {
		// 		text: 'Tipe KDM', //4
		// 		          // xtype:'templatecolumn',
		// 		width: 250,
		// 		dataIndex: 'cat_description',
		// 		editor: new Ext.form.field.ComboBox({
		//                 typeAhead: true,
		//                 triggerAction: 'all',
		//                 selectOnTab: true,
		//                 store: [
		//                     ['KDM Terbatas','KDM Terbatas'],
		//                     ['KDM Total','KDM Total']
		//                    
		//                 ],
		//                 lazyRender: true,
		//                 listClass: 'x-combo-list-small'
		//             })
		// 		}
		// ,{
		//             xtype:'actioncolumn', 
		//             width:50,
		//             items: [
		// 			{
		// 					                icon: '/images/edit.png', 
		// 					                tooltip: 'Edit',
		// 					      handler: function(grid, rowIndex, colIndex) {
		// 					            var rec = grid.getStore().getAt(rowIndex);
		// 								Ext.MessageBox.confirm('Message', 'Update data kategori ini ?' , function(btn){
		// 					      	        
		// 							var cat_id = rec.get('cat_id');
		// 							var cat_code = rec.get('cat_code');
		// 						
		// 							if(btn == 'yes')
		// 							{
		// 									Ext.Ajax.request({
		// 										waitMsg: 'Please wait...',
		// 										url: '/index.php/interface/category/useraction',
		// 										params: {
		// 										task: "UPDATE",
		// 										cat_id:	cat_id,
		// 										cat_code:	cat_code
		// 									
		// 									
		// 									},
		// 									success: function(response){
		// 										var result=eval(response.responseText);
		// 											switch(result){
		// 												case 1:
		// 												store.load();
		// 												break;
		// 												default:
		// 												Ext.MessageBox.alert('Warning...','We couldn\'t change this data...');
		// 												break;
		// 											}
		// 									},
		// 									failure: function(response){
		// 										var result=response.responseText;
		// 										Ext.MessageBox.alert('error','Could not connect to the database. Retry later');
		// 										}
		// 									});
		// 							}
		// 									
		// 						
		// 						
		// 					});
		// 									//	 Ext.MessageBox.confirm('Message', 'Do you really want to delete it?' , doDel);
		// 										
		// 					                }
		// 					            },
		// 			{
		//                 icon: '/images/delete.gif',
		//                 tooltip: 'Delete',
		//                 handler: function(grid, rowIndex, colIndex) {
		//                      var rec = grid.getStore().getAt(rowIndex);
		//                     // Ext.MessageBox.alert('Delete',rec.get('building_name'));
		// 					Ext.MessageBox.confirm('Message', 'Apakah anda mau menghapus kategori ini ?' , function(btn){
		// 							if(btn == 'yes')
		// 							{
		// 								var selections = rec.get('cat_id');
		// 								// var prez = [];
		// 								// 							for(i = 0; i< grid.selModel.getCount(); i++){
		// 								// 								prez.push(selections[i].json.building_id);
		// 								// 							}
		// 
		// 								var encoded_array = Ext.encode(selections);
		// 								//alert(selections);
		// 								Ext.Ajax.request({
		// 									waitMsg: 'Please Wait',
		// 									url: '/index.php/interface/category/delete',
		// 									params: {
		// 										task: "DELETE",
		// 										row:  selections
		// 									},
		// 									success: function(response){
		// 										var result=eval(response.responseText);
		// 									//	alert(result);
		// 										switch(result){
		// 											case 1:
		// 												//store.sync();
		// 												store.load();
		// 											break;
		// 											default:
		// 												Ext.MessageBox.alert('Warning','Could not delete.');
		// 											break;
		// 										}
		// 									},
		// 									failure: function(response){
		// 										var result=response.responseText;
		// 										Ext.MessageBox.alert('error','Could not connect to the database. Retry later');
		// 									}
		// 								});
		// 							}
		// 					});
		//                 }                
		//             }]
		//         }
		],
		 plugins: [RowEditing],
		listeners: {
	            'selectionchange': function(view, records) {
	                grid.down('#remove').setDisabled(!records.length);
					console.log('update');
	            },
				'canceledit':function(editor,e,eOpts){
					store.load();
				},
				'edit': function(editor, e) {
				    // commit the changes right after editing finished
				    //e.record.commit();
					//console.log(e.record);
				    // var inst_id = e.record.data.inst_id;
				    // 					console.log(inst_id);
				    // 					var sm = grid.getSelectionModel();
				    // 					console.log(sm);
						var cat_id = e.record.data.cat_id;
						var cat_code = e.record.data.cat_code;
						var sub_cat_code = e.record.data.sub_cat;
						var cat_description = e.record.data.cat_description;
						
						

				if(crud_action=='insert'){
					/// start insert

					console.log('insert');
						Ext.Ajax.request({
							waitMsg: 'Please wait...',
				          	url: base_url+'/index.php/interface/category/insert?v=insert',
							params: {
							task: "INSERT",
							cat_id:			cat_id,
							cat_code:		cat_code,
							sub_cat:		sub_cat_code,
							cat_description:		cat_description
							
						

						},
						success: function(response){
							var result=eval(response.responseText);
							switch(result){
								case 1:
									Ext.MessageBox.alert('Success','The new category was created successfully.');
									store.load();
                                    crud_action='update';
								break;
								default:
									Ext.MessageBox.alert('Warning','Could not create the customer.');
								break;
							}
						},
						failure: function(response){
							var result=response.responseText;
							Ext.MessageBox.alert('error','Could not connect to the database. Retry later');
							}
						});

					//// end insert		

				} else {
					/// start update	
					Ext.MessageBox.confirm('Message', 'Update this data ?' , function(btn){



						if(btn == 'yes')
						{
								Ext.Ajax.request({
									waitMsg: 'Please wait...',
									url: base_url+'/index.php/interface/category/useraction',
									params: {
									task: "UPDATE",
									cat_id:			cat_id,
									cat_code:		cat_code,
                                    sub_cat:		sub_cat_code,
									cat_description:		cat_description
									
								


								},
								success: function(response){
									var result=eval(response.responseText);
										switch(result){
											case 1:
											store.load();
											break;
											default:
											Ext.MessageBox.alert('Warning...','We couldn\'t change this data...');
											break;
										}
								},
								failure: function(response){
									var result=response.responseText;
									Ext.MessageBox.alert('error','Could not connect to the database. Retry later');
									}
								});
						}

				});
				/// end update	
				}



				}
	        }
		});

});
