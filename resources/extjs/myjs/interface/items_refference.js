var store;
var grid;

Ext.onReady(function(){

	var ItemsCode = new Ext.form.TextField({
	    id: 'ItemsCode',
	    fieldLabel: 'Code',
	    maxLength: 20,
	    allowBlank: false,
	    anchor : '95%',
	    maskRe: /([a-zA-Z0-9\s]+)$/
	});
	var ItemsClass = new Ext.form.ComboBox({
		id:'ItemsClass',
		fieldLabel: 'Classification',
		store:new Ext.data.SimpleStore({
		fields:['ItemsClassValue', 'ItemsClassValue'],
			data: [['PS','PS'],['SX','SX']]
		}),
		mode: 'local',
		displayField: 'ItemsClassValue',
		allowBlank: false,
		valueField: 'ItemsClassValue',
		anchor:'95%',
		triggerAction: 'all'
	});
	var ItemsName = new Ext.form.TextField({
	    id: 'ItemsName',
	    fieldLabel: 'Product Name',
	    maxLength: 100,
	    allowBlank: false,
	    anchor : '95%',
	    maskRe: /([a-zA-Z0-9\s]+)$/
	});
	var ItemsType = new Ext.form.TextField({
	    id: 'ItemsType',
	    fieldLabel: 'Type',
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
	var ItemsSatuan = new Ext.form.TextField({
	    id: 'ItemsSatuan',
	    fieldLabel: 'Unit',
	    maxLength: 255,
	    allowBlank: false,
	    anchor : '95%',
	    maskRe: /([a-zA-Z0-9\s]+)$/
	});
	var ItemsCurrency = new Ext.form.TextField({
	    id: 'ItemsCurrency',
	    fieldLabel: 'Currency',
	    maxLength: 100,
	    allowBlank: false,
	    anchor : '95%',
	    maskRe: /([a-zA-Z0-9\s]+)$/
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
				items:[ItemsCode,ItemsClass,ItemsName,ItemsType,ItemsPrice]
			}, {
				columnWidth:0.4,
				layout: 'form',
				border:false,
				items:[ItemsSatuan,ItemsCurrency]
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
		title: 'New Items',
		closable:false,
		width: 500,
		height: 524,
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
		ItemsClass.setValue('');
		ItemsName.setValue('');
		ItemsType.setValue('');
		ItemsPrice.setValue('');
		ItemsSatuan.setValue('');
		ItemsCurrency.setValue('');
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
				prez.push(selections[i].json.gic_items_id);
			}

			var encoded_array = Ext.encode(prez);
			Ext.Ajax.request({
				waitMsg: 'Please Wait',
				url: '/interface/items_refference/useraction',
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
				url: '/interface/items_refference/useraction',
				params: {
				task: "INSERT",
				gic_kode:			ItemsCode.getValue(),
				gic_cls:			ItemsClass.getValue(),
				gic_nm_items:		ItemsName.getValue(),
				gic_type_no:		ItemsType.getValue(),
				gic_satuan:			ItemsSatuan.getValue(),
				gic_harga:			ItemsPrice.getValue(),
				gic_currency:		ItemsCurrency.getValue(),
			},
			success: function(response){
				var result=eval(response.responseText);
				switch(result){
					case 1:
						Ext.MessageBox.alert('Success','The new items was created successfully.');
						store.reload();
						MyCreateWindow.hide();
					break;
					default:
						Ext.MessageBox.alert('Warning','Could not create the items.');
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
		return(ItemsCode.isValid() && ItemsClass.isValid() && ItemsName.isValid() && ItemsType.isValid() && ItemsPrice.isValid() && ItemsSatuan.isValid() && ItemsCurrency.isValid());
	}

	function updateItem(oGrid_event){
		Ext.Ajax.request({
			waitMsg: 'Please wait...',
			url: '/interface/items_refference/useraction',
			params: {
				task: "UPDATE",
				gic_items_id:		oGrid_event.record.data.gic_items_id,
				gic_kode:			oGrid_event.record.data.gic_kode,
				gic_cls:			oGrid_event.record.data.gic_cls,
				gic_nm_items:		oGrid_event.record.data.gic_nm_items,
				gic_type_no:		oGrid_event.record.data.gic_type_no,
				gic_satuan:			oGrid_event.record.data.gic_satuan,
				gic_harga:		    oGrid_event.record.data.gic_harga,
				gic_currency:		oGrid_event.record.data.gic_currency
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
        		header: 'Code',
        		dataIndex: 'gic_items_id',
        		hidden: true
        	},{
        		header: 'Code',
        		dataIndex: 'gic_kode',
        		width: 100,
        		editor: new fm.TextField({ allowBlank: false })
        	},{
                header: 'Classification',
                dataIndex: 'gic_cls',
                width: 144,
        		editor: new fm.ComboBox({
                    typeAhead: true,
                    triggerAction: 'all',
                    transform: 'ItemsClass',
                    editable: false,
                    allowBlank: false,
                    lazyRender: true,
                    listClass: 'x-combo-list-small'
                })
			},{
                header: 'Product Name',
                dataIndex: 'gic_nm_items',
                width: 130,
                editor: new fm.TextField({ allowBlank: false })
            },{
                header: 'Type',
                dataIndex: 'gic_type_no',
                width: 120,
                editor: new fm.TextField({ allowBlank: false })
            },{
                header: 'Unit',
                dataIndex: 'gic_satuan',
                width: 120,
                editor: new fm.TextField({ allowBlank: false })
            },{
                header: 'Price',
                dataIndex: 'gic_harga',
                width: 144,
                editor: new fm.TextField({ allowBlank: false })
            },{
                header: 'Currency',
                dataIndex: 'gic_currency',
                width: 144,
                editor: new fm.TextField({ allowBlank: false })
            }
        ]
    });

	store = new Ext.data.Store({
		id: 'UsersDataStore',
		proxy: new Ext.data.HttpProxy({
			url: '/interface/items_refference/json_listing_items',
			method: 'POST'
		}),
		baseParams:{task: "LISTING"},
		reader: new Ext.data.JsonReader({
			root: 'data',
			totalProperty: 'total',
			id: 'gic_items_id'
		},[
			{name: 'gic_items_id', type: 'int'},
			{name: 'gic_kode', type: 'string'},
			{name: 'gic_cls', type: 'string'},
			{name: 'gic_nm_items', type: 'string'},
			{name: 'gic_type_no', type: 'string'},
			{name: 'gic_satuan', type: 'string'},
			{name: 'gic_harga', type: 'string'},
			{name: 'gic_currency', type: 'string'}
		]),
		sortInfo:{field: 'gic_kode', direction: "ASC"}
    });

    var grid = new Ext.grid.EditorGridPanel({
        store: store,
        cm: cm,
        renderTo: 'items-grid',
        height: 490,
        title: 'Items Refference',
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
	grid.on('afteredit', updateItem);
});