var store;
Ext.onReady(function(){
    function editCheck(options){
        var error = false;
        var m = grid.selModel.getSelections();
        var recno;

		for(i = 0; i< grid.selModel.getCount(); i++){
			if (m[i].json.posting=='Yes') error = 1;
			recno = m[i].json.recno;
		}
		if (error)
		{
			if (error==1) Ext.MessageBox.alert('Message', 'The record of data is disabled edit!');
		} else {
	        if(m.length == 1) document.location.replace('/transaction/po/editpo/'+recno);
	        else Ext.MessageBox.alert('Message', 'Please select at least one item to edit!');
        }
    }
    function postingCheck(options){
        var error = false;
        var m = grid.selModel.getSelections();
        act = options.params.act;

		for(i = 0; i< grid.selModel.getCount(); i++){
			if (m[i].json.posting=='Yes' && act.toLowerCase()=='posting') error = 2;
			if (m[i].json.posting=='No' && act.toLowerCase()=='unposting') error = 3;
		}
		if (error)
		{
			if (error==2) Ext.MessageBox.alert('Message', 'The record of data is disabled posting!');
			if (error==3) Ext.MessageBox.alert('Message', 'The record of data is disabled unposting!');
		} else {
	        if(m.length > 0) Ext.MessageBox.confirm('Message', 'Do you really want to '+act.toLowerCase()+' it?' , doPosting);
	        else Ext.MessageBox.alert('Message', 'Please select at least one item to '+act.toLowerCase());
        }
    }
    function doPosting(btn)
	{
		if(btn == 'yes')
		{
			var selections = grid.selModel.getSelections();
			var prez = [];
			for(i = 0; i< grid.selModel.getCount(); i++){
				prez.push(selections[i].json.recno);
			}

			var encoded_array = Ext.encode(prez);
			Ext.Ajax.request({
				waitMsg: 'Please Wait',
				url: '/transaction/po/action',
				params: {
					task: act,
					row:  encoded_array
				},
				success: function(response){
					var result=eval(response.responseText);
					switch(result){
						case 1:
							store.reload();
						break;
						default:
							Ext.MessageBox.alert('Warning','Could not posting the entire selection.');
						break;
					}
				},
				failure: function(response){
					var result=response.responseText;
					Ext.MessageBox.alert('error','Could not connect to the database. retry later.');
				}
			});
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
                header: 'No PO',
                dataIndex: 'noinvoice',
                width: 100
            }, {
                header: 'PO Date',
                dataIndex: 'tglfaktur',
                width: 144
            }, {
                header: 'Supplier',
                dataIndex: 'gic_supl_name',
                width: 144
            }, {
                header: 'Pajak',
                dataIndex: 'pajak',
                width: 70
            }, {
                header: 'Transaction',
                dataIndex: 'jmltotal',
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
                header: 'Currencies',
                dataIndex: 'gic_currencies_code',
                width: 70
            }, {
                header: 'Curr Exchange',
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
			url: '/transaction/po/json_listing'
		}),
		baseParams:{task: "LISTING"},
		reader: new Ext.data.JsonReader({
			root: 'data',
			totalProperty: 'total'
		},[ 
			{name: 'recno', type: 'string'},
			{name: 'noinvoice', type: 'string'},
			{name: 'tglfaktur', type: 'string'},
			{name: 'gic_supl_name', type: 'string'},
			{name: 'pajak', type: 'string'},
			{name: 'jmltrans', type: 'string'},
			{name: 'jmldisc', type: 'string'},
			{name: 'jmlppn_valas', type: 'string'},
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
        title: 'Purchase Order (P/O)',
        iconCls: 'mygrid',
        frame: true,
        loadMask:true,
		selModel: new Ext.grid.RowSelectionModel({ singleSelect:false }),
        tbar: [
        {
        	text: 'New PO',
        	iconCls: 'add',
        	handler: function()
        	{
				document.location.replace('/transaction/po/newpo');
        	}
        },{
			text: 'Edit PO',
        	iconCls: 'edit',
			handler : editCheck,
			params:{act:'EDIT'}
        },{
        	text: 'Export to Excel',
        	iconCls: 'excel',
        	handler: function()
        	{
				open('/transaction/po/export_excel');
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
				else open('/transaction/po/print_faktur/'+recno+'/'+noinvoice);
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
				else open('/transaction/po/print_sj/'+recno+'/'+noinvoice);
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