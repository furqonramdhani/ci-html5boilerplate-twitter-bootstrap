/**
 * @author Furqon Ramdhani <furqon17@gmail.com>
 *
 * This is the Employee Screen
 *
 */
Ext.Loader.setConfig({enabled: true});
Ext.Loader.setPath('Ext.ux', base_url+'/js/ext-4.1/ux');
Ext.require([
    'Ext.grid.*',
    'Ext.data.*',
    'Ext.panel.*',
    'Ext.ModelManager',
    'Ext.util.*',
    'Ext.toolbar.Paging',
    'Ext.ux.grid.FiltersFeature',
    'Ext.form.Panel',
    'Ext.tab.*',
    'Ext.window.*',
    'Ext.tip.*',
    'Ext.layout.container.Border',
    'Ext.ux.grid.Printer',
    'Ext.state.*',
    'Ext.ux.CheckColumn',
    'Ext.selection.CellModel'
]);
var crud_action='update';
var building_parent;
var inst_id;


Ext.onReady(function(){
    Ext.define('EmployeeModel', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'idx', type: 'integer'},
            {name: 'emp_name', type: 'string'},
            {name: 'emp_address', type: 'string'},
            {name: 'emp_phone', type: 'string'},
            {name: 'emp_id', type: 'string'},
            {name: 'active', type: 'bool'},
            {name: 'inst_code', type: 'string'},
            {name: 'inst_id', type: 'integer'}
        ]
// 'idx', 'emp_name', 'emp_address','emp_phone','emp_id','active', 'inst_code']
    });
    var store = Ext.create('Ext.data.JsonStore', {
        model: 'EmployeeModel',
        pageSize:100,
        proxy: {
            type: 'ajax',
            url: base_url+'/index.php/interface/employee/json_listing_employee',
            reader: {
                type: 'json',
                root: 'data',
                totalProperty: 'total'
            }
        }
    });
    store.load();

    Ext.define('InstModel', {
        extend: 'Ext.data.Model',
        fields: ['inst_id', 'inst_code', 'inst_address','inst_phone','inst_head']
    });
    var storeInst = Ext.create('Ext.data.JsonStore', {
        model: 'InstModel',
        proxy: {
            type: 'ajax',
            url: base_url+'/index.php/interface/institution/json_listing_institution',
            reader: {
                type: 'json',
                root: 'data'
            }
        }
    });
    storeInst.load();

    var win;
    var LocationForm;
    LocationForm = Ext.create('Ext.form.Panel', {
        frame: false,
        width: 400,
        bodyPadding: 5,
        id:'locationForm',

        fieldDefaults: {
            labelAlign: 'left',
            labelWidth: 150,
            anchor: '100%'
        },
        items: [
            {
                id:'username',
                xtype: 'textfield', //3
                name: 'username',
                fieldLabel: 'Nama User',
                value: '',
                allowBlank: false //1
            },{
                id:'password',
                xtype: 'textareafield', //5
                name: 'password',
                fieldLabel: 'Password',
                value: '',
                allowBlank: false //1
            }],
        buttons: [{
            id:'saveButton',
            text: 'Save',
            handler: function() {
                var form = this.up('form').getForm();

                form.submit({
                    url: base_url+'/index.php/interface/location/insert?v=insert',
                    waitMsg: 'Sending the info...',
                    success: function(fp, o) {
                        Ext.Msg.alert('Success', 'Form submitted.');

                    }
                });

                win.hide(this, function() {
                    store.sync();
                    store.load();
                });
            }

        },{
            id:'updateButton',
            text: 'Update',
            handler: function() {
                var form = this.up('form').getForm();
                console.log('form');

                //	var building_parent = Ext.getCmp('building_parent').getValue();
                //	var inst_code = Ext.getCmp('inst_code').getValue();


                Ext.Ajax.request({
                    waitMsg: 'Please wait...',
                    url: base_url+'/index.php/interface/location/update',
                    params: {
                        task: "UPDATE",

                        building_id:			Ext.getCmp('building_id').getValue(),
                        building_name:			Ext.getCmp('building_name').getValue(),
                        building_address:			Ext.getCmp('building_address').getValue(),
                        building_phone:			Ext.getCmp('building_phone').getValue(),
                        building_resp_person:	 		Ext.getCmp('building_resp_person').getValue(),
                        building_city:			Ext.getCmp('building_city').getValue(),
                        building_category:			Ext.getCmp('building_category').getValue(),
                        building_parent:			Ext.getCmp('building_parent').getValue(),
                        inst_code:				Ext.getCmp('inst_code').getValue()


                    },
                    success: function(response){
                        var result=eval(response.responseText);
                        //	alert(result);
                        switch(result){
                            case 1:
                                //	store.load();
                                win.hide();
                                break;
                            default:
                                Ext.MessageBox.alert('Warning...','We couldn\'t change this data...');
                                break;
                        }
                    },
                    failure: function(response){
                        var result=response.responseText;
                        Ext.MessageBox.alert('error','Could not connect to the database. Retry later');
                    }
                });



                //win.hide();
                //window.location.reload();
                // win.hide(this, function() {
                // 								store.sync();
                // 								store.load();
                // 						            });
            }

        },
            {
                text: 'Close',
                handler: function() {
                    win.hide();
                }

            }]

    });

    win = Ext.create('widget.window', {
        title: 'Data Lokasi',
        closable: true,
        modal:true,
        closeAction: 'hide',
        width: 430,
        minWidth: 370,
        height: 340,
        layout: {
            type: 'border',
            padding: 5
        },
        items: [LocationForm]
    });

    function displayFormWindow(){
        if(!win.isVisible()){
            resetForm();
            Ext.getCmp('updateButton').hide();
            Ext.getCmp('saveButton').show();
            win.show();
            Ext.getCmp('building_name').focus(true,true);

        } else {
            win.hide(this, function() {

            });
            win.toFront();
        }
    }

    function resetForm(){
        Ext.getCmp('building_name').setValue('');
        Ext.getCmp('building_address').setValue('');
        Ext.getCmp('building_phone').setValue('');
        Ext.getCmp('building_resp_person').setValue('');
        Ext.getCmp('building_city').setValue('');
        Ext.getCmp('building_category').setValue('');
        Ext.getCmp('building_parent').setValue('');
        Ext.getCmp('inst_code').setValue('');


    }

    var RowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
        id: 'RowEditing',
        clicksToMoveEditor: 1,
        autoCancel: false,
        errorSummary : false
    });

    var grid = Ext.create('Ext.grid.Panel', {
        store: store,
        width: '100%',
        minHeight: '400',
        title: 'Daftar Petugas',
        loadMask: true,
        renderTo: 'location-grid',
        selType: 'rowmodel',
        initTopToolbar: function(){
            return Ext.create('Ext.ux.toolbar.GridSearching', {
                grid            : this,
                menuPosition    : 'right',
                menuIconCls     : 'icon-config',
                inputWidth      : 200,
                showSelectAll   : false,
                menuText        : null,
                menuTip         : 'Configurazione ricerca',
                inputTip        : 'Scrivi qui per effettuare la ricerca',
                disableIndexes  : ['trad_strumento','trad_metodo'],
                items           : ['->', this.getAddButton()]
            });
        },
        dockedItems: [{
            xtype: 'toolbar',
            items: [
                {
                    icon: '/images/add.png',
                    text: 'Add',
                    scope: this,
                    //handler :displayFormWindow
                    handler : function(){
                        RowEditing.cancelEdit();
                        crud_action='insert';
//                        store.insert(0, new EmployeeModel());
//                        RowEditing.startEdit(0, 0);

                        var r = Ext.create('EmployeeModel', {
                            emp_name: '',
                            emp_address:'-' ,
                            emp_phone: '-',
                            emp_id: '-'
                        });

                        store.insert(0, r);
                        RowEditing.startEdit(0, 0);




                    }
                },
                {
                    itemId: 'remove',
                    icon: '/images/delete.png',
                    text: 'Delete',
                    scope: this,
                    handler : function(){
                        var sm = grid.getSelectionModel();
                        RowEditing.cancelEdit();
                        var emp_id = sm.lastFocused.data.emp_id;
                        var idx = sm.lastFocused.data.idx;

                        //var cat_code = sm.lastFocused.data.cat_code;

                        console.log(idx);
                        //store.remove(sm.getSelection());
                        Ext.MessageBox.confirm('Message', 'Apakah anda mau menghapus data petugas ini ?' , function(btn){
                            if(btn == 'yes')
                            {
                                //	var selections = rec.get('inst_id');

                                //	var encoded_array = Ext.encode(selections);
                                //alert(selections);
                                Ext.Ajax.request({
                                    waitMsg: 'Please Wait',
                                    url: base_url+'/index.php/interface/employee/delete',
                                    params: {
                                        task: "DELETE",
                                        row:  idx
                                    },
                                    success: function(response){
                                        var result=eval(response.responseText);
                                        //	alert(result);
                                        switch(result){
                                            case 1:
                                                //store.sync();
                                                store.load();
                                                break;
                                            default:
                                                Ext.MessageBox.alert('Warning','Could not delete.');
                                                break;
                                        }
                                    },
                                    failure: function(response){
                                        var result=response.responseText;
                                        Ext.MessageBox.alert('error','Could not connect to the database. Retry later');
                                    }
                                });
                            }
                        });

                        if (store.getCount() > 0) {
                            sm.select(0);
                        }
                    }
                },
                {
                    icon: '/images/printer.png',
                    text: 'Print',
                    scope: this,
                    handler : function(){
                        location.href = base_url+'/index.php/interface/report/rpt_pegawai';
                        //	Ext.ux.grid.Printer.printAutomatically = false;
                        //	Ext.ux.grid.Printer.stylesheetPath = '/js/ext-4.1/ux/gridPrinterCss/print.css';
//	            	Ext.ux.grid.Printer.print(grid);
                    }
                }]
        }],
        columns: [
            Ext.create('Ext.grid.RowNumberer'), //2
//		{
//		          xtype: 'hiddenfield', //1
//		          name: 'idx',
//				 dataIndex: 'idx'
//			},
            {
                text: 'NIP',//3
                width: 100,
                dataIndex: 'emp_id',
                editor: {
                    xtype:'textfield',
                    allowBlank:false
                } //
            },
            {
                text: 'Nama Petugas', //4
                // xtype:'templatecolumn',
                width: 200,
                dataIndex: 'emp_name',
                editor: {
                    xtype:'textfield',
                    allowBlank:false
                } //tpl: '{topic} {version}'
            },{
                text: 'Alamat', //5 xtype: 'booleancolumn',
                width: 200,
                dataIndex: 'emp_address',
                editor: {
                    xtype:'textfield',
                    allowBlank:true
                },
                hidden:true
            },
            {
                text: 'No. Telepon', //5 xtype: 'booleancolumn',
                width: 80,
                dataIndex: 'emp_phone',
                editor: {
                    xtype:'textfield',
                    allowBlank:true
                },
                hidden:true
            },
            {
                text: 'Instansi', //7 xtype:'numbercolumn',
                width: 250,
                dataIndex: 'inst_code',
                editor: new Ext.form.field.ComboBox({
                    displayField: 'inst_code',
                    valueField: 'inst_id',
                    triggerAction: 'all',
                    selectOnTab: true,
                    width: 250,
                    labelWidth: 130,
                    store: storeInst,
                    queryMode: 'local',
                    typeAhead: true,
                    forceSelection : true,
                    listeners:{
                        scope: this,
                        'select': function (){
                            console.log('select combo');
                        }
                    }
                })

            },
            {
                xtype: 'checkcolumn',
                header: 'Active?',
                dataIndex: 'active',
                width: 70,
                listeners: {
                    'checkchange':function(el,rowIndex,val){
//                        console.log(el);
//                        console.log(rowIndex);
                        var sm = grid.getSelectionModel().store.data.items[rowIndex];
                        var active =  sm.data.active;
                        var emp_address = sm.data.emp_address;
                        var emp_id = sm.data.emp_id;
                        var emp_name = sm.data.emp_name;
                        var emp_phone = sm.data.emp_phone;
                        var idx = sm.data.idx;
                        var inst_code = sm.data.inst_code;
                        var inst_id = sm.data.inst_id;
                        console.log(sm);
                        Ext.MessageBox.confirm('Message', 'Update status petugas ini ?' , function(btn){
                            if(btn == 'yes')
                            {
                                Ext.Ajax.request({
                                    waitMsg: 'Please wait...',
                                    url: base_url+'/index.php/interface/employee/useraction',
                                    params: {
                                        task: "UPDATE",
                                        idx:            idx,
                                        emp_id:			emp_id,
                                        emp_name:		emp_name,
                                        emp_address:	emp_address,
                                        emp_phone:		emp_phone,
                                        active:         active,
                                        inst_name:		inst_id
                                    },
                                    success: function(response){
                                        var result=eval(response.responseText);
                                        switch(result){
                                            case 1:
                                                store.load();
                                                break;
                                            default:
                                                Ext.MessageBox.alert('Warning...','We couldn\'t change this data...');
                                                break;
                                        }
                                    },
                                    failure: function(response){
                                        var result=response.responseText;
                                        Ext.MessageBox.alert('error','Could not connect to the database. Retry later');
                                    }
                                });
                            }

                        });

                    }
                }


            }

        ],
        plugins: [RowEditing],
        listeners: {
            'selectionchange': function(view, records) {
                // grid.down('#remove').setDisabled(!records.length);

                console.log('update');
                //	console.log(records);

            },
            'canceledit':function(editor,e,eOpts){
                store.load();
                console.log('update2');
            },
            'edit': function(editor, e) {
                // commit the changes right after editing finished
                //e.record.commit();
                console.log('update3');
                // var inst_id = e.record.data.inst_id;
                // 					console.log(inst_id);
                var sm = grid.getSelectionModel();
                console.log(sm);
                var idx = e.record.data.idx;
                var emp_id = e.record.data.emp_id;
                var emp_name = e.record.data.emp_name;
                var emp_address = e.record.data.emp_address;
                var emp_phone = e.record.data.emp_phone;
                var active = e.record.data.active;
                var inst_name = e.record.data.inst_code;



                if(crud_action=='insert'){
                    /// start insert

                    console.log('insert');
                    Ext.Ajax.request({
                        waitMsg: 'Please wait...',
                        url: base_url+'/index.php/interface/employee/insert?v=insert',
                        params: {
                            task: "INSERT",
                            emp_id:			emp_id,
                            emp_name:		emp_name,
                            emp_address:		emp_address,
                            emp_phone:		emp_phone,
                            active:         active,
                            inst_name:		inst_name




                        },
                        success: function(response){
                            var result=eval(response.responseText);
                            switch(result){
                                case 1:
                                    Ext.MessageBox.alert('Success','The new employee was created successfully.');
                                    store.load();
                                    crud_action='update';
                                    break;
                                default:
                                    Ext.MessageBox.alert('Warning','Could not create the customer.');
                                    break;
                            }
                        },
                        failure: function(response){
                            var result=response.responseText;
                            Ext.MessageBox.alert('error','Could not connect to the database. Retry later');
                        }
                    });

                    //// end insert

                } else {
                    /// start update
                    Ext.MessageBox.confirm('Message', 'Update this data ?' , function(btn){



                        if(btn == 'yes')
                        {
                            Ext.Ajax.request({
                                waitMsg: 'Please wait...',
                                url: base_url+'/index.php/interface/employee/useraction',
                                params: {
                                    task: "UPDATE",
                                    idx:            idx,
                                    emp_id:			emp_id,
                                    emp_name:		emp_name,
                                    emp_address:	emp_address,
                                    emp_phone:		emp_phone,
                                    active:         active,
                                    inst_name:		inst_name




                                },
                                success: function(response){
                                    var result=eval(response.responseText);
                                    switch(result){
                                        case 1:
                                            store.load();
                                            break;
                                        default:
                                            Ext.MessageBox.alert('Warning...','We couldn\'t change this data...');
                                            break;
                                    }
                                },
                                failure: function(response){
                                    var result=response.responseText;
                                    Ext.MessageBox.alert('error','Could not connect to the database. Retry later');
                                }
                            });
                        }

                    });
                    /// end update
                }



            }
        }

    });

    // trigger the data store load
    // store.loadPage(1);

});
