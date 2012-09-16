Ext.onReady(function(){

	var ItemsCode = new Ext.form.TextField({
	    id: 'ItemsCode',
	    fieldLabel: 'Code',
	    maxLength: 20,
	    allowBlank: false,
	    anchor : '95%',
	    maskRe: /([a-zA-Z0-9\s]+)$/
	});
	var ItemsName = new Ext.form.TextField({
	    id: 'ItemsName',
	    fieldLabel: 'Product Name',
	    maxLength: 100,
	    allowBlank: false,
	    anchor : '95%',
	    maskRe: /([a-zA-Z0-9\s]+)$/
	});
	var ItemsSatuan = new Ext.form.TextField({
	    id: 'ItemsSatuan',
	    fieldLabel: 'Satuan',
	    maxLength: 100,
	    allowBlank: false,
	    anchor : '95%',
	    maskRe: /([a-zA-Z0-9\s]+)$/
	});
	var ItemsPrice = new Ext.form.TextField({
	    id: 'ItemsPrice',
	    fieldLabel: 'Price',
	    maxLength: 255,
	    allowBlank: false,
	    anchor : '95%'
	});
	var ItemsCurrency = new Ext.form.ComboBox({
		id:'ItemsCurrency',
		fieldLabel: 'Currency',
		typeAhead: true,
		triggerAction: 'all',
		transform: 'currencies_code',
		editable: true,
		allowBlank: false,
		lazyRender: true,
		listClass: 'x-combo-list-small',
		anchor:'95%'
	});

	var ItemsSatuanHarga = new Ext.form.TextField({
	    id: 'ItemsSatuanHarga',
	    fieldLabel: 'Packing',
	    maxLength: 100,
	    allowBlank: false,
	    anchor : '95%'
	});

	MyCreateForm = new Ext.FormPanel({
		labelAlign: 'top',
		bodyStyle:'padding:5px',
		width: 500,
		items: [{
			layout:'column',
			border:false,
			items:[{
				columnWidth:0.6,
				layout: 'form',
				border:false,
				items:[ItemsCode,ItemsName,ItemsSatuan]
			}, {
				columnWidth:0.4,
				layout: 'form',
				border:false,
				items:[ItemsPrice,ItemsCurrency,ItemsSatuanHarga]
			}]
		}],
		buttons: [{
			text: 'Save and Close',
			handler: createItems
		},{
			text: 'Cancel',
			handler: function(){
				MyCreateWindow.hide();
			}
		}]
	});

	MyCreateWindow = new Ext.Window({
		id: 'MyCreateWindow',
		title: 'New Komponen',
		closable:false,
		width: 500,
		height: 244,
		plain:true,
		layout: 'fit',
		iconCls: 'mygrid',
		items: MyCreateForm
	});

	function displayFormWindow(){
		if(!MyCreateWindow.isVisible()){
			resetForm();
			MyCreateWindow.show();
		} else {
			MyCreateWindow.toFront();
		}
	}

	function resetForm(){
		ItemsCode.setValue('');
		ItemsName.setValue('');
		ItemsSatuan.setValue('');
		ItemsPrice.setValue('');
		ItemsSatuan.setValue('');
		ItemsCurrency.setValue('');
		ItemsSatuanHarga.setValue('');
	}

    function delCheck(){
        var m = grid.selModel.getSelections();
        if(m.length > 0)
        {
        	Ext.MessageBox.confirm('Message', 'Do you really want to delete it?' , doDel);
        }
        else
        {
        	Ext.MessageBox.alert('Message', 'Please select at least one item to delete');
        }
    }

    function doDel(btn)
	{
		if(btn == 'yes')
		{
			var selections = grid.selModel.getSelections();
			var prez = [];
			for(i = 0; i< grid.selModel.getCount(); i++){
				prez.push(selections[i].json.gic_komponen_id);
			}

			var encoded_array = Ext.encode(prez);
			Ext.Ajax.request({
				waitMsg: 'Please Wait',
				url: '/interface/komponen_refference/action',
				params: {
					task: "DELETE",
					row:  encoded_array
				},
				success: function(response){
					var result=eval(response.responseText);
					switch(result){
						case 1:
							store.reload();
						break;
						default:
							Ext.MessageBox.alert('Warning','Could not delete the entire selection.');
						break;
					}
				},
				failure: function(response){
					var result=response.responseText;
					Ext.MessageBox.alert('error','Could not connect to the database. Retry later');
				}
			});
		}
	}

	function createItems(){
		if(isFormValid()){
			Ext.Ajax.request({
				waitMsg: 'Please wait...',
				url: '/interface/komponen_refference/action',
				params: {
					task: "INSERT",
					gic_kode:			ItemsCode.getValue(),
					gic_nm_komponen:	ItemsName.getValue(),
					gic_satuan:			ItemsSatuan.getValue(),
					gic_harga:			ItemsPrice.getValue(),
					gic_currency:		ItemsCurrency.getValue(),
					gic_satuan_harga_x:	ItemsSatuanHarga.getValue(),
				},
				success: function(response){
					var result=eval(response.responseText);
					switch(result){
						case 1:
							Ext.MessageBox.alert('Success','The new komponen was created successfully.');
							store.reload();
							MyCreateWindow.hide();
						break;
						default:
							Ext.MessageBox.alert('Warning','Could not create the komponen.');
						break;
					}
				},
				failure: function(response){
					var result=response.responseText;
					Ext.MessageBox.alert('error','Could not connect to the database. Retry later');
				}
			});
		} else {
			Ext.MessageBox.alert('Warning', 'Your Form is not valid!');
		}
	}

	function isFormValid(){
		return(ItemsCode.isValid() && ItemsName.isValid() && ItemsSatuan.isValid() && ItemsPrice.isValid() && ItemsCurrency.isValid() && ItemsSatuanHarga.isValid());
	}

	function updateKomponen(oGrid_event){
		Ext.Ajax.request({
			waitMsg: 'Please wait...',
			url: '/interface/komponen_refference/action',
			params: {
				task: "UPDATE",
				gic_komponen_id:	oGrid_event.record.data.gic_komponen_id,
				gic_kode:			oGrid_event.record.data.gic_kode,
				gic_nm_komponen:	oGrid_event.record.data.gic_nm_komponen,
				gic_satuan:			oGrid_event.record.data.gic_satuan,
				gic_harga:		    oGrid_event.record.data.gic_harga,
				gic_currency:		oGrid_event.record.data.gic_currency,
				gic_satuan_harga_x:	oGrid_event.record.data.gic_satuan_harga_x
			},
			success: function(response){
				var result=eval(response.responseText);
				switch(result){
					case 1:
					//store.reload();
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

	function formatDate(value){
        return value ? value.dateFormat('M d, Y') : '';
    }
    var fm = Ext.form;
    var cm = new Ext.grid.ColumnModel({
        defaults: {
            sortable: true
        },
        columns: [
        	{
        		header: 'ID',
        		dataIndex: 'gic_komponen_id',
        		hidden: true
        	},{
        		header: 'Code',
        		dataIndex: 'gic_kode',
        		width: 60,
        		editor: new fm.TextField({ readOnly: true, allowBlank: false })
        	},{
                header: 'Name',
                dataIndex: 'gic_nm_komponen',
                width: 300,
                editor: new fm.TextField({ allowBlank: false })
            },{
                header: 'Satuan',
                dataIndex: 'gic_satuan',
                width: 60,
                editor: new fm.TextField({ allowBlank: false })
            },{
                header: 'Price',
                dataIndex: 'gic_harga',
                width: 70,
                align: 'right',
                editor: new fm.TextField({ allowBlank: false })
            },{
                header: 'Currency',
                dataIndex: 'gic_currency',
                width: 70,
                editor: new fm.ComboBox({
                    typeAhead: true,
                    triggerAction: 'all',
                    transform: 'currencies_code2',
                    editable: false,
                    allowBlank: false,
                    lazyRender: true,
                    listClass: 'x-combo-list-small'
                })
            },{
                header: 'Packing',
                dataIndex: 'gic_satuan_harga_x',
                width: 70,
                editor: new fm.TextField({ allowBlank: false })
            }
        ]
    });

	var store = new Ext.data.Store({
		id: 'DataStore',
		proxy: new Ext.data.HttpProxy({
			url: '/interface/komponen_refference/json_listing',
			method: 'POST'
		}),
		baseParams:{task: "LISTING"},
		reader: new Ext.data.JsonReader({
			root: 'data',
			totalProperty: 'total',
			id: 'gic_items_id'
		},[
			{name: 'gic_komponen_id', type: 'int'},
			{name: 'gic_kode', type: 'string'},
			{name: 'gic_nm_komponen', type: 'string'},
			{name: 'gic_satuan', type: 'string'},
			{name: 'gic_harga', type: 'string'},
			{name: 'gic_currency', type: 'string'},
			{name: 'gic_satuan_harga_x', type: 'string'}
		])
    });

    var grid = new Ext.grid.EditorGridPanel({
        store: store,
        cm: cm,
        renderTo: 'items-grid',
        height: 490,
        title: 'Komponen Refference',
        iconCls: 'mygrid',
        frame: true,
        clicksToEdit: 1,
        selModel: new Ext.grid.RowSelectionModel({singleSelect:false}),
        tbar: [{
            text: 'Add Items',
            iconCls: 'add',
            handler: displayFormWindow
        },{
            text: 'Remove selected Items',
            iconCls: 'drop',
            handler: delCheck
        },{
        	text: 'Print this page',
        	iconCls: 'print',
        	handler: function()
        	{
        		Ext.ux.GridPrinter.print(grid);
        	}
        }]
    });

	store.load();
	grid.on('afteredit', updateKomponen);
});