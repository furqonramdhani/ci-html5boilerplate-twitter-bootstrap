var store;
Ext.onReady(function(){

    function editCheck(options){
        var error = false;
        var m = grid.selModel.getSelections();
        var noreff;

		for(i = 0; i< grid.selModel.getCount(); i++){
			if (m[i].json.posting=='Yes') error = 1;
			noreff = m[i].json.noreff;
		}
		if (error)
		{
			if (error==1) Ext.MessageBox.alert('Message', 'The record of data is disabled edit!');
		} else {
	        if(m.length == 1) document.location.replace('/transaction/general_jurnal/editgj/'+noreff);
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
                header: 'Jurnal Date',
                dataIndex: 'tgljurnal',
                renderer: formatDate,
                width: 70
            }, {
                header: 'No Reff',
                dataIndex: 'noreff',
                width: 70
            }, {
                header: 'No Account',
                dataIndex: 'noaccount',
                width: 70
            }, {
                header: 'Account',
                dataIndex: 'gic_nmakun',
                width: 200
            }, {
                header: 'Memo',
                dataIndex: 'memo',
                width: 200
            }, {
                header: 'Pajak',
                dataIndex: 'pajak',
                width: 70
            }, {
                header: 'Debet',
                dataIndex: 'jmldebet',
                width: 70,
                align: 'right'
            }, {
                header: 'Kredit',
                dataIndex: 'jmlkredit',
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
            }
        ]
    });

	store = new Ext.data.Store({
		id: 'OrionDataStore',
		proxy: new Ext.data.HttpProxy({
			url: '/transaction/general_jurnal/json_listing'
		}),
		baseParams:{task: "LISTING"},
		reader: new Ext.data.JsonReader({
			root: 'data',
			totalProperty: 'total'
		},[ 
			{name: 'recno', type: 'string'},
			{name: 'tgljurnal', type: 'date', dateFormat: 'Y-m-d'},
			{name: 'noreff', type: 'string'},
			{name: 'noaccount', type: 'string'},
			{name: 'gic_nmakun', type: 'string'},
			{name: 'memo', type: 'string'},
			{name: 'pajak', type: 'string'},
			{name: 'jmldebet', type: 'float'},
			{name: 'jmlkredit', type: 'float'},
			{name: 'gic_currencies_code', type: 'string'},
			{name: 'gic_currencies_value', type: 'string'}
		])
	});

    var grid = new Ext.grid.EditorGridPanel({
        store: store,
        cm: cm,
        renderTo: 'transaction',
        height: 500,
        title: 'General Jurnal',
        iconCls: 'mygrid',
        frame: true,
        loadMask:true,
		selModel: new Ext.grid.RowSelectionModel({ singleSelect:false }),
        tbar: [
        {
        	text: 'New General Jurnal',
        	iconCls: 'add',
        	handler: function()
        	{
				document.location.replace('/transaction/general_jurnal/newgeneral_jurnal');
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
				open('/transaction/general_jurnal/export_excel');
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
				else open('/transaction/general_jurnal/print_voucher/'+recno+'/'+noreff);
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