Ext.onReady(function(){
	Ext.QuickTips.init();

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

	function formatDate(value){
        return value ? value.dateFormat('M d, Y') : '';
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
	var store = new Ext.data.Store({
		id: 'ArDataStore',
		proxy: new Ext.data.HttpProxy({
			url: '/reports/ar/json_listing'
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
			{name: 'jmlppn', type: 'string'},
			{name: 'jmltotal', type: 'string'},
			{name: 'gic_currencies_code', type: 'string'},
			{name: 'gic_currencies_value', type: 'string'},
			{name: 'termrcv', type: 'string'},
			{name: 'jmlrcv', type: 'string'},
			{name: 'saldo', type: 'string'}
		])
	});
    var grid = new Ext.grid.EditorGridPanel({
        store: store,
        cm: cm,
		renderTo: 'transaction',
		height: 500,
		title: 'Account Receive (A/R)',
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
        	text: 'Export to Excel',
        	iconCls: 'excel',
        	handler: function()
        	{
				open('/transaction/ar/export_excel');
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