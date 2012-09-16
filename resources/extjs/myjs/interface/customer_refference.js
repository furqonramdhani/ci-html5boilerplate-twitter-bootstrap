var store;
var grid;

var CustomersCode;
var CustomersName;
var CustomersNpwp;
var CustomersAddress1;
var CustomersAddress2;
var CustomersCity;
var CustomersCountry;
var CustomersPhone;
var CustomersFax;
var ActiveStatus;
var NPWPName;
var NPWPAddress1;
var NPWPAddress2;
var NPWPCity;

Ext.onReady(function(){

	CustomersCode = new Ext.form.TextField({
	    id: 'CustomersCode',
	    fieldLabel: 'Code',
	    maxLength: 20,
	    allowBlank: false,
	    anchor : '95%',
	    maskRe: /([a-zA-Z0-9\s]+)$/
	});
	CustomersName = new Ext.form.TextField({
	    id: 'CustomersName',
	    fieldLabel: 'Name',
	    maxLength: 100,
	    allowBlank: false,
	    anchor : '95%'
	});
	CustomersNpwp = new Ext.form.TextField({
	    id: 'CustomersNpwp',
	    fieldLabel: 'Npwp No.pkp',
	    maxLength: 100,
	    allowBlank: false,
	    anchor : '95%'
	});
	CustomersAddress1 = new Ext.form.TextField({
	    id: 'CustomersAddress1',
	    fieldLabel: 'Address1',
	    maxLength: 255,
	    allowBlank: false,
	    anchor : '95%'
	});
	CustomersAddress2 = new Ext.form.TextField({
	    id: 'CustomersAddress2',
	    fieldLabel: 'Address2',
	    maxLength: 255,
	    allowBlank: false,
	    anchor : '95%'
	});
	CustomersCity = new Ext.form.TextField({
	    id: 'CustomersCity',
	    fieldLabel: 'City',
	    maxLength: 100,
	    allowBlank: false,
	    anchor : '95%'
	});
	CustomersCountry = new Ext.form.TextField({
	    id: 'CustomersCountry',
	    fieldLabel: 'Country',
	    maxLength: 100,
	    allowBlank: false,
	    anchor : '95%'
	});
	CustomersPhone = new Ext.form.TextField({
	    id: 'CustomersPhone',
	    fieldLabel: 'Phone',
	    maxLength: 50,
	    allowBlank: false,
	    anchor : '95%'
	});
	CustomersFax = new Ext.form.TextField({
	    id: 'CustomersFax',
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
				items:[CustomersCode,CustomersName,CustomersNpwp,CustomersAddress1,CustomersAddress2]
			}, {
				columnWidth:0.4,
				layout: 'form',
				border:false,
				items:[CustomersCity,CustomersCountry,CustomersPhone,CustomersFax,ActiveStatus]
			}, {
				columnWidth: 1,
				layout: 'form',
				border:false,
				items:[NPWPName,NPWPAddress1,NPWPAddress2,NPWPCity]
			}]
		}],
		buttons: [{
			text: 'Save and Close',
			handler: createCustomer
		},{
			text: 'Cancel',
			handler: function(){
				MyCreateWindow.hide();
			}
		}]
	});
	MyCreateWindow = new Ext.Window({
		id: 'MyCreateWindow',
		title: 'New Customer',
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
		CustomersCode.setValue('');
		CustomersName.setValue('');
		CustomersNpwp.setValue('');
		CustomersAddress1.setValue('');
		CustomersAddress2.setValue('');
		CustomersCity.setValue('');
		CustomersCountry.setValue('');
		CustomersPhone.setValue('');
		CustomersFax.setValue('');
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
				prez.push(selections[i].json.alu_customers_id);
			}

			var encoded_array = Ext.encode(prez);
			Ext.Ajax.request({
				waitMsg: 'Please Wait',
				url: '/index.php/interface/customer_refference/useraction',
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

	function createCustomer(){
		if(isFormValid()){
			Ext.Ajax.request({
				waitMsg: 'Please wait...',
				url: '/index.php/interface/customer_refference/useraction',
				params: {
				task: "INSERT",
				gic_cust_code:			CustomersCode.getValue(),
				gic_cust_name:			CustomersName.getValue(),
				gic_cust_npwp:			CustomersNpwp.getValue(),
				gic_cust_address1:		CustomersAddress1.getValue(),
				gic_cust_address2:		CustomersAddress2.getValue(),
				gic_cust_city:			CustomersCity.getValue(),
				gic_cust_country:		CustomersCountry.getValue(),
				gic_cust_tel1:			CustomersPhone.getValue(),
				gic_cust_fax:			CustomersFax.getValue(),
				gic_cust_npwp_name:		NPWPName.getValue(),
				gic_cust_npwp_address1:	NPWPAddress1.getValue(),
				gic_cust_npwp_address2:	NPWPAddress2.getValue(),
				gic_cust_npwp_city:		NPWPCity.getValue(),
				gic_cust_status:		ActiveStatus.getValue()
			},
			success: function(response){
				var result=eval(response.responseText);
				switch(result){
					case 1:
						Ext.MessageBox.alert('Success','The new customer was created successfully.');
						store.reload();
						MyCreateWindow.hide();
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
		} else {
			Ext.MessageBox.alert('Warning', 'Your Form is not valid!');
		}
	}

	function isFormValid(){
		return(CustomersCode.isValid() && CustomersName.isValid());
	}

	function updateCustomer(oGrid_event){
		Ext.Ajax.request({
			waitMsg: 'Please wait...',
			url: '/index.php/interface/customer_refference/useraction',
			params: {
				task: "UPDATE",
				gic_cust_id:			oGrid_event.record.data.gic_cust_id,
				gic_cust_code:			oGrid_event.record.data.gic_cust_code,
				gic_cust_name:			oGrid_event.record.data.gic_cust_name,
				gic_cust_npwp:			oGrid_event.record.data.gic_cust_npwp,
				gic_cust_address1:		oGrid_event.record.data.gic_cust_address1,
				gic_cust_address2:		oGrid_event.record.data.gic_cust_address2,
				gic_cust_city:			oGrid_event.record.data.gic_cust_city,
				gic_cust_country:		oGrid_event.record.data.gic_cust_country,
				gic_cust_tel1:			oGrid_event.record.data.gic_cust_tel1,
				gic_cust_fax:			oGrid_event.record.data.gic_cust_fax,
				gic_cust_npwp_name:		oGrid_event.record.data.gic_cust_npwp_name,
				gic_cust_npwp_address1:	oGrid_event.record.data.gic_cust_npwp_address1,
				gic_cust_npwp_address2:	oGrid_event.record.data.gic_cust_npwp_address2,
				gic_cust_npwp_city:		oGrid_event.record.data.gic_cust_npwp_city,
				gic_cust_status:		oGrid_event.record.data.gic_cust_status
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
        		header: 'Customer Id',
        		dataIndex: 'gic_cust_id',
        		hidden: true
        	}, {
                header: 'Code',
                dataIndex: 'gic_cust_code',
                width: 144,
        		editor: new fm.TextField({ allowBlank: false })
            }, {
                header: 'Name',
                dataIndex: 'gic_cust_name',
                width: 130,
                editor: new fm.TextField({ allowBlank: false })
            },{
                header: 'NPWP',
                dataIndex: 'gic_cust_npwp',
                width: 120,
                editor: new fm.TextField({ allowBlank: false })
            },{
                header: 'Address',
                dataIndex: 'gic_cust_address1',
                width: 120,
                editor: new fm.TextField({ allowBlank: false })
            }, {
                header: 'Address2',
                dataIndex: 'gic_cust_address2',
                width: 144,
                editor: new fm.TextField({ allowBlank: false })
            }, {
                header: 'City',
                dataIndex: 'gic_cust_city',
                width: 144,
                editor: new fm.TextField({ allowBlank: false })
            }, {
                header: 'Country',
                dataIndex: 'gic_cust_country',
                width: 144,
                editor: new fm.TextField({ allowBlank: false })
            }, {
                header: 'Phone',
                dataIndex: 'gic_cust_tel1',
                width: 44,
                editor: new fm.TextField({ allowBlank: false })
            }, {
                header: 'Fax',
                dataIndex: 'gic_cust_fax',
                width: 44,
                editor: new fm.TextField({ allowBlank: false })
			}, {
                header: 'Status',
                dataIndex: 'gic_cust_status',
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
			url: '/index.php/interface/customer_refference/json_listing_customer',
			method: 'POST'
		}),
		baseParams:{task: "LISTING"},
		reader: new Ext.data.JsonReader({
			root: 'data',
			totalProperty: 'total',
			id: 'gic_cust_id'
		},[
			{name: 'gic_cust_id', type: 'int'},
			{name: 'gic_cust_code', type: 'string'},
			{name: 'gic_cust_name', type: 'string'},
			{name: 'gic_cust_npwp', type: 'string'},
			{name: 'gic_cust_address1', type: 'string'},
			{name: 'gic_cust_address2', type: 'string'},
			{name: 'gic_cust_city', type: 'string'},
			{name: 'gic_cust_country', type: 'string'},
			{name: 'gic_cust_tel1', type: 'string'},
			{name: 'gic_cust_fax', type: 'string'},
			{name: 'gic_cust_status', type: 'string'}
		]),
		sortInfo:{field: 'gic_cust_code', direction: "ASC"}
    });

    var grid = new Ext.grid.EditorGridPanel({
        store: store,
        cm: cm,
        renderTo: 'customer-grid',
        height: 490,
        title: 'Customer Refference',
        iconCls: 'myuser',
        frame: true,
        clicksToEdit: 1,
        selModel: new Ext.grid.RowSelectionModel({singleSelect:false}),
        tbar: [{
            text: 'Add Customer',
            iconCls: 'add',
            handler: displayFormWindow
        },{
            text: 'Remove selected customer',
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
	grid.on('afteredit', updateCustomer);
});