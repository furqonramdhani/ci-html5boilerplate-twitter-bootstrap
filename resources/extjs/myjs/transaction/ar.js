Ext.onReady(function(){
	Ext.QuickTips.init();

    function editCheck(options){
        var error = false;
        var m = grid.selModel.getSelections();
        var recno;

		for(i = 0; i< grid.selModel.getCount(); i++){
			recno = m[i].json.recno;
		}
		if (error)
		{
			if (error==1) Ext.MessageBox.alert('Message', 'The record of data is disabled edit!');
		} else {
	        if(m.length == 1) document.location.replace('/transaction/ar/editar/'+recno);
	        else Ext.MessageBox.alert('Message', 'Please select at least one item to edit!');
        }
    }

    function recapitulationCheck(options){
        var error = false;
        act = options.params.act;
        if (act=='UNRECAPITULATION') var gridName = 'gridKwitansi';
        else var gridName = 'gridInvoice';
        var m = eval(gridName).selModel.getSelections();

		for(i = 0; i< eval(gridName).selModel.getCount(); i++){
			if (m[i].json.rekapitulasi=='Yes' && act.toLowerCase()=='recapitulation') error = 2;
			if (m[i].json.rekapitulasi=='No' && act.toLowerCase()=='unrecapitulation') error = 3;

			gic_currencies_code_first = m[i].json.gic_currencies_code;
			if (i>0 && gic_currencies_code_first != gic_currencies_code_last) error = 4;
			gic_currencies_code_last = m[i].json.gic_currencies_code;

			gic_cust_name_first = m[i].json.gic_cust_name;
			if (i>0 && gic_cust_name_first != gic_cust_name_last) error = 5;
			gic_cust_name_last = m[i].json.gic_cust_name;
		}
		if (error)
		{
			if (error==2) Ext.MessageBox.alert('Message', 'The record of data is disabled recapitulation!');
			if (error==3) Ext.MessageBox.alert('Message', 'The record of data is disabled unrecapitulation!');
			if (error==4) Ext.MessageBox.alert('Message', 'The invoice currency is multiple!');
			if (error==5) Ext.MessageBox.alert('Message', 'Did not suport multiple customers!');
		} else {
	        if(m.length > 0) Ext.MessageBox.confirm('Message', 'Do you really want to '+act.toLowerCase()+' it?' , doRecapitulation);
	        else Ext.MessageBox.alert('Message', 'Please select at least one item to '+act.toLowerCase());
        }
    }
    function doRecapitulation(btn)
	{
		if(btn == 'yes')
		{
	        if (act=='UNRECAPITULATION') var gridName = 'gridKwitansi';
	        else var gridName = 'gridInvoice';
	        var selections = eval(gridName).selModel.getSelections();

			var arr_recno = [];
			var arr_gic_kwitansi_no = [];
			for(i = 0; i< eval(gridName).selModel.getCount(); i++){
				if (selections[i].json.recno) arr_recno.push(selections[i].json.recno);
				if (selections[i].json.gic_kwitansi_no) arr_gic_kwitansi_no.push(selections[i].json.gic_kwitansi_no);
			}

			var encoded_array_recno = Ext.encode(arr_recno);
			var encoded_array_gic_kwitansi_no = Ext.encode(arr_gic_kwitansi_no);
			Ext.Ajax.request({
				waitMsg: 'Please Wait',
				url: '/transaction/ar/action',
				params: {
					task: act,
					ea_recno:  encoded_array_recno,
					ea_gic_kwitansi_no:  encoded_array_gic_kwitansi_no
				},
				success: function(response){
					var result=eval(response.responseText);
					switch(result){
						case 1:
							storeInvoice.reload();
							storeKwitansi.reload();
						break;
						default:
							Ext.MessageBox.alert('Warning','Could not recapitulation the entire selection.');
						break;
					}
				},
				failure: function(response){
					var result=response.responseText;
					Ext.MessageBox.alert('error','Could not connect to the database. Retry later.');
				}
			});
		}
	}

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
                header: 'Noreff',
                dataIndex: 'noreff',
                width: 100
            }, {
                header: 'No Invoice',
                dataIndex: 'noinvoice',
                width: 100
            }, {
                header: 'Invoice Date',
                dataIndex: 'tglfaktur',
                width: 70
            }, {
                header: 'Customer',
                dataIndex: 'gic_cust_name',
                width: 144
            }, {
                header: 'Pajak',
                dataIndex: 'pajak',
                width: 70
            }, {
                header: 'Transaction',
                dataIndex: 'transaction',
                width: 70,
                align: 'right'
            }, {
                header: 'Disc',
                dataIndex: 'jmldisc',
                width: 70,
                align: 'right'
            }, {
                header: 'Ppn Valas',
                dataIndex: 'jmlppn_valas',
                width: 70,
                align: 'right'
            }, {
                header: 'Ppn',
                dataIndex: 'jmlppn',
                width: 70,
                align: 'right'
            }, {
                header: 'Total',
                dataIndex: 'jmltotal',
                width: 70,
                align: 'right'
            }, {
                header: 'Currency',
                dataIndex: 'gic_currencies_code',
                width: 70,
                align: 'right'
            }, {
                header: 'Rate',
                dataIndex: 'gic_currencies_value',
                width: 70,
                align: 'right'
            }, {
                header: 'Term',
                dataIndex: 'termrcv',
                width: 44,
                align: 'right'
            }, {
                header: 'Sales/Income',
                dataIndex: 'jmlrcv',
                width: 80,
                align: 'right'
            }, {
        		header: 'Saldo',
        		dataIndex: 'saldo',
				width: 70,
				align: 'right'
        	}
        ]
    });
    var cmInvoice = new Ext.grid.ColumnModel({
        defaults: { sortable: true },
        columns: [
        	{
        		header: 'Recno', dataIndex: 'recno', hidden: true
        	}, {
                header: 'No Invoice',
                dataIndex: 'noinvoice',
                width: 100
            }, {
                header: 'Invoice Date',
                dataIndex: 'tglfaktur',
                width: 70
            }, {
                header: 'Customer',
                dataIndex: 'gic_cust_name',
                width: 144
            }, {
                header: 'Pajak',
                dataIndex: 'pajak',
                width: 70
            }, {
                header: 'Transaction',
                dataIndex: 'transaction',
                width: 70,
                align: 'right'
            }, {
                header: 'Disc',
                dataIndex: 'jmldisc',
                width: 70,
                align: 'right'
            }, {
                header: 'Ppn Valas',
                dataIndex: 'jmlppn_valas',
                width: 70,
                align: 'right'
            }, {
                header: 'Ppn',
                dataIndex: 'jmlppn',
                width: 70,
                align: 'right'
            }, {
                header: 'Total',
                dataIndex: 'jmltotal',
                width: 70,
                align: 'right'
            }, {
                header: 'Currency',
                dataIndex: 'gic_currencies_code',
                width: 70,
                align: 'right'
            }, {
                header: 'Rate',
                dataIndex: 'gic_currencies_value',
                width: 70,
                align: 'right'
            }, {
        		header: 'Recapitulation',
        		dataIndex: 'rekapitulasi',
				width: 70
        	}
        ]
    });
    var cmKwitansi = new Ext.grid.ColumnModel({
        columns: [
        	{
        		header: 'ID', dataIndex: 'gic_kwitansi_id', hidden: true
        	}, {
                header: 'No Kwitansi',
                dataIndex: 'gic_kwitansi_no',
                width: 100
            }, {
                header: 'Customer',
                dataIndex: 'gic_cust_name',
                width: 144
            }, {
                header: 'No Invoice',
                dataIndex: 'noinvoice',
                width: 100
            }, {
                header: 'Invoice Date',
                dataIndex: 'tglfaktur',
                renderer: formatDate,
                width: 70
            }, {
                header: 'Pajak',
                dataIndex: 'pajak',
                width: 70
            }, {
                header: 'Transaction',
                dataIndex: 'transaction',
                width: 70,
                align: 'right'
            }, {
                header: 'Disc',
                dataIndex: 'jmldisc',
                width: 70,
                align: 'right'
            }, {
                header: 'Ppn Valas',
                dataIndex: 'jmlppn_valas',
                width: 70,
                align: 'right'
            }, {
                header: 'Ppn',
                dataIndex: 'jmlppn',
                width: 70,
                align: 'right'
            }, {
                header: 'Total',
                dataIndex: 'jmltotal',
                width: 70,
                align: 'right'
            }, {
                header: 'Currency',
                dataIndex: 'gic_currencies_code',
                width: 70,
                align: 'right'
            }, {
                header: 'Rate',
                dataIndex: 'gic_currencies_value',
                width: 70,
                align: 'right'
            }, {
        		header: 'Recapitulation',
        		dataIndex: 'rekapitulasi',
				width: 70
        	}
        ]
    });
	var store = new Ext.data.Store({
		id: 'ArDataStore',
		proxy: new Ext.data.HttpProxy({
			url: '/transaction/ar/json_listing'
		}),
		baseParams:{task: "LISTING"},
		reader: new Ext.data.JsonReader({
			root: 'data',
			totalProperty: 'total'
		},[ 
			{name: 'recno', type: 'string'},
			{name: 'noreff', type: 'string'},
			{name: 'noinvoice', type: 'string'},
			{name: 'tglfaktur', type: 'string'},
			{name: 'gic_cust_name', type: 'string'},
			{name: 'pajak', type: 'string'},
			{name: 'transaction', type: 'string'},
			{name: 'jmldisc', type: 'string'},
			{name: 'jmlppn_valas', type: 'float'},
			{name: 'jmlppn', type: 'float'},
			{name: 'jmltotal', type: 'string'},
			{name: 'gic_currencies_code', type: 'string'},
			{name: 'gic_currencies_value', type: 'string'},
			{name: 'termrcv', type: 'string'},
			{name: 'jmlrcv', type: 'string'},
			{name: 'saldo', type: 'string'}
		])
	});
	var storeInvoice = new Ext.data.Store({
		id: 'InvoiceDataStore',
		proxy: new Ext.data.HttpProxy({
			url: '/transaction/ar/json_listing_ar_invoice'
		}),
		baseParams:{task: "LISTING"},
		reader: new Ext.data.JsonReader({
			root: 'data',
			totalProperty: 'total'
		},[ 
			{name: 'recno', type: 'string'},
			{name: 'noinvoice', type: 'string'},
			{name: 'tglfaktur', type: 'string'},
			{name: 'gic_cust_name', type: 'string'},
			{name: 'pajak', type: 'string'},
			{name: 'transaction', type: 'string'},
			{name: 'jmldisc', type: 'string'},
			{name: 'jmlppn_valas', type: 'string'},
			{name: 'jmlppn', type: 'float'},
			{name: 'jmltotal', type: 'float'},
			{name: 'gic_currencies_code', type: 'string'},
			{name: 'gic_currencies_value', type: 'string'},
			{name: 'termrcv', type: 'string'},
			{name: 'jmlrcv', type: 'string'},
			{name: 'rekapitulasi', type: 'string'}
		])
	});
	var storeKwitansi = new Ext.data.GroupingStore({
		id: 'KwitansiDataStore',
		proxy: new Ext.data.HttpProxy({
			url: '/transaction/ar/json_listing_ar_kwitansi'
		}),
		baseParams:{task: "LISTING"},
		reader: new Ext.data.JsonReader({
			root: 'data',
			totalProperty: 'total'
		},[ 
			{name: 'gic_kwitansi_id', type: 'string'},
			{name: 'gic_kwitansi_no', type: 'string'},
			{name: 'gic_cust_name', type: 'string'},
			{name: 'noinvoice', type: 'string'},
			{name: 'tglfaktur', type: 'date', dateFormat: 'Y-m-d'},
			{name: 'pajak', type: 'string'},
			{name: 'transaction', type: 'string'},
			{name: 'jmldisc', type: 'string'},
			{name: 'jmlppn_valas', type: 'float'},
			{name: 'jmlppn', type: 'float'},
			{name: 'jmltotal', type: 'string'},
			{name: 'gic_currencies_code', type: 'string'},
			{name: 'gic_currencies_value', type: 'string'},
			{name: 'termrcv', type: 'string'},
			{name: 'jmlrcv', type: 'string'},
			{name: 'rekapitulasi', type: 'string'}
		]),
		sortInfo: {field: 'gic_kwitansi_no', direction: 'ASC'},
		groupField: 'gic_kwitansi_no'
	});
    var grid = new Ext.grid.EditorGridPanel({
        store: store,
        cm: cm,
		height: 500,
        iconCls: 'mygrid',
        frame: true,
        loadMask:true,
		selModel: new Ext.grid.RowSelectionModel({ singleSelect:false }),
        tbar: [
        {
			xtype: "combo",
			transform: 'gic_cust_code',
			cls: 'mycombo',
			triggerAction:'all',
			editable: false,
            listeners: {
                change: function(combo, newValue, oldValue){
                	store.setBaseParam('gic_cust_code',newValue);
					store.load();
                }
            }
        },{
        	text: 'New AR',
        	iconCls: 'add',
        	handler: function()
        	{
				document.location.replace('/transaction/ar/newar');
        	}
        },{
			text: 'Edit AR',
        	iconCls: 'edit',
			handler : editCheck,
			params:{act:'EDIT'}
        },{
        	text: 'Export to Excel',
        	iconCls: 'excel',
        	handler: function()
        	{
				open('/transaction/ar/export_excel');
        	}
        },{
			text: 'Print Voucher',
			iconCls: 'print',
			handler: function()
			{
				var selections = grid.selModel.getSelections();
				for(i = 0; i< grid.selModel.getCount(); i++){
					var recno = selections[i].json.recno;
					var noreff = selections[i].json.noreff;
				}
				if (selections.length <= 0 || selections.length > 1) Ext.MessageBox.alert('Message', 'Please select at least one item to print!');
				else open('/transaction/ar/print_voucher/'+recno+'/'+noreff);
			}
        }],
        bbar: new Ext.PagingToolbar({
            pageSize: 100,
            store: store,
            displayInfo: true,
            displayMsg: 'Displaying result {0} - {1} of {2}',
            emptyMsg: "No result"
        })
    });
    var gridInvoice = new Ext.grid.EditorGridPanel({
        store: storeInvoice,
        cm: cmInvoice,
		height: 500,
        iconCls: 'mygrid',
        frame: true,
        loadMask:true,
		selModel: new Ext.grid.RowSelectionModel({ singleSelect:false }),
        tbar: [{
			text: 'Recapitulation',
			tooltip: 'Recapitulation to make kwitansi',
			iconCls: 'locked',
			handler : recapitulationCheck,
			params:{act:'RECAPITULATION'}
        }],
        bbar: new Ext.PagingToolbar({
            pageSize: 100,
            store: storeInvoice,
            displayInfo: true,
            displayMsg: 'Displaying result {0} - {1} of {2}',
            emptyMsg: "No result"
        })
    });
    var gridKwitansi = new Ext.grid.EditorGridPanel({
        store: storeKwitansi,
        cm: cmKwitansi,
		height: 500,
        iconCls: 'mygrid',
        frame: true,
        loadMask:true,
		selModel: new Ext.grid.RowSelectionModel({ singleSelect:false }),
        animCollapse: false,
        view: new Ext.grid.GroupingView({
			forceFit:true,
			showGroupName:false,
			enableNoGroups:false,
			enableGroupingMenu:false,
			hideGroupedColumn:true,
			groupTextTpl: 'Kwitansi: {text} ({[values.rs.length]} {[values.rs.length > 1 ? "Invoices" : "Invoice"]})'
        }),
        tbar: [{
			text: 'Unrecapitulation',
			tooltip: 'Will be remove kwitansi',
			iconCls: 'unlock',
			handler : recapitulationCheck,
			params:{act:'UNRECAPITULATION'}
        },{
			text: 'Print Kwitansi',
			iconCls: 'print',
			handler: function()
			{
				var selections = gridKwitansi.selModel.getSelections();
				for(i = 0; i< gridKwitansi.selModel.getCount(); i++){
					var gic_kwitansi_no = selections[i].json.gic_kwitansi_no;
				}
				if (selections.length <= 0 || selections.length > 1) Ext.MessageBox.alert('Message', 'Please select at least one item to print!');
				else open('/transaction/ar/print_kwitansi/'+gic_kwitansi_no);
			}
        }],
        bbar: new Ext.PagingToolbar({
            pageSize: 100,
            store: storeInvoice,
            displayInfo: true,
            displayMsg: 'Displaying result {0} - {1} of {2}',
            emptyMsg: "No result"
        })
    });
	store.load({params:{start:0, limit:100}});

    var tabs = new Ext.TabPanel({
        renderTo: 'transaction',
        activeTab: 0,
        frame:true,
        defaults:{autoHeight: true},
        items:[
            {id: 'tabAr', title: 'Account Receivable (A/R)', items:grid},
            {id: 'tabInvoice', title: 'List Invoice', items:gridInvoice, handler:function(){alert('xxx');}},
            {id: 'tabKwitansi', title: 'List Kwitansi', items:gridKwitansi}
        ],
		listeners: {
        	'tabchange': function(tabPanel, tab){
            	if(tab.id=='tabInvoice') storeInvoice.load({params:{start:0, limit:100}});
            	if(tab.id=='tabKwitansi') storeKwitansi.load({params:{start:0, limit:100}});
			}
        }
    });


});