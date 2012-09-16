Ext.onReady(function(){
	Ext.QuickTips.init();

    function editCheck(options){
        var error = false;
        var m = grid.selModel.getSelections();
        var noreff;

		for(i = 0; i< grid.selModel.getCount(); i++){
			noreff = m[i].json.noreff;
		}
		if (error)
		{
			if (error==1) Ext.MessageBox.alert('Message', 'The record of data is disabled edit!');
		} else {
	        if(m.length == 1) document.location.replace('/transaction/cashbank_ap/editcashbank/'+noreff);
	        else Ext.MessageBox.alert('Message', 'Please select at least one item to edit!');
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
                header: 'Date',
                dataIndex: 'tgljurnal',
                renderer: formatDate,
                width: 70
            }, {
                header: 'No Reff',
                dataIndex: 'noreff',
                width: 100
            }, {
                header: 'No Account',
                dataIndex: 'noaccount',
                width: 100
            }, {
                header: 'No Cheque',
                dataIndex: 'nocheque',
                width: 100
            }, {
                header: 'Memo',
                dataIndex: 'memo',
                width: 200
            }, {
                header: 'Debet',
                dataIndex: 'debet',
                width: 70,
                align: 'right'
            }, {
                header: 'Kredit',
                dataIndex: 'kredit',
                width: 70,
                align: 'right'
            }, {
                header: 'Currency',
                dataIndex: 'gic_currencies_code',
                width: 70
            }, {
                header: 'Rate',
                dataIndex: 'gic_currencies_value',
                width: 70,
                align: 'right'
            }
        ]
    });
	var store = new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url: '/transaction/cashbank_ap/json_listing'
		}),
		baseParams:{task: "LISTING"},
		reader: new Ext.data.JsonReader({
			root: 'data',
			totalProperty: 'total'
		},[ 
			{name: 'recno', type: 'string'},
			{name: 'tgljurnal', type: 'date', dateFormat:'Y-m-d'},
			{name: 'noreff', type: 'string'},
			{name: 'noaccount', type: 'string'},
			{name: 'nocheque', type: 'string'},
			{name: 'memo', type: 'string'},
			{name: 'debet', type: 'float'},
			{name: 'kredit', type: 'float'},
			{name: 'gic_currencies_code', type: 'string'},
			{name: 'gic_currencies_value', type: 'string'}
		])
	});
    var grid = new Ext.grid.EditorGridPanel({
        store: store,
        cm: cm,
        title: 'Cash/Bank AP (Pembayaran Lainnya)',
		renderTo: 'transaction',
		height: 500,
        iconCls: 'mygrid',
        frame: true,
        loadMask:true,
		selModel: new Ext.grid.RowSelectionModel({ singleSelect:false }),
        tbar: [
        {
        	text: 'Add New',
        	iconCls: 'add',
        	handler: function()
        	{
				document.location.replace('/transaction/cashbank_ap/newcashbank');
        	}
        },{
			text: 'Edit',
        	iconCls: 'edit',
			handler : editCheck,
			params:{act:'EDIT'}
        },{
        	text: 'Export to Excel',
        	iconCls: 'excel',
        	handler: function()
        	{
				open('/transaction/cashbank_ap/export_excel');
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