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
			if (!selections[i].get('memo')) return false;
		}

		if (jmldebet!=jmlkredit)
		{
			return false;
		}
		if (grid.store.getCount() < 1) return false;

		return(jurnaldate.isValid() && pajak.isValid() && keterangan.isValid());
	}
	function insertCB(){
		if(isFormValid()){
			var selections = grid.selModel.getSelections();

			var arr_noaccount			= [];
			var arr_jmldebet			= [];
			var arr_jmlkredit			= [];
			var arr_memo				= [];

			for(i = 0; i< grid.selModel.getCount(); i++){
				arr_noaccount.push(selections[i].get('noaccount'));
				arr_jmldebet.push(selections[i].get('jmldebet'));
				arr_jmlkredit.push(selections[i].get('jmlkredit'));
				arr_memo.push(selections[i].get('memo'));
			}

			var encoded_noaccount	= Ext.encode(arr_noaccount);
			var encoded_jmldebet	= Ext.encode(arr_jmldebet);
			var encoded_jmlkredit	= Ext.encode(arr_jmlkredit);
			var encoded_memo		= Ext.encode(arr_memo);

			Ext.Ajax.request({
				waitMsg: 'Please wait...',
				url: '/transaction/cashbank_ap/action',
				params: {
					task: "INSERT",
					jurnaldate:		jurnaldate.getValue(),
					pajak:			pajak.getValue(),
					cheque_number:	cheque_number.getValue(),
					cheque_date:	cheque_date.getValue(),
					gic_currencies_code:	currencies.getValue(),
					keterangan:		keterangan.getValue(),
					noaccount:		encoded_noaccount,
					jmldebet:		encoded_jmldebet,
					jmlkredit:		encoded_jmlkredit,
					memo:			encoded_memo
				},
				success: function(response){
					var result=eval(response.responseText);
					switch(result){
						case 1:
							document.location.replace('/transaction/cashbank_ap');
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
	var cheque_number = new Ext.form.TextField({
	    id: 'cheque_number',
	    fieldLabel: 'Cheque Number',
	    maxLength: 20,
	    allowBlank: false
	});
	var cheque_date = new Ext.form.DateField({
		id: 'cheque_date',
    	fieldLabel: 'Cheque Date',
        format: 'd/m/Y',
        minValue: '01/01/1950',
        allowBlank: false,
        disabledDaysText: 'Plants are not available on the weekends'
	});
	var currencies = new Ext.form.ComboBox({
    	fieldLabel: 'Currency',
        typeAhead: true,
        triggerAction: 'all',
        transform: 'gic_currencies_code',
        editable: true,
        allowBlank: false,
        lazyRender: true,
        listClass: 'x-combo-list-small'
	});
    var master = new Ext.FormPanel({
        labelWidth: 100,
        frame:true,
        title: 'Form Cash/Bank AP (Pembayaran Lainnya)',
        bodyStyle:'padding:5px 5px 0',
        items: [{
			layout:'column',
			border:false,
			items:[{
				columnWidth:0.3,
				layout: 'form',
				border:false,
				items:[jurnaldate,pajak,cheque_number,cheque_date]
			}, {
				columnWidth:0.7,
				layout: 'form',
				border:false,
				items:[currencies,keterangan]
			}]
        }]
    });
    master.render('master');

	function formatDate(value){
        return value ? value.dateFormat('d/m/Y') : '';
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
                editor: new fm.TextField({ allowBlank: false })
            }, {
                header: 'Kredit',
                dataIndex: 'jmlkredit',
                width: 100,
                align: 'right',
                summaryType:'sum',
                editor: new fm.TextField({ allowBlank: false })
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
			url: '/transaction/cashbank'
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
        title: 'Cash/Bank Detail',
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
					insertCB();
	        	}
	        }
        ]
    });
	var Details = Ext.data.Record.create([{
		name: 'noaccount',
		name: 'jmldebet',
		name: 'jmlkredit'
	}]);
	store.load({params:{start:0, limit:100}});
});