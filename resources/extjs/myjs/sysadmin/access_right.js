Ext.onReady(function(){

    Ext.QuickTips.init();
    Ext.form.Field.prototype.msgTarget = 'side';


	var myDsAvailable = new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
		        url: '/sysadmin/access_right/json_listing_menuavailable',
		        method: 'POST'
		    }),
		params:{org_id: "0"},
		reader: new Ext.data.JsonReader({
			id: 'modulecode',
			root: 'data'
		},
		[
			{name: 'modulecode', mapping: 'modulecode'},
			{name: 'modulename', mapping: 'modulename'}
		])
    });
    myDsAvailable.load();

	var myDsShowed = new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
		        url: '/sysadmin/access_right/json_listing_showed',
		        method: 'POST'
		    }),
		params:{org_id: "0"},
		reader: new Ext.data.JsonReader({
			id: 'modulecode',
			root: 'data'
		},
		[
			{name: 'modulecode', mapping: 'modulecode'},
			{name: 'modulename', mapping: 'modulename'}
		])
    });
    myDsShowed.load();


	var Org = new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url: '/sysadmin/access_right/json_listing_org'
		}),
		reader: new Ext.data.JsonReader({
			root: 'data',
			id: 'org_id'
		}, [ 'org_id', 'org_name']
		),
		remoteSort: false
	});

	var ComboGroupCode = new Ext.form.ComboBox({
		id:'ComboGroupCode',
		fieldLabel: 'Organization',
		editable: false,
		store:Org,
		valueField: 'org_id',
		displayField: 'org_name',
		allowBlank: false,
		anchor:'55%',
		triggerAction: 'all',
		listeners: {
			select: function(){
				OrgID = this.getValue();
				myDsAvailable.reload({params:{org_id: OrgID}});
				myDsShowed.reload({params:{org_id: OrgID}});
			}
		}
	});


    /*
     * Ext.ux.form.ItemSelector Example Code
     */
    var isForm = new Ext.form.FormPanel({
        title: 'Access Right',
		width: 700,
        bodyStyle: 'padding:10px;',
        renderTo: 'itemselector',
		items:[{
			xtype: 'itemselector',
			name: 'itemselector',
            fieldLabel: 'If you want to choose multiple, click Ctrl+click the menu, or Shift+click menu items',
	        imagePath: '/js/ext-3.0.3/resources/ux/images',
            multiselects: [{
                width: 250,
                height: 360,
                store: myDsAvailable,
				valueField:'modulecode',
		        displayField:'modulename'
            },{
                width: 250,
                height: 360,
                store: myDsShowed,
                valueField:'modulecode',
                displayField:'modulename',
                tbar:[{
                    text: 'Clear All',
                    handler:function(){
	                    isForm.getForm().findField('itemselector').reset();
	                }
                }]
            }]
        },ComboGroupCode],
		
        buttons: [{
            text: 'Save',
            handler: function(){
                if(isForm.getForm().isValid()){
	                /*
                	is = isForm.getForm().getValues(true);
                    Ext.Msg.alert('Submitted Values', 'The following will be sent to the server: <br />'+
                    	isForm.getForm().findField('itemselector').getValue()+ComboGroupCode.getValue());
	                */
					Ext.Ajax.request({   
						waitMsg: 'Please wait...',
						url: '/sysadmin/access_right/accessaction',
						params: {
							org_id:		ComboGroupCode.getValue(),
							menushowed:	isForm.getForm().findField('itemselector').getValue()
						},
						success: function(response){              
							var result=eval(response.responseText);
							switch(result){
								case 1:
									Ext.MessageBox.alert('Saved.','Menu item save is successfully.');
								break;
								default:
									Ext.MessageBox.alert('Warning','Could not save!');
								break;
							}
						},
						failure: function(response){
							var result=response.responseText;
							Ext.MessageBox.alert('error','could not connect to the database. retry later');	       
						}                      
					});
                }
            }
        }]
    });

});