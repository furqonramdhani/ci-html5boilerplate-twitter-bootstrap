var store;
var rtn;
Ext.onReady(function(){

	function isFormValid(){
		return(noinvoice.isValid() && invoicedate.isValid() && customers.isValid() && pajak.isValid() && credit_term.isValid() && currencies.isValid());
	}
	function insertInvoice(){
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
			var arr_nomor_lot = [];
			var arr_gic_netto = [];
			var arr_gic_satuan_harga = [];
			var arr_jmlitems = [];
			var arr_hrgsat = [];
			var arr_fdisc = [];

			for(i = 0; i< grid.selModel.getCount(); i++){
				arr_kdkatalog.push(selections[i].get('kdkatalog'));
				arr_nomor_lot.push(selections[i].get('nomor_lot'));
				arr_gic_netto.push(selections[i].get('gic_netto'));
				arr_gic_satuan_harga.push(selections[i].get('gic_satuan_harga'));
				arr_jmlitems.push(selections[i].get('jmlitems'));
				arr_hrgsat.push(selections[i].get('hrgsat'));
				arr_fdisc.push(selections[i].get('fdisc'));
			}

			var encoded_kdkatalog	= Ext.encode(arr_kdkatalog);
			var encoded_nomor_lot	= Ext.encode(arr_nomor_lot);
			var encoded_gic_netto	= Ext.encode(arr_gic_netto);
			var encoded_gic_satuan_harga	= Ext.encode(arr_gic_satuan_harga);
			var encoded_jmlitems	= Ext.encode(arr_jmlitems);
			var encoded_hrgsat		= Ext.encode(arr_hrgsat);
			var encoded_fdisc		= Ext.encode(arr_fdisc);

			Ext.Ajax.request({
				waitMsg: 'Please wait...',
				url: '/transaction/invoice/action',
				params: {
					task: "INSERT",
					noinvoice:		noinvoice.getValue(),
					nomor_po:		nomor_po.getValue(),
					keterangan_kode:keterangan_kode.getValue(),
					invoicedate:	invoicedate.getValue(),
					reff_inv:		reff_inv.getValue(),
					customers:		customers.getValue(),
					pajak:			pajak.getValue(),
					credit_term:	credit_term.getValue(),
					currencies:		currencies.getValue(),
					no_mobil:		no_mobil.getValue(),
					nm_sopir:		nm_sopir.getValue(),
					kdkatalog:		encoded_kdkatalog,
					nomor_lot:		encoded_nomor_lot,
					gic_netto:		encoded_gic_netto,
					gic_satuan_harga:	encoded_gic_satuan_harga,
					jmlitems:		encoded_jmlitems,
					hrgsat:			encoded_hrgsat,
					fdisc:			encoded_fdisc
				},
				success: function(response){
					var result=eval(response.responseText);
					switch(result){
						case 1:
							document.location.replace('/transaction/invoice');
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

	var noinvoice = new Ext.form.TextField({
	    id: 'noinvoice',
	    name: 'new_noinvoice',
	    fieldLabel: 'No Invoice',
	    maxLength: 20,
	    allowBlank: false,
	    readOnly: true
	});
	var nomor_po = new Ext.form.TextField({
	    id: 'nomor_po',
	    fieldLabel: 'PO Number',
	    maxLength: 20
	});
	var keterangan_kode = new Ext.form.TextField({
	    id: 'keterangan_kode',
	    fieldLabel: 'Notes Code',
	    maxLength: 20
	});
	var invoicedate = new Ext.form.DateField({
		id: 'invoicedate',
    	fieldLabel: 'Invoice Date',
        format: 'd/m/Y',
        minValue: '01/01/2000',
        allowBlank: false,
        disabledDaysText: 'Plants are not available on the weekends'
	});
	var reff_inv = new Ext.form.TextField({
	    id: 'reff_inv',
	    fieldLabel: 'Reff. No',
	    maxLength: 20,
	    allowBlank: false,
	    maskRe: /([a-zA-Z0-9\s]+)$/
	});
	var customers = new Ext.form.ComboBox({
    	fieldLabel: 'Customer',
        typeAhead: true,
        triggerAction: 'all',
        transform: 'gic_cust_code',
        editable: true,
        allowBlank: false,
        lazyRender: true,
        listClass: 'x-combo-list-small'
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
	var currencies = new Ext.form.ComboBox({
    	fieldLabel: 'Currency',
        typeAhead: true,
        triggerAction: 'all',
        transform: 'currencies_code',
        editable: true,
        allowBlank: false,
        lazyRender: true,
        listClass: 'x-combo-list-small'
	});
	var no_mobil = new Ext.form.TextField({
        fieldLabel: 'Vehicle Number',
        name: 'no_mobil'
	});
	var nm_sopir = new Ext.form.TextField({
        fieldLabel: 'Driver',
        name: 'nm_sopir'
	});

    var master = new Ext.FormPanel({
        labelWidth: 100,
        frame:true,
        title: 'Invoice Form',
        bodyStyle:'padding:5px 5px 0',
		reader: new Ext.data.JsonReader (
		{
			root: 'formEdit',
			totalProperty: 'total',
			fields:
			[
				{name: 'new_noinvoice', type: 'string', mapping: 'new_noinvoice'}
			]
		}),
        items: [{
			layout:'column',
			border:false,
			items:[{
				columnWidth:0.3,
				layout: 'form',
				border:false,
				items:[noinvoice,nomor_po,keterangan_kode,invoicedate,reff_inv,customers]
			}, {
				columnWidth:0.7,
				layout: 'form',
				border:false,
				items:[pajak,credit_term,currencies,no_mobil,nm_sopir]
			}]
        }]
    });
    master.getForm().load({url:'/transaction/invoice/new_noinvoice', waitMsg:'Wait...'});
    master.render('master');

	function formatDate(value){
        return value ? value.dateFormat('M d, Y') : '';
    }
	function updateDtInvoice(oGrid_event){
		// membuat total
		tharga = oGrid_event.record.data.gic_netto * oGrid_event.record.data.jmlitems * oGrid_event.record.data.hrgsat;
		disc = oGrid_event.record.data.fdisc / 100;
		totalharga = tharga - (tharga * disc);
		if (!totalharga) totalharga = 0;
		oGrid_event.record.set('jmltotal',totalharga);

		Ext.Ajax.request({
			waitMsg: 'Please wait...',
			url: '/transaction/invoice/getitem_attribute',
			params: {
				kdkatalog: oGrid_event.record.data.kdkatalog
			},
			success: function(response){
				var result=response.responseText;
				if (oGrid_event.record.data.gic_satuan_harga=='') oGrid_event.record.set('gic_satuan_harga',result);
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
                    transform: 'items',
                    editable: true,
                    allowBlank: false,
                    lazyRender: true,
                    listClass: 'x-combo-list-small',
					listeners: {
						change: function(combo, newValue, oldValue){
							var selections = grid.selModel.getSelections();
							selections[0].set('gic_nm_items',combo.getRawValue());
						}
					}
                })
            }, {
                header: 'Items',
				dataIndex: 'gic_nm_items',
                width: 144
            }, {
                header: 'Nomor Lot',
                dataIndex: 'nomor_lot',
                width: 100,
                editor: new fm.TextField({ allowBlank: false }),
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
            }
        ]
    });

	store = new Ext.data.Store({
		id: 'listinvoice',
		proxy: new Ext.data.HttpProxy({
			url: '/transaction/invoice'
		}),
		baseParams:{task: "LISTING"},
		reader: new Ext.data.JsonReader({
			root: 'data',
			totalProperty: 'total'
		},[
			{name: 'recno', type: 'string'},
			{name: 'kdkatalog', type: 'string'},
			{name: 'gic_nm_items', type: 'string'},
			{name: 'nomor_lot', type: 'string'},
			{name: 'gic_netto', type: 'string'},
			{name: 'gic_satuan_harga', type: 'string'},
			{name: 'jmlitems', type: 'float'},
			{name: 'hrgsat', type: 'float'},
			{name: 'fdisc', type: 'float'},
			{name: 'jmltotal', type: 'float'},
		])
	});

	Ext.ux.grid.GridSummary.Calculations['grandTotal'] = function(v, record, field){
		return 'x';
	}
	var summary = new Ext.ux.grid.GridSummary();

    var grid = new Ext.grid.EditorGridPanel({
        store: store,
        cm: cm,
        renderTo: 'details',
        height: 240,
        title: 'Invoice details',
        iconCls: 'mygrid',
        frame: true,
        loadMask:true,
        selModel: new Ext.grid.RowSelectionModel({ singleSelect:false }),
        plugins: summary,
        bbar: [
	        {
	        	text: 'New Item',
	        	iconCls: 'add',
	        	handler: function()
	        	{
					store.add(new Details({
					    kdkatalog: 'Select Item',
					    nomor_lot: '',
					    gic_netto: 0,
					    gic_satuan_harga: '',
					    jmlitems: 0,
					    hrgsat: 0,
					    fdisc: 0,
					    total: 0
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
					insertInvoice();
	        	}
	        }
        ]
    });
	var Details = Ext.data.Record.create([{
		name: 'kdkatalog',
		name: 'nomor_lot',
		name: 'gic_satuan_harga',
		name: 'jmlitems',
		name: 'hrgsat',
		name: 'fdisc',
		name: 'total'
	}]);
	store.load({params:{start:0, limit:100}});
	grid.on('afteredit', updateDtInvoice);
});