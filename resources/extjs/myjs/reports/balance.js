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
                header: 'Account',
                dataIndex: 'noaccount',
                width: 70
            }, {
                header: 'Account Name',
                dataIndex: 'gic_nmakun',
                width: 111,
                summaryType: 'count',
                summaryRenderer: function(v, params, data){
                    return 'Total('+v+'):';
                }
            }, {
                header: 'Group',
                dataIndex: 'gic_group_coa',
                width: 50
            }, {
                header: 'Saldo Awal',
                dataIndex: 'saldo_awal',
                width: 70,
                align: 'right'
            }, {
                header: 'No',
                dataIndex: 'no',
                width: 30
            }, {
                header: 'Date',
                dataIndex: 'tgljurnal',
                renderer: formatDate,
                width: 70
            }, {
                header: 'Pajak',
                dataIndex: 'pajak',
                width: 40
            }, {
                header: 'NoReff',
                dataIndex: 'noreff',
                width: 70
            }, {
                header: 'Keterangan',
                dataIndex: 'keterangan',
                width: 244
            }, {
                header: 'Debet',
                dataIndex: 'jmldebet',
                width: 70,
                align: 'right',
                summaryType:'sum'
            }, {
                header: 'Kredit',
                dataIndex: 'jmlkredit',
                width: 70,
                align: 'right',
                summaryType:'sum'
            }, {
                header: 'Saldo',
                dataIndex: 'saldo',
                width: 70,
                align: 'right'
            }
        ]
    });
	var store = new Ext.data.GroupingStore({
		proxy: new Ext.data.HttpProxy({
			url: '/reports/balance/json_listing'
		}),
		baseParams:{task: "LISTING"},
		reader: new Ext.data.JsonReader({
			root: 'data',
			totalProperty: 'total'
		},[ 
			{name: 'recno', type: 'string'},
			{name: 'noaccount', type: 'string'},
			{name: 'gic_nmakun', type: 'string'},
			{name: 'gic_group_coa', type: 'string'},
			{name: 'saldo_awal', type: 'string'},
			{name: 'no', type: 'string'},
			{name: 'tgljurnal', type: 'date', dateFormat:'Y-m-d'},
			{name: 'pajak', type: 'string'},
			{name: 'noreff', type: 'string'},
			{name: 'keterangan', type: 'string'},
			{name: 'jmldebet', type: 'float'},
			{name: 'jmlkredit', type: 'float'},
			{name: 'saldo', type: 'float'}
		]),
		sortInfo: {field: 'gic_group_coa', direction: 'ASC'},
		groupField: 'gic_group_coa'
	});

	var summary = new Ext.ux.grid.GroupSummary();
    var grid = new Ext.grid.EditorGridPanel({
        store: store,
        cm: cm,
        renderTo: 'transaction',
        title: 'Balance',
		height: 500,
        iconCls: 'mygrid',
        frame: true,
        loadMask:true,
		selModel: new Ext.grid.RowSelectionModel({ singleSelect:false }),
		plugins: summary,
        view: new Ext.grid.GroupingView({
			forceFit:true,
			showGroupName:false,
			enableNoGroups:false,
			enableGroupingMenu:false,
			hideGroupedColumn:true,
			groupTextTpl: 'COA Group: {text} ({[values.rs.length]} {[values.rs.length > 1 ? "Rows" : "Row"]})'
        }),
        tbar: [{
			xtype: "combo",
			id: "combo_gic_noaccount",
			transform: 'gic_noaccount',
			cls: 'mycombo',
			triggerAction:'all',
			editable: true,
            listeners: {
                change: function(combo, newValue, oldValue)
                {
					var dateFrom = Ext.getCmp('dateFrom');
					var dateTo = Ext.getCmp('dateTo');

                	store.setBaseParam('gic_noaccount',newValue);
                	store.setBaseParam('datefrom',dateFrom.getValue());
                	store.setBaseParam('dateto',dateTo.getValue());
					store.load();
                }
            }
        },'Jurnal Date From:',{
        	xtype: "datefield",
        	id:'dateFrom',
			format: 'd/m/Y',
			listeners: {
				change: function(combo, newValue, oldValue)
				{
					var gicNoaccount = Ext.getCmp('combo_gic_noaccount');
					var dateTo = Ext.getCmp('dateTo');

                	store.setBaseParam('gic_noaccount',gicNoaccount.getValue());
                	store.setBaseParam('datefrom',newValue);
                	store.setBaseParam('dateto',dateTo.getValue());
					store.load();
				}
			}
        },'To:',{
			xtype:'datefield',
			id:'dateTo',
			format: 'd/m/Y',
			listeners: {
				change: function(combo, newValue, oldValue)
				{
					var gicNoaccount = Ext.getCmp('combo_gic_noaccount');
					var dateFrom = Ext.getCmp('dateFrom');

                	store.setBaseParam('gic_noaccount',gicNoaccount.getValue());
                	store.setBaseParam('datefrom',dateFrom.getValue());
                	store.setBaseParam('dateto',newValue);
					store.load();
				}
			}
        },{
        	text: 'Print this page',
        	iconCls: 'print',
        	handler: function()
        	{
        		Ext.ux.GridPrinter.print(grid);
        	}
        }],
        bbar: new Ext.PagingToolbar({
            pageSize: 500,
            store: store,
            displayInfo: true,
            displayMsg: 'Displaying result {0} - {1} of {2}',
            emptyMsg: "No result"
        })
    });

	store.load({params:{start:0, limit:500}});
});