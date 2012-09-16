Ext.onReady(function(){

	function isFormValid(){
		return(suppliers.isValid() && payment_date.isValid());
	}
	function insertAP(){
		if(isFormValid()){
			var selArr = new Array();
			var data = grid.selModel;
			for(i=0;i<grid.store.getCount();i++)
			{
				selArr.push(i);
			}
			grid.getSelectionModel().selectRows(selArr);

			var selections		= grid.selModel.getSelections();
			var arr_noro		= [];
			var arr_jmlpayment	= [];
			var arr_saldo		= [];

			for(i = 0; i< grid.selModel.getCount(); i++){
				arr_noro.push(selections[i].get('noro'));
				arr_jmlpayment.push(selections[i].get('jmlpayment'));
				arr_saldo.push(selections[i].get('saldo'));
			}

			var encoded_noro		= Ext.encode(arr_noro);
			var encoded_jmlpayment	= Ext.encode(arr_jmlpayment);
			var encoded_saldo		= Ext.encode(arr_saldo);

			Ext.Ajax.request({
				waitMsg: 'Please wait...',
				url: '/transaction/ap/action',
				params: {
					task: "INSERT",
					suppliers:		suppliers.getValue(),
					payment_date:	payment_date.getValue(),
					cheque_number:	cheque_number.getValue(),
					cheque_date:	cheque_date.getValue(),
					account:		account.getValue(),
					memo:			memo.getValue(),
					noro:			encoded_noro,
					jmlpayment:		encoded_jmlpayment,
					saldo:			encoded_saldo
				},
				success: function(response){
					var result=eval(response.responseText);
					switch(result){
						case 1:
							document.location.replace('/transaction/ap');
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

	var total_payment = new Ext.form.TextField({
	    id: 'total_payment',
	    fieldLabel: 'Payment',
	    maxLength: 20,
	    align: 'right',
	    allowBlank: false,
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
						old_sld = parseFloat(selections[i].get('old_saldo'));
						new_sld = old_sld - rcv;
						ttl = parseFloat(selections[i].get('jmltotal'));
						ppn = parseFloat(selections[i].get('jmlppn_valas'));

						selections[i].set('saldo',new_sld);
						selections[i].set('jmlrcv', (ttl + ppn) - new_sld);
					}
				})
			}
		}
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
	var suppliers = new Ext.form.ComboBox({
    	fieldLabel: 'Supplier',
        typeAhead: true,
        triggerAction: 'all',
        transform: 'gic_supl_code',
        editable: true,
        allowBlank: false,
        lazyRender: true,
        listClass: 'x-combo-list-small',
		listeners: {
			change: function(combo, newValue, oldValue){
				store.setBaseParam('gic_supl_code',newValue);
				store.load();
			}
		}
	});
	var account = new Ext.form.ComboBox({
    	fieldLabel: 'Account',
        typeAhead: true,
        triggerAction: 'all',
        transform: 'noaccount',
        editable: true,
        allowBlank: false,
        lazyRender: true,
        listClass: 'x-combo-list-small'
	});
	var memo = new Ext.form.TextArea({
        fieldLabel: 'Remarks',
        width:300
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
        labelWidth: 110,
        frame:true,
        title: 'Form Account Payable',
        bodyStyle:'padding:5px 5px 0',
		reader: new Ext.data.JsonReader (
		{
			root: 'formEdit',
			totalProperty: 'total',
			fields:
			[
			]
		}),

        items: [{
			layout:'column',
			border:false,
        	items:[{
				columnWidth:0.3,
				layout: 'form',
				border:false,
	        	items:[suppliers,payment_date,cheque_number,cheque_date]
        	},{
        		columnWidth:0.7,
				layout: 'form',
				border:false,
	        	items:[account,memo]
        	}]
        }]
    });
    master.render('master');


	function updateDtRO(oGrid_event){
		jmlpayment	= oGrid_event.record.data.jmlpayment;
		old_saldo	= oGrid_event.record.data.old_saldo;
		nsaldo		= old_saldo - jmlpayment;
		oGrid_event.record.set('saldo',nsaldo);
	}
	function formatDate(value){
        return value ? value.dateFormat('d/m/Y') : '';
    }
    var fm = Ext.form;
    var cm = new Ext.grid.ColumnModel({
        defaults: { sortable: true },
        columns: [
        	{
                header: 'No RO',
                dataIndex: 'noro',
                width: 100,
				summaryType:'count',
				summaryRenderer: function(v, params, data){
               		if (v==undefined) v=0;
                    return 'Total('+v+'):';
                }
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
                align: 'right',
                summaryType:'sum'
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
                header: 'Paid',
                dataIndex: 'paid',
                width: 100,
                align: 'right',
                summaryType:'sum'
            }, {
                header: 'Pay',
                dataIndex: 'jmlpayment',
                width: 100,
                editor: new fm.TextField({ allowBlank: false, maskRe: /[+0-9+.]/ }),
                align: 'right',
                summaryType:'sum'
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
                align: 'right',
                summaryType:'sum'
            }
        ]
    });

	var store = new Ext.data.Store({
		id: 'listinvoice',
		proxy: new Ext.data.HttpProxy({
			url: '/transaction/ap/json_listing_ro'
		}),
		baseParams:{task: "LISTING"},
		reader: new Ext.data.JsonReader({
			root: 'data',
			totalProperty: 'total'
		},[ 
			{name: 'no', type: 'string'},
			{name: 'noro', type: 'string'},
			{name: 'tglfaktur', type: 'date', dateFormat: 'Y-m-d'},
			{name: 'pajak', type: 'string'},
			{name: 'jmltotal', type: 'string'},
			{name: 'jmlppn_valas', type: 'string'},
			{name: 'jmlppn', type: 'string'},
			{name: 'gic_currencies_code', type: 'string'},
			{name: 'gic_currencies_value', type: 'string'},
			{name: 'paid', type: 'string'},
			{name: 'jmlpayment', type: 'string'},
			{name: 'old_saldo', type: 'string'},
			{name: 'saldo', type: 'string'}
		])
	});

	var summary = new Ext.ux.grid.GridSummary();

    var grid = new Ext.grid.EditorGridPanel({
        store: store,
        cm: cm,
        renderTo: 'details',
        height: 240,
        title: 'Receive Order (R/O)',
        iconCls: 'mygrid',
        frame: true,
        loadMask:true,
		selModel: new Ext.grid.RowSelectionModel({ singleSelect:false }),
		plugins: summary,
        bbar: [
			{
	        	text: 'Save',
	        	iconCls: 'save',
	        	handler: function()
	        	{
					insertAP();
	        	}
	        }
        ]
    });
	var Details = Ext.data.Record.create([{
		name: 'kdkatalog',
		name: 'jmlitems',
		name: 'hrgsat',
		name: 'fdisc'
	}]);
	grid.on('afteredit', updateDtRO);
});