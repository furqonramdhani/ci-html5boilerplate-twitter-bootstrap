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
    'Ext.ux.grid.Printer'
]);
var crud_action;
var building_parent;
var inst_id;


Ext.onReady(function(){
    Ext.define('LocationModel', {
        extend: 'Ext.data.Model',
        fields: ['building_id', 'building_name', 'building_address','building_phone','building_resp_person', 'building_city','building_category','building_parent','inst_code']
    });
    var store = Ext.create('Ext.data.JsonStore', {
        model: 'LocationModel',
        id:'LocationStores',
        pageSize:100,
        remoteSort: true,
        proxy: {
            type: 'ajax',
            url: base_url+'/index.php/interface/location/json_listing_location',
            reader: {
                type: 'json',
                root: 'data',
                totalProperty: 'total'
            },
            simpleSortMode: true
        }
    });

    Ext.define('LocationNameModel', {
        extend: 'Ext.data.Model',
        fields: ['building_id','building_name']
    });
    var storeName = Ext.create('Ext.data.JsonStore', {
        model: 'LocationNameModel',
        proxy: {
            type: 'ajax',
            url: base_url+'/index.php/interface/location/json_listing_location_name',
            reader: {
                type: 'json',
                root: 'data'
            }
        }
    });
    storeName.load();

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

    Ext.define('CategoryModel', {
        extend: 'Ext.data.Model',
        fields: ['cat_id', 'cat_code', 'sub_cat', 'cat_description']
    });
    var storeCategory = Ext.create('Ext.data.JsonStore', {
        model: 'CategoryModel',
        proxy: {
            type: 'ajax',
            url: base_url+'/index.php/interface/category/json_listing_category',
            reader: {
                type: 'json',
                root: 'data'
            }
        }
    });
//    storeCategory.load();

    var filters = {
        ftype: 'filters',
        autoReload: false, //don't reload automatically
        local: true, //only filter locally
        // filters may be configured through the plugin,
        // or in the column definition within the headers configuration
        filters: [{
            type: 'string',
            dataIndex: 'building_name',
            phpMode: true
        },{
            type: 'list',
            dataIndex: 'building_city',
            options: ['Jakarta Pusat', 'Jakarta Utara', 'Jakarta Selatan', 'Jakarta Barat', 'Jakarta Timur'],
            phpMode: true
        },	{
            type: 'list',
            dataIndex: 'building_category',
            options: ['Sarana Bermain Anak','Sarana Kesehatan','Tempat Belajar','Kantor Swasta','Restoran','Angkutan Umum','Sarana Ibadah','Kantor Pemerintah','Hotel','Restoran','Pasar Modern','Pasar Tradisional','Tempat Hiburan Malam/Bar','Sport Center','Stasiun Kereta Api','Terminal Bus','Bandara','Tempat Rekreasi','Museum'],
            phpMode: true
        }]

    };
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
                id:'building_id',
                xtype: 'hiddenfield', //3
                name: 'building_id',
                value: ''
            },
            {
                id:'building_name',
                xtype: 'textfield', //3
                name: 'building_name',
                fieldLabel: 'Nama Lokasi',
                value: '',
                allowBlank: false //1
            },{
                id:'building_address',
                xtype: 'textareafield', //5
                name: 'building_address',
                fieldLabel: 'Alamat',
                value: '',
                allowBlank: false //1
            },{
                id:'building_phone',
                xtype: 'textfield', //4
                name: 'building_phone',
                fieldLabel: 'No. Telepon',
                value: '',
                allowBlank: true //1
            },{
                id:'building_resp_person',

                xtype: 'textfield', //4
                name: 'building_resp_person',
                fieldLabel: 'Penanggung Jawab',
                value: '',
                allowBlank: true //1
            },{
                id:'building_city',

                xtype: 'combobox', //9
                name: 'building_city',
                fieldLabel: 'Kota',
                displayField: 'name',
                store: Ext.create('Ext.data.Store', {
                    fields: [
                        {type: 'string', name: 'name'}
                    ], data: [
                        {"name":"Jakarta Pusat"},
                        {"name":"Jakarta Utara"},
                        {"name":"Jakarta Selatan"},
                        {"name":"Jakarta Barat"},
                        {"name":"Jakarta Timur"}
                    ] }),
                queryMode: 'local',
                typeAhead: true
            },{
                id: 'building_category',

                xtype: 'combobox', //9
                name: 'building_category',
                fieldLabel: 'Jenis Lokasi',
                displayField: 'sub_cat',
                store:storeCategory,
                queryMode: 'local',
                typeAhead: true
            },{
                id: 'building_parent',
                xtype: 'combobox', //9
                name: 'building_parent',
                fieldLabel: 'Lokasi Induk',
                store: storeName,
                displayField: 'building_name',
                valueField: 'building_id',
                queryMode: 'local',
                typeAhead: true,
                autoSelect: false,
                allowBlank: true,
                editable: true,
                forceSelection: true,
                lastValidValue: '',
                listeners : {
                    select: function(field, records, eOpts) {
                        //this gets fired if user clicks an item from the dropdown
                        if (records && records[0]) {
                            //there is a valid selection made, capture the value
                            field.lastValidValue = records[0].get(field.valueField);
                            console.log(field.lastValidValue);
                        }
                    }
                }
            },{
                id: 'inst_code',
                xtype: 'combobox', //9
                name: 'inst_id',
                fieldLabel: 'Instansi Pengawas',
                store: storeInst,
                displayField: 'inst_code',
                valueField: 'inst_id',
                queryMode: 'local',
                typeAhead: true,
                autoSelect: false,
                allowBlank: true,
                editable: true,
                forceSelection: true,
                lastValidValue: '',
                listeners : {
                    select: function(field, records, eOpts) {
                        //this gets fired if user clicks an item from the dropdown
                        if (records && records[0]) {
                            //there is a valid selection made, capture the value
                            field.lastValidValue = records[0].get(field.valueField);
                            console.log(field.lastValidValue);
                        }
                    }
                }



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

                                store.load();
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
        title: 'Daftar Lokasi/Tempat Pengawasan',
        loadMask: true,
//        features: [filters],
        selType: 'rowmodel',
        dockedItems: [{
            xtype: 'toolbar',
            items: [
                {
                    icon: '/images/add.png',
                    text: 'Add',
                    scope: this,
                    handler :displayFormWindow
                },
                {
                    itemId: 'remove',
                    icon: '/images/delete.png',
                    text: 'Delete',
                    scope: this,
                    handler : function(){
                        var sm = grid.getSelectionModel();
                        RowEditing.cancelEdit();
                        console.log(building_id);
                        var building_id = sm.lastFocused.data.building_id;

                        //store.remove(sm.getSelection());
                        Ext.MessageBox.confirm('Message', 'Apakah anda mau menghapus lokasi ini ?' , function(btn){
                            if(btn == 'yes')
                            {

                                Ext.Ajax.request({
                                    waitMsg: 'Please Wait',
                                    url: base_url+'/index.php/interface/location/delete',
                                    params: {
                                        task: "DELETE",
                                        row:  building_id
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
                }
                ,
                {
                    icon: '/images/printer.png',
                    text: 'Print',
                    scope: this,
                    handler : function(){
                        location.href = base_url+'/index.php/interface/report/rpt_location';
                        //	Ext.ux.grid.Printer.printAutomatically = false;
                        //	Ext.ux.grid.Printer.stylesheetPath = '/js/ext-4.1/ux/gridPrinterCss/print.css';
//	            	Ext.ux.grid.Printer.print(grid);
                    }
                }]
        }
            // ,{
            // 			            xtype: 'pagingtoolbar',
            // 			            store: store,
            // 						 pageSize: 50,
            // 			            dock: 'bottom',
            // 			            displayInfo: true
            // 			}
        ],

        // selModel: Ext.create('Ext.selection.CheckboxModel'), //1
        columns: [
            // Ext.create('Ext.grid.RowNumberer'), //2
            {
                text: 'Kode',//3
                width: 50,
                dataIndex: 'building_id'
            },
            {
                text: 'Nama Lokasi', //4
                // xtype:'templatecolumn',
                width: 200,
                dataIndex: 'building_name',
                editor: {
                    xtype:'textfield',
                    allowBlank:false
                } //tpl: '{topic} {version}'
            },{
                text: 'Alamat', //5 xtype: 'booleancolumn',
                width: 200,
                dataIndex: 'building_address',
                editor: {
                    xtype:'textfield',
                    allowBlank:false
                }
            },
            {
                text: 'No. Telepon', //5 xtype: 'booleancolumn',
                width: 80,
                dataIndex: 'building_phone',
                editor: {
                    xtype:'textfield',
                    allowBlank:false
                }
            },
            {
                text: 'Penanggung Jawab', //5 xtype: 'booleancolumn',
                width: 130,
                dataIndex: 'building_resp_person',
                editor: {
                    xtype:'textfield',
                    allowBlank:false
                }
            },
            {
                text: 'Kota',//3
                width: 120,
                dataIndex: 'building_city',
                editor: new Ext.form.field.ComboBox({
                    typeAhead: true,
                    triggerAction: 'all',
                    selectOnTab: true,
                    store: [
                        ['Jakarta Pusat','Jakarta Pusat'],
                        ['Jakarta Utara','Jakarta Utara'],
                        ['Jakarta Selatan','Jakarta Selatan'],
                        ['Jakarta Barat','Jakarta Barat'],
                        ['Jakarta Timur','Jakarta Timur']
                    ],
                    lazyRender: true,
                    listClass: 'x-combo-list-small'
                })
            },{
                text: 'Jenis Lokasi', //7 xtype:'numbercolumn',
                width: 120,
                dataIndex: 'building_category',
                editor: new Ext.form.field.ComboBox({
                    typeAhead: true,
                    triggerAction: 'all',
                    selectOnTab: true,
                    store: [
                        ['Angkutan Umum','Angkutan Umum'],
                        ['Sarana Bermain Anak','Sarana Bermain Anak'],
                        ['Sarana Kesehatan','Sarana Kesehatan'],
                        ['Tempat Belajar','Tempat Belajar'],
                        ['Tempat Kerja','Tempat Kerja'],
                        ['Tempat Umum','Tempat Umum']
                    ],
                    lazyRender: true,
                    listClass: 'x-combo-list-small'
                })
            }	,{
                text: 'Lokasi Induk', //7 xtype:'numbercolumn',
                width: 150,
                hidden:true,
                dataIndex: 'building_parent',
                editor: new Ext.form.field.ComboBox({
                    typeAhead: true,
                    triggerAction: 'all',
                    selectOnTab: true,
                    name: 'building_parent',
                    // fieldLabel: 'Lokasi Induk',
                    store: storeName,
                    displayField: 'building_name',
                    valueField: 'building_id',
                    queryMode: 'local',
                    typeAhead: true,
                    lazyRender: true,
                    listClass: 'x-combo-list-small'
                })
            }	,{
                text: 'Instansi', //7 xtype:'numbercolumn',
                width: 150,
                dataIndex: 'inst_code',
                editor: new Ext.form.field.ComboBox({
                    typeAhead: true,
                    triggerAction: 'all',
                    selectOnTab: false,
                    name: 'inst_code',
                    // fieldLabel: 'Lokasi Induk',
                    store: storeInst,
                    displayField: 'inst_code',
                    valueField: 'inst_id',
                    queryMode: 'local',
                    typeAhead: true,
                    lazyRender: true,
                    listClass: 'x-combo-list-small'
                })
            }
        ],
        // plugins: [RowEditing]
        //	,
        listeners: {
            'selectionchange': function(view, records) {
                grid.down('#remove').setDisabled(!records.length);
                console.log('update');
                var sm = grid.getSelectionModel();
                console.log(sm);
                console.log(records[0]);
                if(records[0] !==undefined){
                    Ext.getCmp('building_id').setValue(records[0].data.building_id);
                    Ext.getCmp('building_name').setValue(records[0].data.building_name);
                    Ext.getCmp('building_address').setValue(records[0].data.building_address);
                    Ext.getCmp('building_phone').setValue(records[0].data.building_phone);
                    Ext.getCmp('building_resp_person').setValue(records[0].data.building_resp_person);
                    Ext.getCmp('building_city').setValue(records[0].data.building_city);
                    Ext.getCmp('building_category').setValue(records[0].data.building_category);
                    Ext.getCmp('building_parent').setValue(records[0].data.building_parent);
                    Ext.getCmp('inst_code').setValue(records[0].data.inst_code);
                    Ext.getCmp('saveButton').hide();
                    Ext.getCmp('updateButton').show();
                    win.show();
                }
            },
            'canceledit':function(editor,e,eOpts){
                store.load();
            },
            'edit': function(editor, e) {
                // commit the changes right after editing finished
                //e.record.commit();
                console.log(e.record);
                // var inst_id = e.record.data.inst_id;
                // 					console.log(inst_id);
                var sm = grid.getSelectionModel();
                console.log(sm);

                var building_id = e.record.data.building_id;
                var building_name = e.record.data.building_name;
                var building_address = e.record.data.building_address;
                var building_phone = e.record.data.building_phone;
                var building_resp_person = e.record.data.building_resp_person;
                var building_city = e.record.data.building_city;
                var building_category = e.record.data.building_category;
                var building_parent = e.record.data.building_parent;
                var inst_id = e.record.data.inst_id;
                var inst_code = e.record.data.inst_code;
                console.log(inst_id);
                console.log(inst_code);





                if(crud_action=='insert'){
                    /// start insert

                    console.log('insert');
                    Ext.Ajax.request({
                        waitMsg: 'Please wait...',
                        url: base_url+'/index.php/interface/location/insert?v=insert',
                        params: {
                            task: "INSERT",
                            building_id:			building_id,
                            building_name:			building_name,
                            building_address:		building_address,
                            building_phone:			building_phone,
                            building_resp_person:			building_resp_person,
                            building_city:			building_city,
                            building_category:			building_category,
                            building_parent:			building_parent,
                            inst_id: inst_id


                        },
                        success: function(response){
                            var result=eval(response.responseText);
                            switch(result){
                                case 1:
                                    Ext.MessageBox.alert('Success','The new institution was created successfully.');
                                    store.load();

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
                    Ext.MessageBox.confirm('Message', 'Update data lokasi ini ?' , function(btn){



                        if(btn == 'yes')
                        {
                            Ext.Ajax.request({
                                waitMsg: 'Please wait...',
                                url: base_url+'/index.php/interface/location/useraction',
                                params: {
                                    task: "UPDATE",
                                    building_id:			building_id,
                                    building_name:			building_name,
                                    building_address:		building_address,
                                    building_phone:			building_phone,
                                    building_resp_person:			building_resp_person,
                                    building_city:			building_city,
                                    building_category:			building_category,
                                    building_parent:			building_parent,
                                    inst_id: inst_id



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
        },
        // paging bar on the bottom
        bbar: Ext.create('Ext.PagingToolbar', {
            store: store,
            displayInfo: true,
            displayMsg: 'Displaying topics {0} - {1} of {2}',
            emptyMsg: "No topics to display"
        }),
        renderTo: 'location-grid'

    });

    // trigger the data store load
    store.loadPage(1);

});
