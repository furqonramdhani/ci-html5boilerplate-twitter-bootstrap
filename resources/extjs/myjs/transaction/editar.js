Ext.onReady(function(){

	function isFormValid(){
		return(customers.isValid() && payment_date.isValid() && kwitansi.isValid());
	}
	function updateAR(){
		if(isFormValid()){
			var selArr = new Array();
			var data = grid.selModel;
			for(i=0;i<grid.store.getCount();i++)
			{
				selArr.push(i);
			}
			grid.getSelectionModel().selectRows(selArr);

			var selections		= grid.selModel.getSelections();
			var arr_recno		= [];
			var arr_noinvoice	= [];
			var arr_saldo		= [];

			for(i = 0; i< grid.selModel.getCount(); i++){
				arr_recno.push(selections[i].get('recno'));
				arr_noinvoice.push(selections[i].get('noinvoice'));
				arr_saldo.push(selections[i].get('saldo'));
			}

			var encoded_recno		= Ext.encode(arr_recno);
			var encoded_noinvoice	= Ext.encode(arr_noinvoice);
			var encoded_saldo		= Ext.encode(arr_saldo);

			Ext.Ajax.request({
				waitMsg: 'Please wait...',
				url: '/transaction/ar/action',
				params: {
					task: "UPDATE",
					customers:		customers.getValue(),
					kwitansi:		kwitansi.getValue(),
					payment_date:	payment_date.getValue(),
					total_receive:	total_receive.getValue(),
					cheque_number:	cheque_number.getValue(),
					cheque_date:	cheque_date.getValue(),
					account:		account.getValue(),
					currencies:		currencies.getValue(),
					memo:			memo.getValue(),
					recno:			encoded_recno,
					noinvoice:		encoded_noinvoice,
					saldo:			encoded_saldo
				},
				success: function(response){
					var result=eval(response.responseText);

					switch(result){
						case 1:
							document.location.replace('/transaction/ar');
						break;
						default:
							Ext.MessageBox.alert('Warning','Could not create ar.');
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

    function delCheck(){
        var m = grid.selModel.getSelections();
        if(m.length > 0)
        {
        	doDel();
        }
        else
        {
        	Ext.MessageBox.alert('Message', 'Please select at least one item to delete');
        }
    }   
    function doDel()
	{
        var s = grid.getSelectionModel().getSelections();
        for(var i = 0, r; r = s[i]; i++){
            store.remove(r);
        }
	}

	var total_receive = new Ext.form.TextField({
	    id: 'total_receive',
	    fieldLabel: 'Receive',
	    maxLength: 20,
	    align: 'right',
	    allowBlank: false,
	    maskRe: /[+0-9+.]/,
		listeners:{
			render:function() {
				this.el.on('keyup', function() {
					//Select All
					var selArr = new Array();
					for(i=0;i<grid.store.getCount();i++)
					{
						selArr.push(i);
					}
					grid.getSelectionModel().selectRows(selArr);

					var selections = grid.selModel.getSelections();
					for(i = 0; i< grid.selModel.getCount(); i++){
						rcv = parseFloat(this.getValue());
						old_rcv = parseFloat(old_receive.getValue());
						old_sld = parseFloat(selections[i].get('old_saldo'));
						new_sld = (old_sld + old_rcv) - rcv;
						ttl = parseFloat(selections[i].get('jmltotal'));
						ppn = parseFloat(selections[i].get('jmlppn_valas'));

						selections[i].set('saldo',new_sld);
						selections[i].set('jmlrcv', (ttl + ppn) - new_sld);
					}
				})
			}
		}
	});
	var old_receive = new Ext.form.TextField({
	    id: 'old_receive',
	    hidden: true,
	    maskRe: /[+0-9+.]/
	});

	var payment_date = new Ext.form.DateField({
		id: 'paymentdate',
    	fieldLabel: 'Payment Date',
        format: 'd/m/Y',
        minValue: '01/01/1950',
        allowBlank: false,
        disabledDaysText: 'Plants are not available on the weekends'
	});
	var cheque_number = new Ext.form.TextField({
	    id: 'cheque_number',
	    fieldLabel: 'Cheque Number',
	    maxLength: 20,
	    allowBlank: false
	});
	var cheque_date = new Ext.form.DateField({
		id: 'cheque_date',
    	fieldLabel: 'Cheque Date',
        format: 'd/m/Y',
        minValue: '01/01/1950',
        allowBlank: false,
        disabledDaysText: 'Plants are not available on the weekends'
	});
	var customers = new Ext.form.ComboBox({
		id:'customers',
    	fieldLabel: 'Customer',
        typeAhead: true,
        triggerAction: 'all',
        transform: 'gic_cust_code',
        editable: false,
        allowBlank: false,
        lazyRender: true,
        listClass: 'x-combo-list-small'
	});
	customers.disable();
	var kwitansi_store = new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url: '/transaction/ar/json_listing_combo_kwitansi'
		}),
		baseParams:{task: "LISTING"},
		reader: new Ext.data.JsonReader({
			root: 'data',
			totalProperty: 'total'
		},[ 
			{name: 'combo_text', type: 'string'},
			{name: 'gic_kwitansi_no', type: 'string'}
		])
	});
	var kwitansi = new Ext.form.ComboBox({
		id:'kwitansi',
		store: kwitansi_store,
    	fieldLabel: 'No Kwitansi',
        typeAhead: true,
        displayField: 'combo_text',
        valueField: 'gic_kwitansi_no',
        triggerAction: 'all',
        editable: true,
        allowBlank: false,
        lazyRender: true,
        listClass: 'x-combo-list-small',
		listeners: {
			change: function(combo, newValue, oldValue){
				hnoinvoice_store.setBaseParam('gic_kwitansi_no',newValue);
				hnoinvoice_store.load();
			}
		}
	});
	kwitansi.disable();
	var hnoinvoice_store = new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url: '/transaction/ar/json_listing_combo_invoice_from_kwitansi'
		}),
		baseParams:{task: "LISTING"},
		reader: new Ext.data.JsonReader({
			root: 'data',
			totalProperty: 'total'
		},[ 
			{name: 'noinvoice', type: 'string'},
			{name: 'noinvoice', type: 'string'}
		])
	});
	var hnoinvoice = new Ext.form.ComboBox({
		id:'hnoinvoice',
		store: hnoinvoice_store,
    	fieldLabel: 'No Invoice',
        typeAhead: true,
        displayField: 'noinvoice',
        valueField: 'noinvoice',
        triggerAction: 'all',
        editable: true,
        allowBlank: false,
        lazyRender: true,
        listClass: 'x-combo-list-small'
	});
	hnoinvoice.disable();
	var account = new Ext.form.ComboBox({
		id: 'account',
    	fieldLabel: 'Account',
        typeAhead: true,
        triggerAction: 'all',
        transform: 'noaccount',
        editable: true,
        allowBlank: false,
        lazyRender: true,
        listClass: 'x-combo-list-small'
	});
	var memo = new Ext.form.TextField({
		id: 'memo',
        fieldLabel: 'Remarks',
        allowBlank:false
	});
	var currencies = new Ext.form.ComboBox({
    	fieldLabel: 'Currency',
        typeAhead: true,
        triggerAction: 'all',
        transform: 'gic_currencies_code',
        editable: true,
        allowBlank: false,
        lazyRender: true,
        listClass: 'x-combo-list-small'
	});

    var master = new Ext.FormPanel({
        labelWidth: 144, // label settings here cascade unless overridden
        frame:true,
        title: 'Form Account Recheive',
        bodyStyle:'padding:5px 5px 0',
		reader: new Ext.data.JsonReader (
		{
			root: 'formEdit',
			totalProperty: 'total',
			fields:
			[
				{name: 'customers', type: 'string', mapping: 'fkplg'},
				{name: 'kwitansi', type: 'string', mapping: 'gic_kwitansi_no'},
				{name: 'hnoinvoice', type: 'string', mapping: 'noinvoice'},
				{name: 'paymentdate', type: 'string', mapping: 'tglpayment'},
				{name: 'total_receive', type: 'float', mapping: 'jmlrcv'},
				{name: 'old_receive', type: 'float', mapping: 'jmlrcv'},
				{name: 'cheque_number', type: 'string', mapping: 'nocheque'},
				{name: 'cheque_date', type: 'string', mapping: 'tglcheque'},
				{name: 'account', type: 'string', mapping: 'noaccount'},
				{name: 'memo', type: 'string', mapping: 'memo'}
			]
		}),

        items: [{
			layout:'column',
			border:false,
        	items:[{
				columnWidth:0.3,
				layout: 'form',
				border:false,
	        	items:[customers,kwitansi,hnoinvoice,payment_date,total_receive,old_receive]
        	},{
        		columnWidth:0.7,
				layout: 'form',
				border:false,
	        	items:[cheque_number,cheque_date,account,memo]
        	}]
        }]
    });

	var urlHalves = String(document.location).split('/');
    master.getForm().load({url:'/transaction/ar/get_msar/'+urlHalves[6], waitMsg:'Wait...'});
    master.render('master');

	function formatDate(value){
        return value ? value.dateFormat('d/m/Y') : '';
    }
    var fm = Ext.form;
    var cm = new Ext.grid.ColumnModel({
        defaults: { sortable: true },
        columns: [
        	{
                header: 'Recno', dataIndex: 'recno', hidden: true
            }, {
                header: 'No Invoice',
                dataIndex: 'noinvoice',
                width: 100
            }, {
                header: 'Date',
                dataIndex: 'tglfaktur',
                renderer: formatDate,
                width: 70
            }, {
                header: 'Tax',
                dataIndex: 'pajak',
                width: 50
            }, {
                header: 'Total',
                dataIndex: 'jmltotal',
                width: 100,
                align: 'right'
            }, {
                header: 'Ppn Valas',
                dataIndex: 'jmlppn_valas',
                width: 100,
                align: 'right'
            }, {
                header: 'Ppn',
                dataIndex: 'jmlppn',
                width: 100,
                align: 'right'
            }, {
                header: 'Currency',
                dataIndex: 'gic_currencies_code',
                width: 70
            }, {
                header: 'Rate',
                dataIndex: 'gic_currencies_value',
                width: 70
            }, {
                header: 'Received',
                dataIndex: 'jmlrcv',
                width: 100,
                align: 'right'
            }, {
                header: 'Old Saldo',
                dataIndex: 'old_saldo',
                width: 100,
                align: 'right',
                hidden: true
            }, {
                header: 'Saldo',
                dataIndex: 'saldo',
                width: 100,
                align: 'right'
            }
        ]
    });

	var store = new Ext.data.Store({
		id: 'listinvoice',
		proxy: new Ext.data.HttpProxy({
			url: '/transaction/ar/json_listing_dtar/'+urlHalves[6]
		}),
		baseParams:{task: "LISTING"},
		reader: new Ext.data.JsonReader({
			root: 'data',
			totalProperty: 'total'
		},[ 
			{name: 'recno', type: 'string'},
			{name: 'noinvoice', type: 'string'},
			{name: 'tglfaktur', type: 'date', dateFormat: 'Y-m-d'},
			{name: 'pajak', type: 'string'},
			{name: 'jmltotal', type: 'string'},
			{name: 'jmlppn_valas', type: 'string'},
			{name: 'jmlppn', type: 'string'},
			{name: 'gic_currencies_code', type: 'string'},
			{name: 'gic_currencies_value', type: 'string'},
			{name: 'jmlrcv', type: 'string'},
			{name: 'old_saldo', type: 'string'},
			{name: 'saldo', type: 'string'}
		])
	});

    var grid = new Ext.grid.EditorGridPanel({
        store: store,
        cm: cm,
        renderTo: 'details',
        height: 240,
        title: 'Invoice',
        iconCls: 'mygrid',
        frame: true,
        loadMask:true,
		selModel: new Ext.grid.RowSelectionModel({ singleSelect:false }),
        bbar: [
			{
	        	text: 'Save',
	        	iconCls: 'save',
	        	handler: function()
	        	{
					updateAR();
	        	}
	        }
        ]
    });
	store.load({params:{start:0, limit:100}});
});