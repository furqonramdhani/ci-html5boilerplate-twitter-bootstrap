var store;
var rtn;
Ext.onReady(function(){

	function isFormValid(){
		//Select All
		var selArr = new Array();
		var data = grid.selModel;
		for(i=0;i<grid.store.getCount();i++)
		{
			selArr.push(i);
		}
		grid.getSelectionModel().selectRows(selArr);
		//End select all

		jmldebet = 0;
		jmlkredit = 0;
		var selections = grid.selModel.getSelections();
		for(i = 0; i< grid.selModel.getCount(); i++){
			jmldebet	+= parseFloat(selections[i].get('jmldebet'));
			jmlkredit	+= parseFloat(selections[i].get('jmlkredit'));
		}

		if (jmldebet!=jmlkredit)
		{
			return false;
		}
		return(jurnaldate.isValid() && pajak.isValid() && keterangan.isValid());
	}
	function insertGJ(){
		if(isFormValid()){
			var selections = grid.selModel.getSelections();

			var arr_noaccount			= [];
			var arr_jmldebet			= [];
			var arr_jmlkredit			= [];
			var arr_gic_currencies_code = [];
			var arr_memo				= [];

			for(i = 0; i< grid.selModel.getCount(); i++){
				arr_noaccount.push(selections[i].get('noaccount'));
				arr_jmldebet.push(selections[i].get('jmldebet'));
				arr_jmlkredit.push(selections[i].get('jmlkredit'));
				arr_gic_currencies_code.push(selections[i].get('gic_currencies_code'));
				arr_memo.push(selections[i].get('memo'));
			}

			var encoded_noaccount	= Ext.encode(arr_noaccount);
			var encoded_jmldebet	= Ext.encode(arr_jmldebet);
			var encoded_jmlkredit	= Ext.encode(arr_jmlkredit);
			var encoded_gic_currencies_code	= Ext.encode(arr_gic_currencies_code);
			var encoded_memo		= Ext.encode(arr_memo);

			Ext.Ajax.request({
				waitMsg: 'Please wait...',
				url: '/transaction/general_jurnal/action',
				params: {
					task: "INSERT",
					jurnaldate:		jurnaldate.getValue(),
					pajak:			pajak.getValue(),
					keterangan:		keterangan.getValue(),
					noaccount:		encoded_noaccount,
					jmldebet:		encoded_jmldebet,
					jmlkredit:		encoded_jmlkredit,
					gic_currencies_code:		encoded_gic_currencies_code,
					memo:			encoded_memo
				},
				success: function(response){
					var result=eval(response.responseText);
					switch(result){
						case 1:
							document.location.replace('/transaction/general_jurnal');
						break;
						default:
							Ext.MessageBox.alert('Warning','Could not create jurnal.');
						break;
					}
				},
				failure: function(response){
					var result=response.responseText;
					Ext.MessageBox.alert('error','Could not connect to the database. Retry later');
				}
			});
		} else {
			Ext.MessageBox.alert('Warning', 'Your Form is not valid or debet and kredit did not match');
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

	var jurnaldate = new Ext.form.DateField({
    	fieldLabel: 'Jurnal Date',
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
	var keterangan = new Ext.form.TextArea({
        fieldLabel: 'Remarks',
        width:300
	});
    var master = new Ext.FormPanel({
        labelWidth: 100,
        frame:true,
        title: 'General Jurnal Form',
        bodyStyle:'padding:5px 5px 0',
        items: [{
			layout:'column',
			border:false,
			items:[{
				columnWidth:0.3,
				layout: 'form',
				border:false,
				items:[jurnaldate,pajak]
			}, {
				columnWidth:0.7,
				layout: 'form',
				border:false,
				items:[keterangan]
			}]
        }]
    });
    master.render('master');

	function formatDate(value){
        return value ? value.dateFormat('M d, Y') : '';
    }

    var fm = Ext.form;
    var cm = new Ext.grid.ColumnModel({
        defaults: { sortable: true },
        columns: [
        	{
                header: 'COA',
                dataIndex: 'noaccount',
                width: 244,
				editor: new fm.ComboBox({
                    typeAhead: true,
                    triggerAction: 'all',
                    transform: 'noaccount',
                    editable: true,
                    allowBlank: false,
                    lazyRender: true,
                    listClass: 'x-combo-list-small'
                })
            }, {
                header: 'Debet',
                dataIndex: 'jmldebet',
                width: 100,
                align: 'right',
                summaryType:'sum',
                editor: new fm.TextField({ allowBlank: false, maskRe: /[+0-9+.]/ })
            }, {
                header: 'Kredit',
                dataIndex: 'jmlkredit',
                width: 100,
                align: 'right',
                summaryType:'sum',
                editor: new fm.TextField({ allowBlank: false, maskRe: /[+0-9+.]/ })
            }, {
                header: 'Currency',
                dataIndex: 'gic_currencies_code',
                width: 144,
				editor: new fm.ComboBox({
                    typeAhead: true,
                    triggerAction: 'all',
                    transform: 'currencies_code',
                    editable: true,
                    allowBlank: false,
                    lazyRender: true,
                    listClass: 'x-combo-list-small'
                })
            }, {
                header: 'Memo',
                dataIndex: 'memo',
                width: 200,
                editor: new fm.TextField({ allowBlank: false })
            }
        ]
    });

	store = new Ext.data.Store({
		id: 'listinvoice',
		proxy: new Ext.data.HttpProxy({
			url: '/transaction/general_jurnal'
		}),
		baseParams:{task: "LISTING"},
		reader: new Ext.data.JsonReader({
			root: 'data',
			totalProperty: 'total'
		},[
			{name: 'recno', type: 'string'},
			{name: 'noaccount', type: 'string'},
			{name: 'jmldebet', type: 'float'},
			{name: 'jmlkredit', type: 'float'},
			{name: 'gic_currencies_code', type: 'string'},
			{name: 'memo', type: 'string'}
		])
	});

	var summary = new Ext.ux.grid.GridSummary();

    var grid = new Ext.grid.EditorGridPanel({
        store: store,
        cm: cm,
        renderTo: 'details',
        height: 240,
        title: 'General Jurnal Detail',
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
					    noaccount: 'Select Account Number',
					    jmldebet: 0,
					    jmlkredit: 0
					}));
	        	}
	        },{
	            text: 'Remove',
	            iconCls: 'drop',
	            handler : delCheck
        	}, {
	        	text: 'Save',
	        	iconCls: 'save',
	        	handler: function()
	        	{
					insertGJ();
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
});