var store;
var grid;

var SuppliersCode;
var SuppliersName;
var SuppliersNpwp;
var SuppliersAddress1;
var SuppliersAddress2;
var SuppliersCity;
var SuppliersCountry;
var SuppliersPhone;
var SuppliersFax;
var ActiveStatus;
var NPWPName;
var NPWPAddress1;
var NPWPAddress2;
var NPWPCity;

Ext.onReady(function(){

	SuppliersCode = new Ext.form.TextField({
	    id: 'SuppliersCode',
	    fieldLabel: 'Code',
	    maxLength: 20,
	    allowBlank: false,
	    anchor : '95%'
	});
	SuppliersName = new Ext.form.TextField({
	    id: 'SuppliersName',
	    fieldLabel: 'Name',
	    maxLength: 100,
	    allowBlank: false,
	    anchor : '95%'
	});
	SuppliersNpwp = new Ext.form.TextField({
	    id: 'SuppliersNpwp',
	    fieldLabel: 'Npwp No.pkp',
	    maxLength: 100,
	    allowBlank: false,
	    anchor : '95%'
	});
	SuppliersAddress1 = new Ext.form.TextField({
	    id: 'SuppliersAddress1',
	    fieldLabel: 'Address1',
	    maxLength: 255,
	    allowBlank: false,
	    anchor : '95%'
	});
	SuppliersAddress2 = new Ext.form.TextField({
	    id: 'SuppliersAddress2',
	    fieldLabel: 'Address2',
	    maxLength: 255,
	    allowBlank: false,
	    anchor : '95%'
	});
	SuppliersCity = new Ext.form.TextField({
	    id: 'SuppliersCity',
	    fieldLabel: 'City',
	    maxLength: 100,
	    allowBlank: false,
	    anchor : '95%',
	    maskRe: /([a-zA-Z0-9\s]+)$/
	});
	SuppliersCountry = new Ext.form.TextField({
	    id: 'SuppliersCountry',
	    fieldLabel: 'Country',
	    maxLength: 100,
	    allowBlank: false,
	    anchor : '95%'
	});
	SuppliersPhone = new Ext.form.TextField({
	    id: 'SuppliersPhone',
	    fieldLabel: 'Phone',
	    maxLength: 50,
	    allowBlank: false,
	    anchor : '95%'
	});
	SuppliersFax = new Ext.form.TextField({
	    id: 'SuppliersFax',
	    fieldLabel: 'Fax',
	    maxLength: 50,
	    allowBlank: false,
	    anchor : '95%'
	});
	ActiveStatus = new Ext.form.ComboBox({
		id:'ActiveStatus',
		fieldLabel: 'Active status',
		store:new Ext.data.SimpleStore({
		fields:['ActiveStatusValue', 'ActiveStatusName'],
			data: [['Active','Active'],['Inactive','Inactive']]
		}),
		mode: 'local',
		displayField: 'ActiveStatusName',
		allowBlank: false,
		valueField: 'ActiveStatusValue',
		anchor:'95%',
		triggerAction: 'all'
	});
	NPWPName = new Ext.form.TextField({
	    id: 'NPWPName',
	    fieldLabel: 'NPWP Name',
	    maxLength: 100,
	    allowBlank: false,
	    anchor : '95%'
	});
	NPWPAddress1 = new Ext.form.TextField({
	    id: 'NPWPAddress1',
	    fieldLabel: 'NPWP Address 1',
	    maxLength: 100,
	    allowBlank: false,
	    anchor : '95%'
	});
	NPWPAddress2 = new Ext.form.TextField({
	    id: 'NPWPAddress2',
	    fieldLabel: 'NPWP Address 2',
	    maxLength: 100,
	    allowBlank: false,
	    anchor : '95%'
	});
	NPWPCity = new Ext.form.TextField({
	    id: 'NPWPCity',
	    fieldLabel: 'NPWP City',
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
				items:[SuppliersCode,SuppliersName,SuppliersNpwp,SuppliersAddress1,SuppliersAddress2]
			}, {
				columnWidth:0.4,
				layout: 'form',
				border:false,
				items:[SuppliersCity,SuppliersCountry,SuppliersPhone,SuppliersFax,ActiveStatus]
			}, {
				columnWidth: 1,
				layout: 'form',
				border:false,
				items:[NPWPName,NPWPAddress1,NPWPAddress2,NPWPCity]
			}]
		}],
		buttons: [{
			text: 'Save and Close',
			handler: createSuppliers
		},{
			text: 'Cancel',
			handler: function(){
				MyCreateWindow.hide();
			}
		}]
	});


	MyCreateWindow = new Ext.Window({
		id: 'MyCreateWindow',
		title: 'New Supplier',
		closable:false,
		width: 500,
		height: 524,
		plain:true,
		layout: 'fit',
		iconCls: 'myuser',
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
		SuppliersCode.setValue('');
		SuppliersName.setValue('');
		SuppliersNpwp.setValue('');
		SuppliersAddress1.setValue('');
		SuppliersAddress2.setValue('');
		SuppliersCity.setValue('');
		SuppliersCountry.setValue('');
		SuppliersPhone.setValue('');
		SuppliersFax.setValue('');
		NPWPName.setValue('');
		NPWPAddress1.setValue('');
		NPWPAddress2.setValue('');
		NPWPCity.setValue('');
		ActiveStatus.setValue('');
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
				prez.push(selections[i].json.gic_supl_id);
			}

			var encoded_array = Ext.encode(prez);
			Ext.Ajax.request({
				waitMsg: 'Please Wait',
				url: '/interface/supplier_refference/useraction',
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

	function createSuppliers(){
		if(isFormValid()){
			Ext.Ajax.request({
				waitMsg: 'Please wait...',
				url: '/interface/supplier_refference/useraction',
				params: {
				task: "INSERT",
				gic_supl_code:			SuppliersCode.getValue(),
				gic_supl_name:			SuppliersName.getValue(),
				gic_supl_npwp:			SuppliersNpwp.getValue(),
				gic_supl_address1:		SuppliersAddress1.getValue(),
				gic_supl_address2:		SuppliersAddress2.getValue(),
				gic_supl_city:			SuppliersCity.getValue(),
				gic_supl_country:		SuppliersCountry.getValue(),
				gic_supl_tel1:			SuppliersPhone.getValue(),
				gic_supl_fax:			SuppliersFax.getValue(),
				gic_supl_npwp_name:		NPWPName.getValue(),
				gic_supl_npwp_address1:	NPWPAddress1.getValue(),
				gic_supl_npwp_address2:	NPWPAddress2.getValue(),
				gic_supl_npwp_city:		NPWPCity.getValue(),
				gic_supl_status:		ActiveStatus.getValue()
			},
			success: function(response){
				var result=eval(response.responseText);
				switch(result){
					case 1:
						Ext.MessageBox.alert('Success','The new supplier was created successfully.');
						store.reload();
						MyCreateWindow.hide();
					break;
					default:
						Ext.MessageBox.alert('Warning','Could not create the supplier.');
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
		return(SuppliersCode.isValid() && SuppliersName.isValid());
	}

	function updateSupplier(oGrid_event){
		Ext.Ajax.request({
			waitMsg: 'Please wait...',
			url: '/interface/supplier_refference/useraction',
			params: {
				task: "UPDATE",
				gic_supl_id:			oGrid_event.record.data.gic_supl_id,
				gic_supl_code:			oGrid_event.record.data.gic_supl_code,
				gic_supl_name:			oGrid_event.record.data.gic_supl_name,
				gic_supl_npwp:			oGrid_event.record.data.gic_supl_npwp,
				gic_supl_address1:		oGrid_event.record.data.gic_supl_address1,
				gic_supl_address2:		oGrid_event.record.data.gic_supl_address2,
				gic_supl_city:			oGrid_event.record.data.gic_supl_city,
				gic_supl_country:		oGrid_event.record.data.gic_supl_country,
				gic_supl_tel1:			oGrid_event.record.data.gic_supl_tel1,
				gic_supl_fax:			oGrid_event.record.data.gic_supl_fax,
				gic_supl_npwp_name:		oGrid_event.record.data.gic_supl_npwp_name,
				gic_supl_npwp_address1:	oGrid_event.record.data.gic_supl_npwp_address1,
				gic_supl_npwp_address2:	oGrid_event.record.data.gic_supl_npwp_address2,
				gic_supl_npwp_city:		oGrid_event.record.data.gic_supl_npwp_city,
				gic_supl_status:		oGrid_event.record.data.gic_supl_status
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
        		header: 'Supplier Id',
        		dataIndex: 'gic_supl_id',
        		hidden: true
        	}, {
                header: 'Code',
                dataIndex: 'gic_supl_code',
                width: 144,
        		editor: new fm.TextField({ allowBlank: false })
            }, {
                header: 'Name',
                dataIndex: 'gic_supl_name',
                width: 130,
                editor: new fm.TextField({ allowBlank: false })
            },{
                header: 'NPWP No.PKP',
                dataIndex: 'gic_supl_npwp',
                width: 120,
                editor: new fm.TextField({ allowBlank: false })
            },{
                header: 'Address1',
                dataIndex: 'gic_supl_address1',
                width: 120,
                editor: new fm.TextField({ allowBlank: false })
            }, {
                header: 'Address2',
                dataIndex: 'gic_supl_address2',
                width: 144,
                editor: new fm.TextField({ allowBlank: false })
            }, {
                header: 'City',
                dataIndex: 'gic_supl_city',
                width: 144,
                editor: new fm.TextField({ allowBlank: false })
            }, {
                header: 'Country',
                dataIndex: 'gic_supl_country',
                width: 144,
                editor: new fm.TextField({ allowBlank: false })
            }, {
                header: 'Phone',
                dataIndex: 'gic_supl_tel1',
                width: 44,
                editor: new fm.TextField({ allowBlank: false })
            }, {
                header: 'Fax',
                dataIndex: 'gic_supl_fax',
                width: 44,
                editor: new fm.TextField({ allowBlank: false })
			}, {
                header: 'Status',
                dataIndex: 'gic_supl_status',
                width: 60,
                editor: new fm.ComboBox({
                    typeAhead: true,
                    triggerAction: 'all',
                    transform: 'active_status',
                    editable: false,
                    allowBlank: false,
                    lazyRender: true,
                    listClass: 'x-combo-list-small'
                })
            }
        ]
    });

	store = new Ext.data.Store({
		id: 'UsersDataStore',
		proxy: new Ext.data.HttpProxy({
			url: '/interface/supplier_refference/json_listing_supplier',
			method: 'POST'
		}),
		baseParams:{task: "LISTING"},
		reader: new Ext.data.JsonReader({
			root: 'data',
			totalProperty: 'total',
			id: 'gic_supl_id'
		},[
			{name: 'gic_supl_id', type: 'int'},
			{name: 'gic_supl_code', type: 'string'},
			{name: 'gic_supl_name', type: 'string'},
			{name: 'gic_supl_npwp', type: 'string'},
			{name: 'gic_supl_address1', type: 'string'},
			{name: 'gic_supl_address2', type: 'string'},
			{name: 'gic_supl_city', type: 'string'},
			{name: 'gic_supl_country', type: 'string'},
			{name: 'gic_supl_tel1', type: 'string'},
			{name: 'gic_supl_fax', type: 'string'},
			{name: 'gic_supl_status', type: 'string'}
		]),
		sortInfo:{field: 'gic_supl_code', direction: "ASC"}
    });

    var grid = new Ext.grid.EditorGridPanel({
        store: store,
        cm: cm,
        renderTo: 'supplier-grid',
        height: 490,
        title: 'Supplier Refference',
        iconCls: 'myuser',
        frame: true,
        clicksToEdit: 1,
        selModel: new Ext.grid.RowSelectionModel({singleSelect:false}),
        tbar: [{
            text: 'Add Supplier',
            iconCls: 'add',
            handler: displayFormWindow
        },{
            text: 'Remove selected supplier',
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
	grid.on('afteredit', updateSupplier);
});