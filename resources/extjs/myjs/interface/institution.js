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
var crud_action;
Ext.onReady(function(){
    Ext.define('InstModel', {
        extend: 'Ext.data.Model',
        fields: ['inst_id', 'inst_code', 'inst_address','inst_phone','inst_head','inst_head_id']
    });
    var store = Ext.create('Ext.data.JsonStore', {
        model: 'InstModel',
        proxy: {
            type: 'ajax',
            url: base_url+'/index.php/interface/institution/json_listing_institution',
            reader: {
                type: 'json',
                root: 'data'
            }
        }
    });
    store.load();

	
	
	// var filters = {
	//        	ftype: 'filters',
	// 		       autoReload: false, //don't reload automatically
	// 		        local: true, //only filter locally
	// 	       // filters may be configured through the plugin,
	// 		       // or in the column definition within the headers configuration
	// 	        filters: [{
	// 		           type: 'list',
	// 				    dataIndex: 'building_city',
	// 			        options: ['Jakarta Pusat', 'Jakarta Utara', 'Jakarta Selatan', 'Jakarta Barat', 'Jakarta Timur'],
	// 			        phpMode: true
	// 	           },		{
	// 				           type: 'list',
	// 						    dataIndex: 'building_category',
	// 					        options: ['Angkutan Umum', 'Sarana Bermain Anak', 'Sarana Kesehatan', 'Tempat Belajar', 'Tempat Kerja', 'Tempat Umum'],
	// 					        phpMode: true
	// 			           }]
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
	         name: 'inst_code',
	         fieldLabel: 'Nama Instansi',
	         value: '',
			 allowBlank: false //1
	      },{
	         xtype: 'textareafield', //5
	         name: 'inst_address',
	         fieldLabel: 'Alamat',
	         value: '',
			 allowBlank: false //1
	      },{
	         xtype: 'textfield', //4
	         name: 'inst_phone',
	         fieldLabel: 'No. Telepon',
	         value: '',
			 allowBlank: false //1
	      },{
	         xtype: 'textfield', //4
	         name: 'inst_head',
	         fieldLabel: 'Kepala Instansi',
	         value: '',
			 allowBlank: false //1
	      },{
		         xtype: 'textfield', //4
		         name: 'inst_head_id',
		         fieldLabel: 'NIP',
		         value: '',
				 allowBlank: false //1
		      }],
				buttons: [{
				      text: 'Save',
				      handler: function() {
					   var form = this.up('form').getForm();
					
				       form.submit({
						          	url: base_url+'/index.php/interface/institution/insert?v=insert',
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
			 title: 'Data Institusi',
           	 closable: true,
                closeAction: 'hide',
                width: 400,
                minWidth: 370,
                height: 360,
                layout: {
                    type: 'border',
                    padding: 5
                },
             items: [LocationForm]
	});
	
	function displayFormWindow(){
		if(!win.isVisible()){
			 
			win.show();
			// storeName.load();
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
	title: 'Daftar Institusi',
	renderTo: 'location-grid',
	loadMask: true,
    // features: [filters],
	//selType: 'cellmodel',
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
	               // store.insert(0, new InstModel());
				    var r = Ext.create('InstModel', {
					
				                    inst_id: '',
				                    inst_code: '',
				                    inst_address:'' ,
				                    inst_phone: '-',
				                    inst_head: '-',
				                    inst_head_id: ''
				
				                });

				                store.insert(0, r);
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
					var inst_id = sm.lastFocused.data.inst_id;
					var inst_code = sm.lastFocused.data.inst_code;
					var inst_address = sm.lastFocused.data.inst_address;
					var inst_phone = sm.lastFocused.data.inst_phone;
					var inst_head = sm.lastFocused.data.inst_head;
					var inst_head_id = sm.lastFocused.data.inst_head_id;
					
					console.log(inst_id);
	                //store.remove(sm.getSelection());
						Ext.MessageBox.confirm('Message', 'Apakah anda mau menghapus instansi ini ?' , function(btn){
								if(btn == 'yes')
								{
								//	var selections = rec.get('inst_id');
								
								//	var encoded_array = Ext.encode(selections);
									//alert(selections);
									Ext.Ajax.request({
										waitMsg: 'Please Wait',
										url: base_url+'/index.php/interface/institution/delete',
										params: {
											task: "DELETE",
											row:  inst_id
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
                        location.href = base_url+'/index.php/interface/report/rpt_institution';
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
	    dataIndex: 'inst_id'
	},
	{
		text: 'Nama Instansi', //4
		          // xtype:'templatecolumn',
		width: 250,
		dataIndex: 'inst_code',
		editor: {
		         xtype:'textfield',
		         allowBlank:false
		      } //tpl: '{topic} {version}'
		},{
		text: 'Alamat', //5 xtype: 'booleancolumn',
		width: 270,
		dataIndex: 'inst_address',
		editor: {
		         xtype:'textfield',
		         allowBlank:false
		      }
		},
		{
		text: 'No. Telepon', //5 xtype: 'booleancolumn',
		width: 100,
		dataIndex: 'inst_phone',
		editor: {
		         xtype:'textfield',
		         allowBlank:false
		      }
		},
		{
		text: 'Kepala Instansi', //5 xtype: 'booleancolumn',
		width: 130,
		dataIndex: 'inst_head',
		editor: {
		         xtype:'textfield',
		         allowBlank:false
		      }
        },{
			text: 'NIP', //5 xtype: 'booleancolumn',
			width: 110,
			dataIndex: 'inst_head_id',
			editor: {
			         xtype:'textfield',
			         allowBlank:false
			      }
	     }],
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
						var inst_id = e.record.data.inst_id;
						var inst_code = e.record.data.inst_code;
						var inst_address = e.record.data.inst_address;
						var inst_phone = e.record.data.inst_phone;
						var inst_head = e.record.data.inst_head;
						var inst_head_id = e.record.data.inst_head_id;
						
				
				if(crud_action=='insert'){
					/// start insert
					
					console.log('insert');
						Ext.Ajax.request({
							waitMsg: 'Please wait...',
				          	url: base_url+'/index.php/interface/institution/insert?v=insert',
							params: {
							task: "INSERT",
							inst_id:			inst_id,
							inst_code:			inst_code,
							inst_address:		inst_address,
							inst_phone:			inst_phone,
							inst_head:			inst_head,
							inst_head_id:		inst_head_id 
						
						},
						success: function(response){
							var result=eval(response.responseText);
							switch(result){
								case 1:
									Ext.MessageBox.alert('Success','The new institution was created successfully.');
									store.load();
								
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
					Ext.MessageBox.confirm('Message', 'Update data institusi ini ?' , function(btn){
				      	        
					
					
						if(btn == 'yes')
						{
								Ext.Ajax.request({
									waitMsg: 'Please wait...',
									url: base_url+'/index.php/interface/institution/useraction',
									params: {
									task: "UPDATE",
									inst_id:			inst_id,
									inst_code:			inst_code,
									inst_address:		inst_address,
									inst_phone:	inst_phone,
									inst_head:	inst_head,
									inst_head_id:	inst_head_id
									
								
								
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
