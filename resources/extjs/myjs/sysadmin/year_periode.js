var store;
var grid;
var periodeCreateWindow;

var AluStartDate;
var AluEndDate;
var ActiveStatus;

Ext.onReady(function(){

	AluStartDate = new Ext.form.DateField({
		id:'AluStartDate',
		fieldLabel: 'Start date',
		format : 'm/d/Y',
		allowBlank: false,
		anchor:'95%'
	});
	AluEndDate = new Ext.form.DateField({
		id:'AluEndDate',
		fieldLabel: 'End date',
		format : 'm/d/Y',
		allowBlank: false,
		anchor:'95%'
	});
	ActiveStatus = new Ext.form.ComboBox({
		id:'ActiveStatus',
		fieldLabel: 'Active status',
		store:new Ext.data.SimpleStore({
		fields:['ActiveStatusValue', 'ActiveStatusName'],
			data: [['yes','yes'],['no','no']]
		}),
		mode: 'local',
		displayField: 'ActiveStatusName',
		allowBlank: false,
		valueField: 'ActiveStatusValue',
		anchor:'95%',
		triggerAction: 'all'
	});

	periodeCreateForm = new Ext.FormPanel({
		labelAlign: 'top',
		bodyStyle:'padding:5px',
		items: [{
			layout:'column',
			border:false,
			items:[{
				columnWidth:0.4,
				layout: 'form',
				border:false,
				items:[AluStartDate]
			}, {
				columnWidth:0.4,
				layout: 'form',
				border:false,
				items:[AluEndDate]
			}, {
				columnWidth:0.2,
				layout: 'form',
				border:false,
				items:[ActiveStatus]
			}]
		}],
		
		buttons: [{
			text: 'Save and Close',
			handler: createPeriode
		},{
			text: 'Cancel',
			handler: function(){
				periodeCreateWindow.hide();
			}
		}]
	});
	periodeCreateWindow = new Ext.Window({
		id: 'periodeCreateWindow',
		title: 'New periode',
		closable:false,
		width: 500,
		height: 144,
		plain:true,
		layout: 'fit',
		iconCls: 'setup',
		items: periodeCreateForm
	});
	function displayFormWindow(){
		if(!periodeCreateWindow.isVisible()){
			resetPeriodeForm();
			periodeCreateWindow.show();
		} else {
			periodeCreateWindow.toFront();
		}
	}
	function resetPeriodeForm(){
		AluStartDate.setValue('');
		AluEndDate.setValue('');
		ActiveStatus.setValue('');
	}
	function createPeriode(){
		if(isFormValid()){
			Ext.Ajax.request({   
				waitMsg: 'Please wait...',
				url: '/sysadmin/year_periode/periodeaction',
				params: {
				task: "INSERT",
				alu_start_date:	AluStartDate.getValue().format('Y-m-d'),
				alu_end_date:	AluEndDate.getValue().format('Y-m-d'),
				alu_active:		ActiveStatus.getValue()
			}, 
			success: function(response){              
				var result=eval(response.responseText);
				switch(result){
					case 1:
						Ext.MessageBox.alert('Creation OK','The new periode was created successfully.');
						store.reload();
						periodeCreateWindow.hide();
					break;
					default:
						Ext.MessageBox.alert('Warning','Could not create the periode.');
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

	function isFormValid(){ return(AluStartDate.isValid() && AluEndDate.isValid() && ActiveStatus.isValid()); }

	function updatePeriode(oGrid_event){
		Ext.Ajax.request({
			waitMsg: 'Please wait...',
			url: '/sysadmin/year_periode/periodeaction',
			params: {
				task: "UPDATE",
				alu_period_id:	oGrid_event.record.data.alu_period_id,
				alu_start_date:	oGrid_event.record.data.alu_start_date.format('Y-m-d'),
				alu_end_date:	oGrid_event.record.data.alu_end_date.format('Y-m-d'),
				alu_active:		oGrid_event.record.data.alu_active
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


	function formatDate(value){
        return value ? value.dateFormat('M d, Y') : '';
    }
    var fm = Ext.form;
    var cm = new Ext.grid.ColumnModel({
        defaults: {
            sortable: true
        },
        columns: [
        	{
        		header: 'Periode id',
        		dataIndex: 'alu_period_id',
        		hidden: true
        	}, {
                header: 'Start date',
                dataIndex: 'alu_start_date',
                width: 120,
                renderer: formatDate,
                editor: new fm.DateField({
                    format: 'm/d/y',
                    minValue: '01/01/1950',
                    disabledDaysText: 'Plants are not available on the weekends'
                })
            }, {
                header: 'End date',
                dataIndex: 'alu_end_date',
                width: 120,
                renderer: formatDate,
                editor: new fm.DateField({
                    format: 'm/d/y',
                    minValue: '01/01/1950',
                    disabledDaysText: 'Plants are not available on the weekends'
                })
            }, {
                header: 'Status',
                dataIndex: 'alu_active',
                width: 120,
                editor: new fm.ComboBox({
                    typeAhead: true,
                    triggerAction: 'all',
                    transform: 'alu_active',
                    lazyRender: true,
                    listClass: 'x-combo-list-small'
                })
            }
        ]
    });

	store = new Ext.data.Store({
		id: 'UsersDataStore',
		proxy: new Ext.data.HttpProxy({
		        url: '/sysadmin/year_periode/json_listing_periode', 
		        method: 'POST'
		    }),
		baseParams:{task: "LISTING"},
		reader: new Ext.data.JsonReader({
			root: 'data',
			totalProperty: 'total'
		},[ 
			{name: 'alu_period_id', type: 'int'},
			{name: 'alu_start_date', mapping: 'alu_start_date', type: 'date', dateFormat: 'm/d/Y'},
			{name: 'alu_end_date', mapping: 'alu_end_date', type: 'date', dateFormat: 'm/d/Y'},
			{name: 'alu_active', type: 'string'}
		]),
		sortInfo:{field: 'alu_end_date', direction: "DESC"}
    });

    var grid = new Ext.grid.EditorGridPanel({
        store: store,
        cm: cm,
        renderTo: 'yearperiode',
        height: 400,
        title: 'Setup year periode',
        iconCls: 'setup',
        frame: true,
        clicksToEdit: 1,
        selModel: new Ext.grid.RowSelectionModel({singleSelect:false}),
        tbar: [{
            text: 'Add year periode',
            iconCls: 'add',
            handler : displayFormWindow
        }]
    });

	store.load();
	grid.on('afteredit', updatePeriode);
});