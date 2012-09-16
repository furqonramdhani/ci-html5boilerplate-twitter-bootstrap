Ext.onReady(function(){
	Ext.QuickTips.init();

	var transaction = new Ext.form.ComboBox({
    	fieldLabel: 'Transaction',
        typeAhead: true,
        triggerAction: 'all',
        transform: 'ctransaction',
        editable: true,
        allowBlank: false,
        lazyRender: true,
        listClass: 'x-combo-list-small',
		listeners: {
			change: function(combo, newValue, oldValue){
				document.location.replace('/transaction/general_cashier/index/'+newValue);
			}
		}
	});

    var form = new Ext.FormPanel({
		labelWidth: 75,
		frame:true,
		tbar: ['Transaction:',transaction],
		title: 'General Cashier',
		bodyStyle:'padding:5px 5px 0',
		defaults: {width: 230},
		defaultType: 'textfield',
		renderTo: 'transaction_header'
	});
	//var tbar = form.getTopToolbar();
	//tbar.add('-','-'); //<- error fired here!
});
