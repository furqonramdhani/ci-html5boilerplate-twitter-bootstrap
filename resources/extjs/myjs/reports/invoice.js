var store;
Ext.onReady(function(){

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
                header: 'PO Number',
                dataIndex: 'nomor_po',
                width: 100
            }, {
                header: 'Code Notes',
                dataIndex: 'keterangan_kode',
                width: 144
            }, {
                header: 'Invoice Date',
                dataIndex: 'tglfaktur',
                width: 80
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
                dataIndex: 'jmltrans',
                width: 70,
                align: 'right'
            }, {
                header: 'Disc',
                dataIndex: 'jmldisc',
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
                header: 'Currencies',
                dataIndex: 'gic_currencies_code',
                width: 70
            }, {
                header: 'Rate',
                dataIndex: 'gic_currencies_value',
                width: 90,
                align: 'right'
            }, {
        		header: 'Posted', dataIndex: 'posting',
				width: 44
        	}
        ]
    });

	store = new Ext.data.Store({
		id: 'OrionDataStore',
		proxy: new Ext.data.HttpProxy({
			url: '/reports/invoice/json_listing'
		}),
		baseParams:{task: "LISTING"},
		reader: new Ext.data.JsonReader({
			root: 'data',
			totalProperty: 'total'
		},[ 
			{name: 'recno', type: 'string'},
			{name: 'noinvoice', type: 'string'},
			{name: 'nomor_po', type: 'string'},
			{name: 'keterangan_kode', type: 'string'},
			{name: 'tglfaktur', type: 'string'},
			{name: 'gic_cust_name', type: 'string'},
			{name: 'pajak', type: 'string'},
			{name: 'jmltrans', type: 'string'},
			{name: 'jmldisc', type: 'string'},
			{name: 'jmlppn', type: 'string'},
			{name: 'jmltotal', type: 'string'},
			{name: 'gic_currencies_code', type: 'string'},
			{name: 'gic_currencies_value', type: 'string'},
			{name: 'posting', type: 'string'},
		])
	});

    var grid = new Ext.grid.EditorGridPanel({
        store: store,
        cm: cm,
        renderTo: 'transaction',
        height: 500,
        title: 'Sales Invoice',
        iconCls: 'mygrid',
        frame: true,
        loadMask:true,
		selModel: new Ext.grid.RowSelectionModel({ singleSelect:false }),
        tbar: [
        {
        	text: 'Export to Excel',
        	iconCls: 'excel',
        	handler: function()
        	{
				open('/transaction/invoice/export_excel');
        	}
        },{
			text: 'Print Faktur',
			iconCls: 'print',
			handler: function()
			{
				var selections = grid.selModel.getSelections();
				for(i = 0; i< grid.selModel.getCount(); i++){
					var recno = selections[i].json.recno;
					var noinvoice = selections[i].json.noinvoice;
				}
				if (selections.length <= 0 || selections.length > 1) Ext.MessageBox.alert('Message', 'Please select at least one item to print!');
				else open('/transaction/invoice/print_faktur/'+recno+'/'+noinvoice);
			}
        },{
			text: 'Print Surat Jalan',
			iconCls: 'print',
			handler: function()
			{
				var selections = grid.selModel.getSelections();
				for(i = 0; i< grid.selModel.getCount(); i++){
					var recno = selections[i].json.recno;
					var noinvoice = selections[i].json.noinvoice;
				}
				if (selections.length <= 0 || selections.length > 1) Ext.MessageBox.alert('Message', 'Please select at least one item to print!');
				else open('/transaction/invoice/print_sj/'+recno+'/'+noinvoice);
			}
        },{
			text: 'Print Voucher',
			iconCls: 'print',
			handler: function()
			{
				var selections = grid.selModel.getSelections();
				for(i = 0; i< grid.selModel.getCount(); i++){
					var recno = selections[i].json.recno;
					var noinvoice = selections[i].json.noinvoice;
				}
				if (selections.length <= 0 || selections.length > 1) Ext.MessageBox.alert('Message', 'Please select at least one item to print!');
				else open('/transaction/invoice/print_voucher/'+recno+'/'+noinvoice);
			}
        },{
			text: 'Print Faktur Pajak Standard',
			iconCls: 'print',
			handler: function()
			{
				var selections = grid.selModel.getSelections();
				for(i = 0; i< grid.selModel.getCount(); i++){
					var recno = selections[i].json.recno;
					var noinvoice = selections[i].json.noinvoice;
				}
				if (selections.length <= 0 || selections.length > 1) Ext.MessageBox.alert('Message', 'Please select at least one item to print!');
				else open('/transaction/invoice/print_faktur_pajak_standard/'+recno+'/'+noinvoice);
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

	store.load({params:{start:0, limit:100}});
});