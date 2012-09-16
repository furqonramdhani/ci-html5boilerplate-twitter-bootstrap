var store;
Ext.onReady(function(){

	function isFormValid(){
		return(noro.isValid() && suppliers.isValid() && pajak.isValid() && credit_term.isValid() && payment_method.isValid() && currencies.isValid());
	}
	function insertRO(){
		if(isFormValid()){
			//Select All
			var selArr = new Array();
			var data = grid.selModel;
			for(i=0;i<grid.store.getCount();i++)
			{
				selArr.push(i);
			}
			grid.getSelectionModel().selectRows(selArr);

			var selections = grid.selModel.getSelections();
			var arr_kdkatalog = [];
			var arr_jmlitems = [];
			var arr_hrgsat = [];
			var arr_fdisc = [];
			var arr_gic_netto = [];
			var arr_gic_satuan_harga = [];
			var arr_delivery_date = [];

			for(i = 0; i< grid.selModel.getCount(); i++){
				arr_kdkatalog.push(selections[i].get('kdkatalog'));
				arr_jmlitems.push(selections[i].get('jmlitems'));
				arr_hrgsat.push(selections[i].get('hrgsat'));
				arr_fdisc.push(selections[i].get('fdisc'));
				arr_gic_netto.push(selections[i].get('gic_netto'));
				arr_gic_satuan_harga.push(selections[i].get('gic_satuan_harga'));
				arr_delivery_date.push(selections[i].get('delivery_date'));
			}

			var encoded_kdkatalog			= Ext.encode(arr_kdkatalog);
			var encoded_jmlitems			= Ext.encode(arr_jmlitems);
			var encoded_hrgsat				= Ext.encode(arr_hrgsat);
			var encoded_fdisc				= Ext.encode(arr_fdisc);
			var encoded_gic_netto			= Ext.encode(arr_gic_netto);
			var encoded_gic_satuan_harga	= Ext.encode(arr_gic_satuan_harga);
			var encoded_delivery_date		= Ext.encode(arr_delivery_date);

			Ext.Ajax.request({
				waitMsg: 'Please wait...',
				url: '/transaction/receive_order/action',
				params: {
					task: "INSERT",
					noro:			noro.getValue(),
					tglro:			tglro.getValue(),
					reff_inv:		reff_inv.getValue(),
					suppliers:		suppliers.getValue(),
					nomor_po:		nomor_po.getValue(),
					faktur:			faktur.getValue(),
					tglfaktur:		tglfaktur.getValue(),
					pajak:			pajak.getValue(),
					credit_term:	credit_term.getValue(),
					payment_method:	payment_method.getValue(),
					payment_type:	payment_type.getValue(),
					currencies:		currencies.getValue(),
					kdkatalog:		encoded_kdkatalog,
					jmlitems:		encoded_jmlitems,
					hrgsat:			encoded_hrgsat,
					fdisc:			encoded_fdisc,
					gic_netto:			encoded_gic_netto,
					gic_satuan_harga:	encoded_gic_satuan_harga,
					delivery_date:		encoded_delivery_date
				},
				success: function(response){
					var result=eval(response.responseText);
					switch(result){
						case 1:
							document.location.replace('/transaction/receive_order');
						break;
						default:
							Ext.MessageBox.alert('Warning','Could not create invoice.');
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

	var noro = new Ext.form.TextField({
	    id: 'noro',
	    name: 'new_noro',
	    fieldLabel: 'No RO',
	    maxLength: 20,
	    allowBlank: false,
	    readOnly: true
	});
	var tglro = new Ext.form.DateField({
		id: 'tglro',
    	fieldLabel: 'Receive Order Date',
        format: 'd/m/Y',
        minValue: '01/01/2000',
        allowBlank: false,
        disabledDaysText: 'Plants are not available on the weekends'
	});
	var reff_inv = new Ext.form.TextField({
	    id: 'reff_inv',
	    fieldLabel: 'Reff. No',
	    maxLength: 20,
	    allowBlank: false
	});
	var suppliers = new Ext.form.ComboBox({
    	fieldLabel: 'Supplier',
        typeAhead: true,
        triggerAction: 'all',
        transform: 'gic_supl_code',
        editable: true,
        allowBlank: false,
        lazyRender: true,
        listClass: 'x-combo-list-small'
	});
	var nomor_po = new Ext.form.TextField({
	    id: 'nomor_po',
	    fieldLabel: 'PO Number',
	    maxLength: 20
	});
	var faktur = new Ext.form.TextField({
	    id: 'faktur',
	    fieldLabel: 'Faktur',
	    maxLength: 20
	});
	var tglfaktur = new Ext.form.DateField({
		id: 'tglfaktur',
    	fieldLabel: 'Date Faktur',
        format: 'd/m/Y',
        minValue: '01/01/2000',
        allowBlank: false,
        disabledDaysText: 'Plants are not available on the weekends'
	});
	var pajak = new Ext.form.ComboBox({
    	fieldLabel: 'Pajak',
        typeAhead: true,
        triggerAction: 'all',
        transform: 'yesno',
        editable: true,
        allowBlank: false,
        lazyRender: true,
        listClass: 'x-combo-list-small'
	});
	var credit_term = new Ext.form.TextField({
        fieldLabel: 'Credit Term',
        name: 'credit_term',
        allowBlank:false
	});
	var payment_method = new Ext.form.ComboBox({
    	fieldLabel: 'Payment Method',
        typeAhead: true,
        triggerAction: 'all',
        transform: 'payment_method',
        editable: false,
        allowBlank: false,
        lazyRender: true,
        listClass: 'x-combo-list-small'
	});
	var payment_type = new Ext.form.ComboBox({
    	fieldLabel: 'Payment Type',
        typeAhead: true,
        triggerAction: 'all',
        transform: 'payment_type',
        editable: false,
        allowBlank: false,
        lazyRender: true,
        listClass: 'x-combo-list-small'
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
        title: 'Receive Order (R/O) Form',
        bodyStyle:'padding:5px 5px 0',
		reader: new Ext.data.JsonReader (
		{
			root: 'formEdit',
			totalProperty: 'total',
			fields:
			[
				{name: 'new_noro', type: 'string', mapping: 'new_noro'}
			]
		}),
        items: [{
			layout:'column',
			border:false,
			items: [{
				columnWidth:0.3,
				layout: 'form',
				border:false,
	        	items: [noro,tglro,reff_inv,suppliers,nomor_po,faktur,tglfaktur]
	        },{
				columnWidth:0.7,
				layout: 'form',
				border:false,
				items:[pajak,credit_term,payment_method,payment_type,currencies]
        	}]
        }]
    });
    master.getForm().load({url:'/transaction/receive_order/new_noro', waitMsg:'Wait...'});
    master.render('master');

	function formatDate(value){
        return value ? value.dateFormat('d/m/Y') : '';
    }
	function updateDtRO(oGrid_event){
		// membuat total
		tharga = oGrid_event.record.data.gic_netto * oGrid_event.record.data.jmlitems * oGrid_event.record.data.hrgsat;
		disc = oGrid_event.record.data.fdisc / 100;
		totalharga = tharga - (tharga * disc);
		if (!totalharga) totalharga = 0;
		oGrid_event.record.set('jmltotal',totalharga);

		Ext.Ajax.request({
			waitMsg: 'Please wait...',
			url: '/transaction/po/getkomponen_attribute',
			params: {
				kdkatalog: oGrid_event.record.data.kdkatalog
			},
			success: function(response){
				var result=response.responseText;
				if (oGrid_event.record.data.gic_satuan_harga==undefined || oGrid_event.record.data.gic_satuan_harga=='') oGrid_event.record.set('gic_satuan_harga',result);
			},
			failure: function(response){
				var result=response.responseText;
				Ext.MessageBox.alert('error','Could not connect to the database. Retry later');
			}
		});
	}

    var fm = Ext.form;
    var cm = new Ext.grid.ColumnModel({
        defaults: { sortable: true },
        columns: [
        	{
                header: 'Items Code',
                dataIndex: 'kdkatalog',
                width: 144,
				editor: new fm.ComboBox({
                    typeAhead: true,
                    triggerAction: 'all',
                    transform: 'komponen',
                    editable: true,
                    allowBlank: false,
                    lazyRender: true,
                    listClass: 'x-combo-list-small',
                    listeners: {
						change: function(combo, newValue, oldValue){
							var selections = grid.selModel.getSelections();
							selections[0].set('gic_nm_komponen',combo.getRawValue());
						}
					}
                })
            }, {
                header: 'Items',
				dataIndex: 'gic_nm_komponen',
                width: 177,
                summaryType:'count',
				summaryRenderer: function(v, params, data){
               		if (v==undefined) v=0;
                    return 'Total('+v+'):';
                }
			}, {
                header: 'Netto',
                dataIndex: 'gic_netto',
                width: 100,
                align: 'right',
                editor: new fm.TextField({ allowBlank: false }),
                summaryType:'sum'
            }, {
                header: 'Paking',
                dataIndex: 'gic_satuan_harga',
                width: 100,
                editor: new fm.TextField({ allowBlank: false }),
                summaryType:'count'
            }, {
                header: 'Quantity',
                dataIndex: 'jmlitems',
                width: 100,
                align: 'right',
                summaryType:'sum',
                editor: new fm.TextField({ allowBlank: false })
            }, {
                header: 'Price',
                dataIndex: 'hrgsat',
                width: 100,
                align: 'right',
                summaryType:'sum',
                editor: new fm.TextField({ allowBlank: false })
            }, {
                header: 'Discount',
                dataIndex: 'fdisc',
                width: 70,
                align: 'right',
                summaryType:'sum',
                editor: new fm.TextField({ allowBlank: false })
            }, {
                header: 'Total',
                dataIndex: 'jmltotal',
                width: 70,
                align: 'right',
                summaryType:'sum'
            }, {
				header: 'Delivery',
				dataIndex: 'delivery_date',
				width: 70,
				renderer: formatDate,
				editor: new fm.DateField({
                    format: 'd/m/Y',
                    minValue: '01/01/1950',
                    disabledDaysText: 'Plants are not available on the weekends'
                })
            }
        ]
    });

	store = new Ext.data.Store({
		id: 'listinvoice',
		proxy: new Ext.data.HttpProxy({
			url: '/transaction/ro'
		}),
		baseParams:{task: "LISTING"},
		reader: new Ext.data.JsonReader({
			root: 'data',
			totalProperty: 'total'
		},[ 
			{name: 'recno', type: 'string'},
			{name: 'kdkatalog', type: 'string'},
			{name: 'jmlitems', type: 'string'},
			{name: 'hrgsat', type: 'string'},
			{name: 'fdisc', type: 'string'},
		])
	});
	var summary = new Ext.ux.grid.GridSummary();
    var grid = new Ext.grid.EditorGridPanel({
        store: store,
        cm: cm,
        renderTo: 'details',
        height: 240,
        title: 'Receive Order (R/O) Details',
        iconCls: 'mygrid',
        frame: true,
        loadMask:true,
        plugins: summary,
		selModel: new Ext.grid.RowSelectionModel({ singleSelect:false }),
        bbar: [
	        {
	        	text: 'New Item',
	        	iconCls: 'add',
	        	handler: function()
	        	{
					store.add(new Details({
					    kdkatalog: 'Select Item',
					    jmlitems: 0,
					    hrgsat: 0,
					    fdisc: 0
					}));
	        	}
	        },{
	            text: 'Remove Items',
	            iconCls: 'drop',
	            handler : delCheck
        	}, {
	        	text: 'Save',
	        	iconCls: 'save',
	        	handler: function()
	        	{
					insertRO();
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
	store.load({params:{start:0, limit:100}});
	grid.on('afteredit', updateDtRO);
});