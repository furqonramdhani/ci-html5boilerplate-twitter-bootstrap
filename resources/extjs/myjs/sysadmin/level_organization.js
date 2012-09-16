var store;
var grid;
var orgCreateWindow;
var OrgName;
var GroupCode;

Ext.onReady(function(){

	OrgName = new Ext.form.TextField({
	    id: 'OrgName',
	    fieldLabel: 'Name',
	    maxLength: 20,
	    allowBlank: false,
	    anchor : '95%',
	    maskRe: /([a-zA-Z0-9\s]+)$/
	});
	GroupCode = new Ext.form.ComboBox({
		id:'GroupCode',
		fieldLabel: 'Group',
		mode: 'local',
		anchor:'95%',
		typeAhead:true,  
		triggerAction:'all',  
		lazyRender:true,
		allowBlank: false,
		transform:'sgroupcodenew'
	});
	orgCreateForm = new Ext.FormPanel({
		labelAlign: 'top',
		bodyStyle:'padding:5px',
		items: [{
			layout:'column',
			border:false,
			items:[{
				columnWidth:0.6,
				layout: 'form',
				border:false,
				items:[OrgName]
			}, {
				columnWidth:0.4,
				layout: 'form',
				border:false,
				items:[GroupCode]
			}]
		}],
		
		buttons: [{
			text: 'Save and Close',
			handler: createOrg
		},{
			text: 'Cancel',
			handler: function(){
				orgCreateWindow.hide();
			}
		}]
	});
	orgCreateWindow = new Ext.Window({
		id: 'orgCreateWindow',
		title: 'New Organization',
		closable:false,
		width: 340,
		height: 144,
		plain:true,
		layout: 'fit',
		iconCls: 'setup',
		items: orgCreateForm
	});
	function displayFormWindow(){
		if(!orgCreateWindow.isVisible()){
			resetOrgForm();
			orgCreateWindow.show();
		} else {
			orgCreateWindow.toFront();
		}
	}
	function resetOrgForm(){
		OrgName.setValue('');
		GroupCode.setValue('');
	}
	function createOrg(){
		if(isFormValid()){
			Ext.Ajax.request({   
				waitMsg: 'Please wait...',
				url: '/sysadmin/level_organization/orgaction',
				params: {
				task: "INSERT",
				org_name:	OrgName.getValue(),
				groupcode:	GroupCode.getValue()
			}, 
			success: function(response){              
				var result=eval(response.responseText);
				switch(result){
					case 1:
						Ext.MessageBox.alert('Creation OK','The new organization was created successfully.');
						store.reload();
						orgCreateWindow.hide();
					break;
					default:
						Ext.MessageBox.alert('Warning','Could not create the organization.');
					break;
				}
			},
			failure: function(response){
				var result=response.responseText;
				Ext.MessageBox.alert('error','could not connect to the database. retry later');	       
				}                      
			});
		} else {
			Ext.MessageBox.alert('Warning', 'Your Form is not valid!');
		}
	}

	function isFormValid(){ return(OrgName.isValid() && GroupCode.isValid()); }

	function updateOrg(oGrid_event){
		Ext.Ajax.request({
			waitMsg: 'Please wait...',
			url: '/sysadmin/level_organization/orgaction',
			params: {
				task: "UPDATE",
				org_id:		oGrid_event.record.data.org_id,
				org_name:	oGrid_event.record.data.org_name,
				groupcode:	oGrid_event.record.data.groupcode
			}, 
			success: function(response){
				var result=eval(response.responseText);
				switch(result){
				case 1:
					store.reload();
				break;
				default:
					Ext.MessageBox.alert('Eerror message:','We couldn\'t change this data..');
				break;
				}
			},
			failure: function(response){
				var result=response.responseText;
				Ext.MessageBox.alert('Error:','could not connect to the database. retry later');		
			}
		});
	}

    var fm = Ext.form;
    var cm = new Ext.grid.ColumnModel({
        defaults: {
            sortable: true
        },
        columns: [
        	{
        		header: 'Org id',
        		dataIndex: 'org_id',
        		hidden: true
        	}, {
                header: 'Organization',
                dataIndex: 'org_name',
                width: 300,
                editor: new fm.TextField({
                    allowBlank: false
                })
            }, {
                header: 'Group',
                dataIndex: 'groupcode',
                width: 144,
                editor: new fm.ComboBox({
                    typeAhead: true,
                    triggerAction: 'all',
                    transform: 'sgroupcode',
                    lazyRender: true,
                    listClass: 'x-combo-list-small'
                })
            }
        ]
    });

	store = new Ext.data.Store({
		id: 'UsersDataStore',
		proxy: new Ext.data.HttpProxy({
		        url: '/sysadmin/level_organization/json_listing_org', 
		        method: 'POST'
		    }),
		baseParams:{task: "LISTING"},
		reader: new Ext.data.JsonReader({
			root: 'data',
			totalProperty: 'total'
		},[ 
			{name: 'org_id', type: 'int'},
			{name: 'org_name', type: 'string'},
			{name: 'groupcode', type: 'string'}
		]),
		sortInfo:{field: 'org_name', direction: "ASC"}
    });


    var grid = new Ext.grid.EditorGridPanel({
        store: store,
        cm: cm,
        renderTo: 'orglist',
        height: 400,
        title: 'Level Organization',
        iconCls: 'setup',
        frame: true,
        clicksToEdit: 1,
        selModel: new Ext.grid.RowSelectionModel({singleSelect:false}),
        tbar: [{
            text: 'Add Organization',
            iconCls: 'add',
            handler : displayFormWindow
        }]
    });

	store.load();
	grid.on('afteredit', updateOrg);
});