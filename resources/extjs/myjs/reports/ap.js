Ext.onReady(function(){
	Ext.QuickTips.init();

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
                header: 'RO Number',
                dataIndex: 'noro',
                width: 70
            }, {
                header: 'Invoice Date',
                dataIndex: 'tglfaktur',
                renderer: formatDate,
                width: 70
            }, {
                header: 'Suplier',
                dataIndex: 'gic_supl_name',
                width: 144
            }, {
                header: 'Pajak',
                dataIndex: 'pajak',
                width: 70
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
                dataIndex: 'termpayment',
                width: 44,
                align: 'right'
            }, {
                header: 'Payment',
                dataIndex: 'jmlpayment',
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
		proxy: new Ext.data.HttpProxy({
			url: '/reports/ap/json_listing'
		}),
		baseParams:{task: "LISTING"},
		reader: new Ext.data.JsonReader({
			root: 'data',
			totalProperty: 'total'
		},[ 
			{name: 'recno', type: 'string'},
			{name: 'noro', type: 'string'},
			{name: 'tglfaktur', type: 'date', dateFormat:'Y-m-d'},
			{name: 'gic_supl_name', type: 'string'},
			{name: 'pajak', type: 'string'},
			{name: 'jmldisc', type: 'string'},
			{name: 'jmlppn', type: 'string'},
			{name: 'jmltotal', type: 'string'},
			{name: 'gic_currencies_code', type: 'string'},
			{name: 'gic_currencies_value', type: 'string'},
			{name: 'termpayment', type: 'string'},
			{name: 'jmlpayment', type: 'string'},
			{name: 'saldo', type: 'string'}
		])
	});
    var grid = new Ext.grid.EditorGridPanel({
        store: store,
        cm: cm,
        title: 'Account Payable (A/P)',
		renderTo: 'transaction',
		height: 500,
        iconCls: 'mygrid',
        frame: true,
        loadMask:true,
		selModel: new Ext.grid.RowSelectionModel({ singleSelect:false }),
        tbar: [
        {
			xtype: "combo",
			transform: 'gic_supl_code',
			cls: 'mycombo',
			triggerAction:'all',
			editable: false,
            listeners: {
                change: function(combo, newValue, oldValue){
                	store.setBaseParam('gic_supl_code',newValue);
					store.load();
                }
            }
        }],
        bbar: new Ext.PagingToolbar({
            pageSize: 50,
            store: store,
            displayInfo: true,
            displayMsg: 'Displaying result {0} - {1} of {2}',
            emptyMsg: "No result"
        })
    });
	store.load({params:{start:0, limit:50}});
});