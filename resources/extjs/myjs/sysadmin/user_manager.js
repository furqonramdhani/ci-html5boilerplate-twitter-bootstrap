/**
 * @author Furqon Ramdhani <furqon17@gmail.com>
 *
 * This is the User Management Screen
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
var inst_id=0;


Ext.onReady(function(){
    Ext.define('UserModel', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'userid', type: 'integer'},
            {name: 'username', type: 'string'},
            {name: 'password', type: 'string'},
            {name: 'fullname', type: 'string'},
            {name: 'gender', type: 'string'},
            {name: 'date_of_birth',type: 'string'},
            {name: 'active_status', type: 'string'},
            {name: 'org_id', type: 'integer'},
            {name: 'groupcode', type: 'string'},
            {name: 'inst_code', type: 'string'},
            {name: 'inst_id', type: 'integer'}
        ]
// 'idx', 'emp_name', 'emp_address','emp_phone','emp_id','active', 'inst_code']
    });
    var store = Ext.create('Ext.data.JsonStore', {
        model: 'UserModel',
        pageSize:100,
        proxy: {
            type: 'ajax',
            url: base_url+'/index.php/sysadmin/user_manager/json_listing_user',
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
        title: 'Daftar User',
        loadMask: true,
        renderTo: 'location-grid',
        selType: 'rowmodel',
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
                        store.insert(0, new UserModel());
                        RowEditing.startEdit(0, 0);

//                        var r = Ext.create('EmployeeModel', {
//                            emp_name: '',
//                            emp_address:'-' ,
//                            emp_phone: '-',
//                            emp_id: '-'
//                        });
//
//                        store.insert(0, r);
//                        RowEditing.startEdit(0, 0);




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
                        var userid = sm.lastFocused.data.userid;


                        console.log(userid);
                        //store.remove(sm.getSelection());
                        Ext.MessageBox.confirm('Message', 'Apakah anda mau menghapus user ini ?' , function(btn){
                            if(btn == 'yes')
                            {
                                //	var selections = rec.get('inst_id');

                                //	var encoded_array = Ext.encode(selections);
                                //alert(selections);
                                Ext.Ajax.request({
                                    waitMsg: 'Please Wait',
                                    url: base_url+'/index.php/sysadmin/user_manager/useraction',
                                    params: {
                                        task: "DELETE",
                                        userid:  userid
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
                text: 'Nama User',//3
                width: 200,
                dataIndex: 'username',
                editor: {
                    xtype:'textfield',
                    allowBlank:false
                } //
            },
            {
                text: 'Nama Lengkap', //4
                // xtype:'templatecolumn',
                width: 200,
                dataIndex: 'fullname',
                editor: {
                    xtype:'textfield',
                    allowBlank:false
                } //tpl: '{topic} {version}'
            },{
                text: 'gender', //5 xtype: 'booleancolumn',
                width: 100,
                dataIndex: 'gender',
                editor: {
                    xtype: 'combobox', //9
                    displayField: 'name',
                    store: Ext.create('Ext.data.Store', {
                        fields: [
                            {type: 'string', name: 'name'}
                        ], data: [
                            {"name":"Male"},
                            {"name":"Female"}

                        ] }),
                    queryMode: 'local',
                    typeAhead: true
                }
            },
            {
                text: 'Role', //5 xtype: 'booleancolumn',
                width: 100,
                dataIndex: 'groupcode',
                editor: {
                    xtype: 'combobox', //9
                    displayField: 'name',
                    store: Ext.create('Ext.data.Store', {
                        fields: [
                            {type: 'string', name: 'name'}
                        ], data: [
                            {"name":"admin"},
                            {"name":"user"}

                        ] }),
                    queryMode: 'local',
                    typeAhead: true
                }
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
                        select: function(field, records, eOpts) {
                            //this gets fired if user clicks an item from the dropdown
                            if (records && records[0]) {
                                //there is a valid selection made, capture the value
                                field.lastValidValue = records[0].get(field.valueField);
                                console.log(field.lastValidValue);
                                inst_id= field.lastValidValue;
                            }
                        }
                    }
                })

            },
            {
                xtype: 'checkcolumn',
                header: 'Active?',
                dataIndex: 'active_status',
                width: 70,
                listeners: {
                    'checkchange':function(el,rowIndex,val){
//                        console.log(el);
//                        console.log(rowIndex);
                        var sm = grid.getSelectionModel().store.data.items[rowIndex];
                        var active =  sm.data.active_status;
                        var userid = sm.data.userid;
                        var username = sm.data.username;
                       // var inst_code = sm.data.inst_code;
                       // var inst_id = sm.data.inst_id;
                        console.log(sm);
                        Ext.MessageBox.confirm('Message', 'Update status petugas ini ?' , function(btn){
                            if(btn == 'yes')
                            {
                                Ext.Ajax.request({
                                    waitMsg: 'Please wait...',
                                    url: base_url+'/index.php/sysadmin/user_manager/useraction',
                                    params: {
                                        task: "ACTIVATE",
                                        userid:			userid,
                                        active:         active,
                                        username:       username
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
               	console.log(records);

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
                var userid = e.record.data.userid;
                var username = e.record.data.username;
                var fullname = e.record.data.fullname;
                var gender = e.record.data.gender;
                var role = e.record.data.groupcode;
                var active_status = e.record.data.active_status;
               // var inst_name = e.record.data.inst_code;

                if(crud_action=='insert'){
                    /// start insert

                    console.log('insert');
                    Ext.Ajax.request({
                        waitMsg: 'Please wait...',
                        url: base_url+'/index.php/sysadmin/user_manager/useraction',
                        params: {
                            task: "INSERT",
                            userid:			userid,
                            username:		username,
                            fullname:	fullname,
                            gender:		gender,
                            role:         role,
                            inst_id:		inst_id

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
                                url: base_url+'/index.php/sysadmin/user_manager/useraction',
                                params: {
                                    task: "UPDATE",
                                    userid:			userid,
                                    username:		username,
                                    fullname:	fullname,
                                    gender:		gender,
                                    role:         role,
                                    inst_id:		inst_id
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
