/**
 * @author Furqon Ramdhani <furqon17@gmail.com>
 *
 * This is the Monitoring Screen
 *
 */
Ext.Loader.setConfig({enabled: true});
Ext.Loader.setPath('Ext.ux', base_url+'/js/ext-4.1/ux');
Ext.require([
    'Ext.grid.*',
    'Ext.data.*',
    'Ext.panel.*',
  	'Ext.ux.grid.FiltersFeature',
  	'Ext.form.*',
    'Ext.tab.*',
    'Ext.window.*',
    'Ext.tip.*',
    'Ext.layout.container.Border',
 	'Ext.state.*',
    'Ext.ux.CheckColumn',
    'Ext.selection.CellModel'

]);
var active_id;
var bname;
var baddr;
var bcity;
var bperson;
var bpersoncode;
var jenisSurat;
var jenisPelanggaran;
var jumlahPengaduan;
var faxNo;
var NmPengawas;
var InstPengawas;
var NamaPengawas1;
var NamaPengawas2;
var NamaPengawas3;
var NamaPengawas4;
var aresult=[];
var sDatePengaduan;
var sDatePengawasan;
var tipe_pengaduan;
var status;
var idx;
var changeEmp=0;
var changeInst=0;
var idPengawasan=0;
var _pindikator1;
var _pindikator2;
var _pindikator3;
var _pindikator4;
var _pindikator5;
var _pindikator6;
var _pindikator7;
var _pindikator8;

var indikator1_note='';
var indikator2_note='';
var indikator3_note='';
var indikator4_note='';
var indikator5_note='';
var indikator6_note='';
var indikator7_note='';
var indikator8_note='';


//var base_url = 'http://192.168.10.130/work/sfj';
Ext.onReady(function(){
    Ext.QuickTips.init();

	function formatDate(value){
        return value ? Ext.Date.dateFormat(value, 'M d, Y') : '';
    }
	
	function resetFormPengawasan(){
        console.log('reset form pengawasan');
        FormPengawasan.getForm().reset();
//		var Indikator1 = Ext.ComponentQuery.query('#Indikator1');
//		var Indikator2 = Ext.ComponentQuery.query('#Indikator2');
//		var Indikator3 = Ext.ComponentQuery.query('#Indikator3');
//		var Indikator4 = Ext.ComponentQuery.query('#Indikator4');
//		var Indikator5 = Ext.ComponentQuery.query('#Indikator5');
//		var Indikator6 = Ext.ComponentQuery.query('#Indikator6');
//		var Indikator7 = Ext.ComponentQuery.query('#Indikator7');
//		var Indikator8 = Ext.ComponentQuery.query('#Indikator8');

//        var DatePengawasan = Ext.getCmp('DatePengawasan').setValue('');
//		var NamaPengawas = Ext.getCmp('NamaPengawas').setValue('');
//		var InstansiPengawas = Ext.getCmp('InstansiPengawas').setValue('');
//		var WaktuPengawasan = Ext.getCmp('WaktuPengawasan').setValue('');
//
//		//Pertanyaan Lanjutan
//		var Pertanyaan1 = Ext.ComponentQuery.query('#Pertanyaan1');
//		var Pertanyaan2 = Ext.ComponentQuery.query('#Pertanyaan2');
//		var Pertanyaan3 = Ext.ComponentQuery.query('#Pertanyaan3');
//		var Pertanyaan4 = Ext.ComponentQuery.query('#Pertanyaan4');
//
//		var Pertanyaan5 = Ext.getCmp('Pertanyaan5').setValue('');
//		var Pertanyaan6 = Ext.getCmp('Pertanyaan6').setValue('');
//
//
//		//Rekomendasi
//		var Rekomendasi1 = Ext.getCmp('Rekomendasi1').setValue('');
//		var Rekomendasi2 = Ext.getCmp('Rekomendasi2').setValue('');
	}

	function resetFormPengaduan(){
        console.log('reset form pengaduan');
        PengaduanForm.getForm().reset();
//		Ext.getCmp('PersonName').setValue('');
//		Ext.getCmp('PersonEmail').setValue('')
//		Ext.getCmp('ck1').config.checked=false;
//		Ext.getCmp('ck2').config.checked=false;
//		Ext.getCmp('ck3').config.checked=false;
//		Ext.getCmp('DatePelanggaran').setValue('');
//		Ext.getCmp('Sumber').setValue('');
//		Ext.getCmp('DatePengaduan').setValue('');
//		Ext.getCmp('TimePengaduan').setValue('');
	}


    /*Model*/
    Ext.define('MonitoringModel', {
        extend: 'Ext.data.Model',
        fields: ['building_id','building_name', 'building_address','building_city','building_phone', 'building_resp_person','building_category','surveillance_id','survey_result_cat','survey_score','type_pemberitahuan','type_peringatan']
    });
    var store = Ext.create('Ext.data.JsonStore', {
        model: 'MonitoringModel',
        autoLoad:true,
        proxy: {
            type: 'ajax',
            url: base_url+'/index.php/interface/monitoring/json_listing_monitoring',
            reader: {
                type: 'json',
                root: 'data'
            }
        }
    });

	/*Model*/
	Ext.define('LocationNameModel', {
	        extend: 'Ext.data.Model',
	        fields: ['building_id','building_name']
	    });
	var storeName = Ext.create('Ext.data.JsonStore', {
		pageSize: 10,
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

    /*Model*/
    Ext.define('LocationSearchModel', {
        extend: 'Ext.data.Model',
        fields: ['building_id', 'building_name', 'building_address','building_phone','building_resp_person', 'building_city','building_category','building_parent','inst_code']
    });

    var searchStoreName = Ext.create('Ext.data.JsonStore', {
//		pageSize: 10,
        model: 'LocationSearchModel',
        autoLoad:true,
        proxy: {
            type: 'ajax',
            url: base_url+'/index.php/interface/location/json_search_location',
            reader: {
                type: 'json',
                root: 'data',
                totalProperty: 'total'
            }
        }
    });

    /*Model*/
    Ext.define('EmployeeModel', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'idx', type: 'integer'},
            {name: 'emp_name', type: 'string'},
            {name: 'emp_address', type: 'string'},
            {name: 'emp_phone', type: 'string'},
            {name: 'emp_id', type: 'string'},
            {name: 'active', type: 'bool'},
            {name: 'inst_code', type: 'string'} ,
            {name: 'inst_id', type: 'integer'}
        ]
// 'idx', 'emp_name', 'emp_address','emp_phone','emp_id','active', 'inst_code']
    });
    var storePengawas = Ext.create('Ext.data.JsonStore', {
        model: 'EmployeeModel',
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
    //store.load();


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
        },{
            type: 'list',
            dataIndex: 'building_category',
            options: ['Sarana Bermain Anak', 'Sarana Kesehatan', 'Tempat Belajar', 'Kantor Swasta', 'Restoran', 'Angkutan Umum','Sarana Ibadah','Kantor Pemerintah','Hotel','Restoran','Pasar Modern','Pasar Tradisional','Tempat Hiburan Malam/Bar','Sport Center','Stasiun Kereta Api','Terminal Bus','Bandara','Tempat Rekreasi','Museum','Pusat Perbelanjaan'],
            phpMode: true
        },{
            type: 'list',
            dataIndex: 'survey_result_cat',
            options: ['Taat', 'Tidak Taat'],
            phpMode: true
        }]

    };

    // // Define the model for a State
    // Ext.define('Inst', {
    //     extend: 'Ext.data.Model',
    //     fields: [
    //         {type: 'string', name: 'code'},
    //         {type: 'string', name: 'name'}
    //     ]
    // });

    // // The data for all states
    // var Inst = [
    //     {"code":"1","name":"BPLHD"},
    //     {"code":"DPW","name":"Dinas Pariwisata"},
    //     {"code":"DPD","name":"Dinas Pendidikan"},
    //     {"code":"DK","name":"Dinas Kesehatan"},
    //     {"code":"DPH","name":"Dinas Perhubungan"},
    //     {"code":"DTKT","name":"Dinas Tenaga Kerja dan Transmigrasi"}
       
    // ];

    // // The data store holding the states; shared by each of the ComboBox examples below
    // var store2 = Ext.create('Ext.data.Store', {
    //     model: 'Inst',
    //     data: Inst
    // });

     Ext.define('InstModel', {
        extend: 'Ext.data.Model',
        fields: ['inst_id', 'inst_code', 'inst_address','inst_phone','inst_head','inst_head_id']
    });
    var storeInstansi = Ext.create('Ext.data.JsonStore', {
        model: 'InstModel',
        autoLoad:true,
        proxy: {
            type: 'ajax',
            url: base_url+'/index.php/interface/institution/json_listing_institution',
            reader: {
                type: 'json',
                root: 'data'
            }
        }
    });

    var formInputPegawai;
    var winInputPegawai;
    formInputPegawai = Ext.create('Ext.form.Panel',{
        height: 120,
        width: 413,
        layout: {
            align: 'stretch',
            type: 'vbox'
        },
        bodyPadding: 10,
        items: [
            {
                xtype: 'fieldset',
                height: 50,
                padding: 5,
                items: [
                    {
                        xtype: 'textfield',
                        id:'fipNIP',
                        fieldLabel: 'NIP',
                        labelWidth: 150,
                        anchor: '100%',
                        hidden:true
                    },
                    {
                        xtype: 'textfield',
                        id:'fipNama',
                        fieldLabel: 'Nama',
                        labelWidth: 150,
                        anchor: '100%'
                    },
                    {
                        xtype: 'textfield',
                        id:'fipAlamat',
                        fieldLabel: 'Alamat',
                        labelWidth: 150,
                        anchor: '100%',
                        hidden:true
                    },
                    {
                        xtype: 'textfield',
                        id:'fipTelepon',
                        fieldLabel: 'No Telepon',
                        labelWidth: 150,
                        anchor: '100%',
                        hidden:true
                    }
                ]
            },
            {
                xtype: 'fieldset',
                border:0,
                height: 50,
                padding: 5,
                items: [
                    {
                        xtype: 'button',
                        margin: '0px 0px 0px 6px',

                        scale: 'medium',
                        ui: 's-button',
                        text: 'Simpan',
                        cls: 's-blue',
                        disabled: false,
                        handler:function(){
                            Ext.MessageBox.confirm('Message', 'Simpan Data ?' , function(btn){

                                var emp_id = Ext.getCmp('fipNIP').getValue();
                                var emp_name = Ext.getCmp('fipNama').getValue();
                                var emp_address = Ext.getCmp('fipAlamat').getValue();
                                var emp_phone = Ext.getCmp('fipTelepon').getValue();
                                var inst_name = Ext.getCmp('InstansiPengawas').getValue();
                                var active='active';
                                console.log(inst_name);

                                if(btn == 'yes')
                                {
                                    Ext.Ajax.request({
                                        waitMsg: 'Please wait...',
                                        url: base_url+'/index.php/interface/employee/insert?v=insert',
                                        params: {
                                            task: "INSERT",
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
                                                    Ext.MessageBox.alert('Success','Data petugas berhasil disimpan.');
                                                    storePengawas.load();
                                                    winInputPegawai.hide();

                                                    break;
                                                default:
                                                    Ext.MessageBox.alert('Warning','Tidak dapat menambahkan data petugas. Silahkan coba lagi.');
                                                    break;
                                            }
                                        },
                                        failure: function(response){
                                            var result=response.responseText;
                                            Ext.MessageBox.alert('error','Tidak dapat terhubung dengan database. Silahkan coba lagi');
                                        }
                                    });


                                }

                            });

                        }

                    },
                    {
                        xtype: 'button',
                        margin: '0px 0px 0px 6px',
                        scale: 'medium',
                        ui: 's-button',
                        text: 'Batal',
                        cls: 's-gray',
                        disabled: false,
                        handler:function(){

                            Ext.MessageBox.confirm('Message', 'Batalkan proses input petugas ?' , function(btn){

                                if(btn == 'yes')
                                {
                                    winInputPegawai.hide();
                                }
                            });

                        }
                    }
                ]
            }
        ]
    });

    /*
     * window for Form Input pegawai
     */
    winInputPegawai = Ext.widget('window', {
        title: 'Input Nama Petugas',
        closeAction: 'hide',
        height: 150,
        width: 450,
        layout: 'fit',
        // resizable: true,
        autoScroll: true,
        modal: true,
        items: [formInputPegawai]
    });

    function getIndikatorNotes(indikator)
    {
        Ext.Ajax.request({
            waitMsg: 'Please wait...',
            url: base_url+'/index.php/interface/monitoring/insert_pengawasan?v=insert',
            params: {
                task: "INSERT",
                indikator: indikator,
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
    }

    var PengaduanForm;
	var winPengaduan;
	var FormPengawasan;
	var win;
	var winDetil;
    var winDetilList;

    FormPengawasan =	Ext.create('Ext.form.Panel', {

        //height: '100%',
        width: 700,
        autoScroll: true,
        layout: {
            align: 'stretch',
            type: 'vbox'
        },
        bodyPadding: 10,

        fieldDefaults: {
            labelAlign: 'left',
            labelWidth: 120,
            anchor: '100%'
        },

        items: [
            {
                xtype: 'fieldset',
                height: 60,
                style: 'padding2px;',
                //flex: 1,
                dock: 'right',
                layout: {
                    columns:3,
                    type: 'table'
                },
                checkboxToggle: false,
                title: '',
                items: [
                    {
                        xtype: 'combobox',
                        minWidth:'300',
                        width:'400',

                        anchor: '100%',
                        style: 'padding-right:5px;margin-right:5px;',
                        fieldLabel: 'Instansi',
                        id:'InstansiPengawas',
                        displayField: 'inst_code',
                        valueField: 'inst_id',
                        store: storeInstansi,
                        queryMode: 'local',
                        typeAhead: true,
                        listeners:{
                            'change' : function( el, newValue, oldValue, Opts ){
                                console.log(newValue);
                                InstPengawas=newValue;
                                storePengawas.clearFilter(false);
                                storePengawas.filter('inst_id',newValue);
                                changeInst=0;
                               // Ext.getCmp('NamaPengawas').setValue('');
                            }
                        //  flex: 1
                        }

                    },
                    {
                        xtype: 'combobox',
                        minWidth:'300',
                        width:'400',
                        anchor: '100%',
                        style: 'padding-right:5px;margin-right:5px;',
                        id: 'NamaPengawas',
                        name: 'emp_name',
                        fieldLabel: 'Nama Pengawas',
                        store: storePengawas,
                        displayField: 'emp_name',
                        valueField: 'emp_name',
                        queryMode: 'local',
                        typeAhead: true,
                        multiSelect:true
//                        listeners:{
//                            'change' : function( el, newValue, oldValue, Opts ){
//                                console.log(newValue);
//                                NmPengawas = newValue;
//                                //storePengawas.clearFilter(false);
//                                //storePengawas.filter('inst_id',newValue);
//                                changeEmp=0;
//                                // Ext.getCmp('NamaPengawas').setValue('');
//                            }
//                        }

                    },{
                        xtype: 'button',
                        margin: '0px 0px 0px 6px',
                        scale: 'small',
                        //ui: 's-button',
                        text: 'Add',
                      //  cls: 's-green',
                        iconCls: 'controladd',
                        iconAlign: 'left',
                        disabled: false,
                        handler:function(){
                            console.log('add pengawas button');
                            var checkInst = Ext.getCmp('InstansiPengawas').getValue();
                            console.log(checkInst);
                            if(checkInst==null){
                                Ext.MessageBox.alert('Info', 'Anda belum pilih instansi !');
                            } else {
                                winInputPegawai.show();
                                Ext.getCmp('fipNama').setValue('');
                            }

                           // window.location = base_url+'/index.php/interface/employee';
                        }
                        //        flex: 1
                    }
                ]
            },
            {
                xtype: 'fieldset',
                height: 60,
                style: 'padding2px;',
                //flex: 1,
                dock: 'right',
                layout: {
                    columns:3,
                    type: 'table'
                },
                title: '',
                items: [
                    {
                        xtype: 'datefield',
                        minWidth:'300',
                        width:'400',
                        anchor: '100%',
                        id:'DatePengawasan',
                        format:'Y-m-d',
                        name: 'date_pengawasan',
                        style: 'padding-right:5px;margin-right:5px;',
                        fieldLabel: 'Tanggal'
                        // flex: 1
                    },
                    {
                        xtype: 'textfield',
                        minWidth:'300',
                        width:'400',
                        anchor: '100%',
                        style: 'padding-right:5px;margin-right:5px;',
                        id:'WaktuPengawasan',
                        fieldLabel: 'Waktu (hh:mm)'
                        //  flex: 1
                    }
                ]
            },


            {

                xtype: 'fieldset',
                margin : '10 5 5 5',

                items: [
                    {
                        xtype: 'radiogroup',
                        fieldLabel: 'Ditemukan orang merokok*',
                        labelSeparator: ' ',
                        labelWidth: 420,
                        allowBlank:false,
                        itemId:'Indikator1',
                        id:'Indikator1',
                        items: [
                            {
                                name :'rb1',
                                inputValue:'Ya',
                                boxLabel: 'Ya',
                                checked:false

                            },
                            {
                                name :'rb1',
                                inputValue:'Tidak',
                                boxLabel: 'Tidak',
                                checked:false
                            },
                            {
                                xtype:'label',
                                text:''
                            },

                            {
                                xtype: 'button',
                                scale: 'small',
                                //ui: 's-button',
                                text: '',
                                //  cls: 's-green',
                                iconCls: 'comment',
                                iconAlign: 'right',
                                disabled: false,
                                handler:function(){
                                    console.log('add comment 1');

                                    Ext.MessageBox.show({
                                        title: 'Catatan',
                                        msg: 'Sebutkan lokasi (lobi, ruang tunggu,restoran, bar , ruang kelas, dsb) atau dalam angkutan umum :',
                                        width:300,
                                        buttons: Ext.MessageBox.OKCANCEL,
                                        multiline: true,
                                        fn: function(btn,text){
                                           indikator1_note=text;
                                        }
//                                        showResultText,
//                                        animateTarget: 'mb3'
                                    });

                                }
                            }

                        ]
                    },
                    {
                        xtype: 'radiogroup',
                        fieldLabel: 'Ditemukan Tempat Khusus Merokok di dalam gedung',
                        labelSeparator: ' ',
                        labelWidth: 420,
                        itemId:'Indikator2',
                        id:'Indikator2',

                        items: [
                            {
                                name :'rb2',
                                inputValue:'Ya',
                                boxLabel: 'Ya'

                            },
                            {
                                name :'rb2',
                                inputValue:'Tidak',
                                boxLabel: 'Tidak',
//                                checked:true
                            },
                            {
                                xtype:'label',
                                text:''
                            },

                            {
                                xtype: 'button',
                                scale: 'small',
                                //ui: 's-button',
                                text: '',
                                //  cls: 's-green',
                                iconCls: 'comment',
                                iconAlign: 'right',
                                disabled: false,
                                handler:function(){
                                    Ext.MessageBox.show({
                                        title: 'Catatan',
                                        msg: 'Sebutkan lokasi (lobi, ruang tunggu,restoran, bar , ruang kelas, dsb) atau dalam angkutan umum :',
                                        width:300,
                                        buttons: Ext.MessageBox.OKCANCEL,
                                        multiline: true,
                                        fn: function(btn,text){
                                            indikator2_note=text;
                                        }
//                                        showResultText,
//                                        animateTarget: 'mb3'
                                    });


                                }
                            }
                        ]
                    },
                    {
                        xtype: 'radiogroup',
                        fieldLabel: 'Ada tanda Dilarang Merokok di setiap tempat/pintu masuk*',
                        labelSeparator: ' ',
                        labelWidth: 420,
                        itemId:'Indikator3',
                        id:'Indikator3',
                        items: [
                            {
                                name :'rb3',
                                inputValue:'Ya',
                                boxLabel: 'Ya'

                            },
                            {
                                name :'rb3',
                                inputValue:'Tidak',
                                boxLabel: 'Tidak',
//                                checked:true
                            },
                            {
                                xtype:'label',
                                text:''
                            },

                            {
                                xtype: 'button',
                                scale: 'small',
                                //ui: 's-button',
                                text: '',
                                //  cls: 's-green',
                                iconCls: 'comment',
                                iconAlign: 'right',
                                disabled: false,
                                handler:function(){
                                    Ext.MessageBox.show({
                                        title: 'Catatan',
                                        msg: 'Sebutkan lokasi (lobi, ruang tunggu,restoran, bar , ruang kelas, dsb) atau dalam angkutan umum :',
                                        width:300,
                                        buttons: Ext.MessageBox.OKCANCEL,
                                        multiline: true,
                                        fn: function(btn,text){
                                            indikator3_note=text;
                                        }
//                                        showResultText,
//                                        animateTarget: 'mb3'
                                    });


                                }
                            }
                        ]
                    },
                    {
                        xtype: 'radiogroup',
                        fieldLabel: 'Tercium bau asap rokok*',
                        labelSeparator: ' ',
                        labelWidth: 420,
                        itemId:'Indikator4',
                        id:'Indikator4',
                        items: [
                            {
                                name :'rb4',
                                inputValue:'Ya',
                                boxLabel: 'Ya'

                            },
                            {
                                name :'rb4',
                                inputValue:'Tidak',
                                boxLabel: 'Tidak',
//                                checked:true
                            },
                            {
                                xtype:'label',
                                text:''
                            },

                            {
                                xtype: 'button',
                                scale: 'small',
                                //ui: 's-button',
                                text: '',
                                //  cls: 's-green',
                                iconCls: 'comment',
                                iconAlign: 'right',
                                disabled: false,
                                handler:function(){
                                    Ext.MessageBox.show({
                                        title: 'Catatan',
                                        msg: 'Sebutkan lokasi (lobi, ruang tunggu,restoran, bar , ruang kelas, dsb) atau dalam angkutan umum :',
                                        width:300,
                                        buttons: Ext.MessageBox.OKCANCEL,
                                        multiline: true,
                                        fn: function(btn,text){
                                            indikator4_note=text;
                                        }
//                                        showResultText,
//                                        animateTarget: 'mb3'
                                    });


                                }
                            }
                        ]
                    },
                    {
                        xtype: 'radiogroup',
                        fieldLabel: 'Ditemukan asbak di dalam tempat/gedung',
                        labelSeparator: ' ',
                        labelWidth: 420,
                        itemId:'Indikator5',
                        id:'Indikator5',
                        items: [
                            {
                                name :'rb5',
                                inputValue:'Ya',
                                boxLabel: 'Ya'

                            },
                            {
                                name :'rb5',
                                inputValue:'Tidak',
                                boxLabel: 'Tidak',
//                                checked:true
                            },
                            {
                                xtype:'label',
                                text:''
                            },

                            {
                                xtype: 'button',
                                scale: 'small',
                                //ui: 's-button',
                                text: '',
                                //  cls: 's-green',
                                iconCls: 'comment',
                                iconAlign: 'right',
                                disabled: false,
                                handler:function(){
                                    Ext.MessageBox.show({
                                        title: 'Catatan',
                                        msg: 'Sebutkan lokasi (lobi, ruang tunggu,restoran, bar , ruang kelas, dsb) atau dalam angkutan umum :',
                                        width:300,
                                        buttons: Ext.MessageBox.OKCANCEL,
                                        multiline: true,
                                        fn: function(btn,text){
                                            indikator5_note=text;
                                        }
//                                        showResultText,
//                                        animateTarget: 'mb3'
                                    });


                                }
                            }
                        ]
                    },
                    {
                        xtype: 'radiogroup',
                        fieldLabel: 'Ditemukan puntung rokok di dalam tempat*/gedung',
                        labelSeparator: ' ',
                        labelWidth: 420,
                        itemId:'Indikator6',
                        id:'Indikator6',
                        items: [
                            {
                                name :'rb6',
                                inputValue:'Ya',
                                boxLabel: 'Ya'

                            },
                            {
                                name :'rb6',
                                inputValue:'Tidak',
                                boxLabel: 'Tidak',
//                                checked:true
                            },
                            {
                                xtype:'label',
                                text:''
                            },

                            {
                                xtype: 'button',
                                scale: 'small',
                                //ui: 's-button',
                                text: '',
                                //  cls: 's-green',
                                iconCls: 'comment',
                                iconAlign: 'right',
                                disabled: false,
                                handler:function(){
                                    Ext.MessageBox.show({
                                        title: 'Catatan',
                                        msg: 'Sebutkan lokasi (lobi, ruang tunggu,restoran, bar , ruang kelas, dsb) atau dalam angkutan umum :',
                                        width:300,
                                        buttons: Ext.MessageBox.OKCANCEL,
                                        multiline: true,
                                        fn: function(btn,text){
                                            indikator6_note=text;
                                        }
//                                        showResultText,
//                                        animateTarget: 'mb3'
                                    });


                                }
                            }
                        ]
                    },
                    {
                        xtype: 'radiogroup',
                        fieldLabel: 'Ada sarana pengaduan (nomor telepon atau lainnya)*',
                        labelSeparator: ' ',
                        labelWidth: 420,
                        itemId:'Indikator7',
                        id:'Indikator7',
                        items: [
                            {
                                name :'rb7',
                                inputValue:'Ya',
                                boxLabel: 'Ya'

                            },
                            {
                                name :'rb7',
                                inputValue:'Tidak',
                                boxLabel: 'Tidak',
//                                checked:true
                            },
                            {
                                xtype:'label',
                                text:''
                            },

                            {
                                xtype: 'button',
                                scale: 'small',
                                //ui: 's-button',
                                text: '',
                                //  cls: 's-green',
                                iconCls: 'comment',
                                iconAlign: 'right',
                                disabled: false,
                                handler:function(){
                                    Ext.MessageBox.show({
                                        title: 'Catatan',
                                        msg: 'Sebutkan lokasi (lobi, ruang tunggu,restoran, bar , ruang kelas, dsb) atau dalam angkutan umum :',
                                        width:300,
                                        buttons: Ext.MessageBox.OKCANCEL,
                                        multiline: true,
                                        fn: function(btn,text){
                                            indikator7_note=text;
                                        }
//                                        showResultText,
//                                        animateTarget: 'mb3'
                                    });


                                }
                            }
                        ]
                    },
                    {
                        xtype: 'radiogroup',
                        fieldLabel: 'Ada petugas pengawasan**',
                        labelSeparator: ' ',
                        labelWidth: 420,
                        itemId:'Indikator8',
                        id:'Indikator8',
                        items: [
                            {
                                name :'rb8',
                                inputValue:'Ya',
                                boxLabel: 'Ya'

                            },
                            {
                                name :'rb8',
                                inputValue:'Tidak',
                                boxLabel: 'Tidak',
//                                checked:true
                            },
                            {
                                xtype:'label',
                                text:''
                            },

                            {
                                xtype: 'button',
                                scale: 'small',
                                //ui: 's-button',
                                text: '',
                                //  cls: 's-green',
                                iconCls: 'comment',
                                iconAlign: 'right',
                                disabled: false,
                                handler:function(){
                                    Ext.MessageBox.show({
                                        title: 'Catatan',
                                        msg: 'Sebutkan lokasi (lobi, ruang tunggu,restoran, bar , ruang kelas, dsb) atau dalam angkutan umum :',
                                        width:300,
                                        buttons: Ext.MessageBox.OKCANCEL,
                                        multiline: true,
                                        fn: function(btn,text){
                                            indikator8_note=text;
                                        }
//                                        showResultText,
//                                        animateTarget: 'mb3'
                                    });


                                }
                            }
                        ]
                    }
                ]
            },
            {
                xtype: 'label',
                text: '* Berlaku pula untuk angkutan umum'
            },
            {
                xtype: 'label',
                text: '** Berlaku pula untuk angkutan umum dimana pengemudi atau awak angkutan umum menjadi petugas pengawasan'
            },
            {
                xtype: 'label',
                height:10,
                text: '',
                flex: 1
            },
            {
                xtype: 'label',
                style:'font-weight:bold;margin:5px;',
                text: 'Pertanyaan untuk Pengelola/Pimpinan/Penanggung Jawab/Pengemudi',
                flex: 1
            },
            {
                xtype: 'label',
                style:'margin-bottom:5px;',
                height:10,
                text: '',
                flex: 1
            },
            {

                xtype: 'fieldset',
                //title: 'Indikator',
                margin : '10 5 10 5',

                items: [
                    {
                        xtype: 'radiogroup',
                        fieldLabel: 'Apakah Anda tahu DKI Jakarta memiliki peraturan-peraturan yang melarang merokok di dalam gedung atau kawasan atau angkutan umum ?',
                        labelSeparator: ' ',
                        labelWidth: 420,
                        allowBlank:false,
                        itemId:'Pertanyaan1',
                        id:'Pertanyaan1',
                        items: [
                            {
                                name :'prb1',
                                inputValue:'Ya',
                                boxLabel: 'Ya'

                            },
                            {
                                name :'prb1',
                                inputValue:'Tidak',
                                boxLabel: 'Tidak',
//                                checked:true
                            }
                        ]
                    },
                    {
                        xtype: 'radiogroup',
                        fieldLabel: 'Apakah Anda mendukung dan melaksanakan peraturan-peraturan tersebut di tempat anda ?',
                        labelSeparator: ' ',
                        labelWidth: 420,
                        itemId:'Pertanyaan2',
                        id:'Pertanyaan2',
                        items: [
                            {
                                name :'prb2',
                                inputValue:'Ya',
                                boxLabel: 'Ya'

                            },
                            {
                                name :'prb2',
                                inputValue:'Tidak',
                                boxLabel: 'Tidak'
//                                checked:true
                            }
                        ]
                    },
                    {
                        xtype: 'radiogroup',
                        fieldLabel: 'Apakah Anda tahu bahwa peraturan-peraturan tersebut wajib dilaksanan sebaik mungkin oleh pengelola gedung/kawasan atau pengemudi/awak angkutan umum ?',
                        labelSeparator: ' ',
                        labelWidth: 420,
                        itemId:'Pertanyaan3',
                        id:'Pertanyaan3',
                        items: [
                            {
                                name :'prb3',
                                inputValue:'Ya',
                                boxLabel: 'Ya'

                            },
                            {
                                name :'prb3',
                                inputValue:'Tidak',
                                boxLabel: 'Tidak'
//                                checked:true
                            }
                        ]
                    },
                    {
                        xtype: 'radiogroup',
                        fieldLabel: 'Apakah Anda tahu Jika anda melanggar peraturan-peraturan tersebut Anda akan terkena sanksi ?',
                        labelSeparator: ' ',
                        labelWidth: 420,
                        itemId:'Pertanyaan4',
                        id:'Pertanyaan4',
                        items: [
                            {
                                name :'prb4',
                                inputValue:'Ya',
                                boxLabel: 'Ya'

                            },
                            {
                                name :'prb4',
                                inputValue:'Tidak',
                                boxLabel: 'Tidak'
//                                checked:true
                            }
                        ]
                    },
                    {
                        xtype: 'textareafield',
                        id:'Pertanyaan5',
                        fieldLabel: 'Hambatan apa yang Anda hadapi dalam melaksanakan peraturan-peraturan tersebut ?',
                        labelSeparator: ' ',
                        labelWidth: 420
                    },
                    {
                        xtype: 'textareafield',
                        id:'Pertanyaan6',
                        fieldLabel: 'Solusi apa saja yang menurut Anda dapat membantu Anda dalam melaksanakan peraturan Kawasan Dilarang Merokok ?',
                        labelSeparator: ' ',
                        labelWidth: 420
                    }
                ]
            },
            {
                xtype: 'label',
                style:'font-weight:bold;margin:5px;',
                text: 'Rekomendasi',
                flex: 1
            },
            {
                xtype: 'label',
                style:'margin-bottom:5px;',
                height:10,
                text: '',
                flex: 1
            },
            {

                xtype: 'fieldset',
                //title: 'Indikator',
                margin : '10 5 10 5',

                items: [

                    {
                        xtype: 'textareafield',
                        id:'Rekomendasi1',
                        fieldLabel: ''

                    },
                    {
                        xtype: 'textareafield',
                        id:'Rekomendasi2',
                        fieldLabel: ''

                    }
                ]
            },

            {
                xtype: 'fieldcontainer',
                height: 130,
                padding:'10px',
                width: 663,
                margin:'0px 0px 5px 0px',
                fieldLabel: '',
                flex: 1,
                items: [
                    {
                        xtype: 'button',
                        margin: '0px 0px 0px 6px',
                        scale: 'medium',
                        ui: 's-button',
                        text: '   Save   ',
                        cls: 's-blue',
                        disabled: false,
                        handler:function(){

                            //Pertanyaan Utama
                            var Indikator1 = Ext.ComponentQuery.query('#Indikator1');
                            var Indikator2 = Ext.ComponentQuery.query('#Indikator2');
                            var Indikator3 = Ext.ComponentQuery.query('#Indikator3');
                            var Indikator4 = Ext.ComponentQuery.query('#Indikator4');
                            var Indikator5 = Ext.ComponentQuery.query('#Indikator5');
                            var Indikator6 = Ext.ComponentQuery.query('#Indikator6');
                            var Indikator7 = Ext.ComponentQuery.query('#Indikator7');
                            var Indikator8 = Ext.ComponentQuery.query('#Indikator8');


                            var DatePengawasan = Ext.getCmp('DatePengawasan').getRawValue();
//                            NamaPengawas = Ext.getCmp('NamaPengawas').getValue();
//                            InstansiPengawas = Ext.getCmp('InstansiPengawas').getValue();
                            var WaktuPengawasan = Ext.getCmp('WaktuPengawasan').getValue();

                            var arrWaktu = String(WaktuPengawasan).split(' ');
                            console.log(arrWaktu);

                            //Pertanyaan Lanjutan
                            var Pertanyaan1 = Ext.ComponentQuery.query('#Pertanyaan1');
                            var Pertanyaan2 = Ext.ComponentQuery.query('#Pertanyaan2');
                            var Pertanyaan3 = Ext.ComponentQuery.query('#Pertanyaan3');
                            var Pertanyaan4 = Ext.ComponentQuery.query('#Pertanyaan4');

                            var Pertanyaan5 = Ext.getCmp('Pertanyaan5').getValue();
                            var Pertanyaan6 = Ext.getCmp('Pertanyaan6').getValue();

                            //Rekomendasi
                            var Rekomendasi1 = Ext.getCmp('Rekomendasi1').getValue();
                            var Rekomendasi2 = Ext.getCmp('Rekomendasi2').getValue();

                            // Array Nama Pengawasan
                            var inPeg = Ext.getCmp('NamaPengawas').getValue();
                            console.log(inPeg);
                            Ext.each(inPeg,function(arrayItems,index,allItems){
                                switch(index)
                                {
                                    case 0:
                                        console.log(arrayItems);
                                        NamaPengawas1 = arrayItems;
                                        break;
                                    case 1:
                                        console.log(arrayItems);
                                        NamaPengawas2 = arrayItems;
                                        break;
                                    case 2:
                                        console.log(arrayItems);
                                        NamaPengawas3 = arrayItems;
                                        break;
                                    case 3:
                                        console.log(arrayItems);
                                        NamaPengawas4 = arrayItems;
                                        break;
                                }
                            });


                            if (InstansiPengawas=='' || NamaPengawas=='' || DatePengawasan=='' || Indikator1[0].getValue().rb1===undefined || Indikator2[0].getValue().rb2===undefined || Indikator3[0].getValue().rb3===undefined || Indikator4[0].getValue().rb4===undefined || Indikator5[0].getValue().rb5===undefined || Indikator6[0].getValue().rb6===undefined || Indikator7[0].getValue().rb7===undefined || Indikator8[0].getValue().rb8===undefined || Pertanyaan1[0].getValue().prb1===undefined || Pertanyaan2[0].getValue().prb2===undefined || Pertanyaan3[0].getValue().prb3===undefined || Pertanyaan4[0].getValue().prb4===undefined) {
                                Ext.MessageBox.alert('Warning...','Data yang anda isi belum lengkap !');

                            } else {

                              Ext.MessageBox.confirm('Message', 'Simpan data pengawasan ?' , function(btn){

                             if(btn == 'yes')
                             {
                             if(status!='update'){




                            Ext.Ajax.request({
                                waitMsg: 'Please wait...',
                                url: base_url+'/index.php/interface/monitoring/insert_pengawasan?v=insert',
                                params: {
                                    task: "INSERT",

                                    rb1:				Indikator1[0].getValue().rb1,
                                    rb2:				Indikator2[0].getValue().rb2,
                                    rb3:				Indikator3[0].getValue().rb3,
                                    rb4:   				Indikator4[0].getValue().rb4,
                                    rb5:   				Indikator5[0].getValue().rb5,
                                    rb6:   				Indikator6[0].getValue().rb6,
                                    rb7:   				Indikator7[0].getValue().rb7,
                                    rb8:   				Indikator8[0].getValue().rb8,
                                    rb1_note:			indikator1_note,
                                    rb2_note:			indikator2_note,
                                    rb3_note:			indikator3_note,
                                    rb4_note:   		indikator4_note,
                                    rb5_note:   		indikator5_note,
                                    rb6_note:   		indikator6_note,
                                    rb7_note:   		indikator7_note,
                                    rb8_note:   		indikator8_note,
                                    prb1:               Pertanyaan1[0].getValue().prb1,
                                    prb2:               Pertanyaan2[0].getValue().prb2,
                                    prb3:               Pertanyaan3[0].getValue().prb3,
                                    prb4:               Pertanyaan4[0].getValue().prb4,
                                    prb5:               Pertanyaan5,
                                    prb6:               Pertanyaan6,
                                    Rekomendasi1:       Rekomendasi1,
                                    Rekomendasi2:       Rekomendasi2,
                                    building_id:		active_id,
                                    TanggalPengawasan: 	DatePengawasan,
                                    WaktuPengawasan:    WaktuPengawasan,//arrWaktu[4],
                                    InstansiPengawas:   InstPengawas,
                                    NamaPengawas: 		NamaPengawas1,
                                    NamaPengawas2:      NamaPengawas2,
                                    NamaPengawas3:      NamaPengawas3,
                                    NamaPengawas4:      NamaPengawas4

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
                            } else {

                                    // console.log()
                                    // if(changeInst==1){
                                    // storeInstansi.clearFilter(false);
                                  //   console.log(Ext.getCmp('InstansiPengawas').getValue());
                                     var recInstansi = storeInstansi.findRecord('inst_code',Ext.getCmp('InstansiPengawas').getValue());
                                     console.log(recInstansi);
                                     if(recInstansi!==null){
                                         var InstansiPengawas = recInstansi.data.inst_id;
                                     } else {
                                         var InstansiPengawas  = Ext.getCmp('InstansiPengawas').getValue();
                                     }

                                     console.log(changeEmp);
                                 var inPeg = Ext.getCmp('NamaPengawas');
                                 console.log(inPeg);
//                                    if (NamaPengawas1!=''){
//                                        // Array Nama Pengawasa
//                                        var inPeg = Ext.getCmp('NamaPengawas').getValue();
//                                        console.log(inPeg);
//                                        Ext.each(inPeg,function(arrayItems,index,allItems){
//                                            switch(index)
//                                            {
//                                                case 0:
//                                                    console.log(arrayItems);
//                                                    NamaPengawas1 = arrayItems;
//                                                    break;
//                                                case 1:
//                                                    console.log(arrayItems);
//                                                    NamaPengawas2 = arrayItems;
//                                                    break;
//                                                case 2:
//                                                    console.log(arrayItems);
//                                                    NamaPengawas3 = arrayItems;
//                                                    break;
//                                                case 3:
//                                                    console.log(arrayItems);
//                                                    NamaPengawas4 = arrayItems;
//                                                    break;
//                                            }
//                                        });
//                                    }





                                     Ext.Ajax.request({
                                         waitMsg: 'Please wait...',
                                         url: base_url+'/index.php/interface/monitoring/update_pengawasan',
                                         params: {
                                             task: "UPDATE",
                                             rb1:				Indikator1[0].getValue().rb1,
                                             rb2:				Indikator2[0].getValue().rb2,
                                             rb3:				Indikator3[0].getValue().rb3,
                                             rb4:   			Indikator4[0].getValue().rb4,
                                             rb5:   			Indikator5[0].getValue().rb5,
                                             rb6:   			Indikator6[0].getValue().rb6,
                                             rb7:   			Indikator7[0].getValue().rb7,
                                             rb8:   			Indikator8[0].getValue().rb8,
                                             rb1_note:			indikator1_note,
                                             rb2_note:			indikator2_note,
                                             rb3_note:			indikator3_note,
                                             rb4_note:   		indikator4_note,
                                             rb5_note:   		indikator5_note,
                                             rb6_note:   		indikator6_note,
                                             rb7_note:   		indikator7_note,
                                             rb8_note:   		indikator8_note,
                                             prb1:               Pertanyaan1[0].getValue().prb1,
                                             prb2:               Pertanyaan2[0].getValue().prb2,
                                             prb3:               Pertanyaan3[0].getValue().prb3,
                                             prb4:               Pertanyaan4[0].getValue().prb4,
                                             prb5:               Pertanyaan5,
                                             prb6:               Pertanyaan6,
                                             Rekomendasi1:       Rekomendasi1,
                                             Rekomendasi2:       Rekomendasi2,
                                             building_id:		 active_id,
                                             TanggalPengawasan:  DatePengawasan,
                                             WaktuPengawasan:    WaktuPengawasan,//arrWaktu[4],
                                             InstansiPengawas:   InstansiPengawas,
                                             NamaPengawas: 		NamaPengawas1,
                                             NamaPengawas2:      NamaPengawas2,
                                             NamaPengawas3:      NamaPengawas3,
                                             NamaPengawas4:      NamaPengawas4,
                                             id:idx

                                         },
                                         success: function(response){
                                             var result=eval(response.responseText);
                                             //	alert(result);
                                             switch(result){
                                                 case 1:
                                                     storePengawasan.load();
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


                            }


                            }
                          });
                         }
                        }
                    },
                    {
                        xtype: 'button',
                        margin: '0px 0px 0px 6px',
                        scale: 'medium',
                        ui: 's-button',
                        text: 'Cancel',
                        cls: 's-grey',
                        disabled: false,
                        handler:function(){

                            Ext.MessageBox.confirm('Message', 'Batalkan proses input data pengawasan ?' , function(btn){

                                if(btn == 'yes')
                                {
                                    win.hide();
                                }
                            });

                        }
                    }
                ]
            },
            {
                xtype: 'label',
                height:'10px',
                text:''
            }

        ]


    });
	
 	
		/*
		* window for Form Pengawasan
		*/
 		win = Ext.widget('window', {
            title: 'Berita Acara Pengawasan',
            closeAction: 'hide',
           	 height: 500,
			 width: 720,
            layout: 'fit',
           // resizable: true,
            autoScroll: true,
            modal: true,
            items: [FormPengawasan]
        });
   
	        
	
		/*
		*  Form Pengaduan
		*/
		PengaduanForm = Ext.create('Ext.form.Panel', {
	      frame: false,
         // height:320,
	      width: 470,
	      bodyPadding: 5,
		  
	      fieldDefaults: {
	         labelAlign: 'left',
	         labelWidth: 120,
	         anchor: '100%'
		},
	      items: [{
	         xtype: 'textfield', //3
			 id:'PersonName',
	         name: 'person_name',
	         fieldLabel: 'Nama',
			 labelWidth: 150,
	         value: '',
			 allowBlank: false //1
	      },{
	         xtype: 'textfield', //3
			 id:'PersonEmail',
	         name: 'person_email',
	         fieldLabel: 'Email',
		 	labelWidth: 150,
	         value: '',
			 allowBlank: false //1
	      },
		  {
	         xtype: 'combobox', //9
			 id:'Sumber',
 			 name: 'sumber',
	         fieldLabel: 'Sumber',
		     labelWidth: 150,
	         displayField: 'name',
	         store: Ext.create('Ext.data.Store', {
	            fields: [
	                {type: 'string', name: 'name'}
					], data: [
	                {"name":"Website"},
	                {"name":"SMS"},
	                {"name":"Email"}

			 ] }),
	         queryMode: 'local',
	         typeAhead: true
		  },
	 	  {
			    xtype: 'checkboxgroup',
			    labelWidth: 150,
	            height: 23,
	            width: '100%',
	            layout: {
	                type: 'fit'
	            },
	            fieldLabel: 'Jenis Pelanggaran',
	            vertical: true,
	            items: [
	                {
	                    xtype: 'checkboxfield',
	                    id:'ck1',
	                    boxLabel: 'Merokok di dalam gedung'
	                },
	                {
	                    xtype: 'checkboxfield',
	                    id:'ck2',
	                    boxLabel: 'Penandaan (Rusak/Tidak Ada)'
	                },
	                {
	                    xtype: 'checkboxfield',
	                    id:'ck3',
	                    boxLabel: 'Tersedia Ruang atau Area Khusus Merokok'
	                }
	            	]
			    },{
	         		xtype: 'datefield', //8
					 id:'DatePelanggaran',
			         name: 'date_pelanggaran',
				 	 labelWidth: 150,
			         fieldLabel: 'Tanggal Pelanggaran',
			         format:'Y-m-d'
	      		},{
	         		 xtype: 'datefield', //8
					 id:'DatePengaduan',
			         name: 'date_pengaduan',
				 	 labelWidth: 150,
			         fieldLabel: 'Tanggal Pengaduan',
				 	 format: 'Y-m-d'
		      	},{
	         		 xtype: 'textfield', //8
					 id:'TimePengaduan',
			         name: 'date_pengaduan',
				 	 labelWidth: 150,
                     placeholder:'hh:mm',
			         fieldLabel: 'Waktu Pengaduan'
		      	},

              {
                  xtype: 'fieldset',
                  border:0,
                  height: 43,
                  padding: 5,
                  items: [
                      {
                          xtype: 'button',
                          margin: '0px 0px 0px 6px',
                          scale: 'medium',
                          ui: 's-button',
                          text: '   Save   ',
                          cls: 's-blue',
                          disabled: false,
                          handler:function(){

                              Ext.MessageBox.confirm('Message', 'Simpan data pengaduan ?' , function(btn){

                                  if(btn == 'yes')
                                  {
                                     // var form = PengaduanForm.getForm();

                                      var person_name 	 = Ext.getCmp('PersonName').getValue();
                                      var person_email = Ext.getCmp('PersonEmail').getValue();
                                      var pelanggaran 	 = (Ext.getCmp('ck1').getValue())?1:0;
                                      var pelanggaran2	 = (Ext.getCmp('ck2').getValue())?1:0;
                                      var pelanggaran3 	 = (Ext.getCmp('ck3').getValue())?1:0;
                                      var date_pelanggaran = Ext.getCmp('DatePelanggaran').getRawValue();
                                      var sumber 			 = Ext.getCmp('Sumber').getValue();
                                      var date_pengaduan   = Ext.getCmp('DatePengaduan').getRawValue();
                                      var time_pengaduan   = Ext.getCmp('TimePengaduan').getValue();

                                     // var arrWaktu = String(time_pengaduan).split(' ');
                                     // console.log(arrWaktu);

                                      if(status!='update'){
                                      Ext.Ajax.request({
                                          waitMsg: 'Please wait...',
                                          url: base_url+'/index.php/interface/monitoring/insert_pengaduan?v=insert',
                                          params: {
                                              task: "INSERT",
                                              person_name:			person_name,
                                              person_email:			person_email,
                                              pelanggaran:			pelanggaran,
                                              pelanggaran2:			pelanggaran2,
                                              pelanggaran3:			pelanggaran3,
                                              date_pelanggaran:   	date_pelanggaran,
                                              sumber:   				sumber,
                                              date_pengaduan:   		date_pengaduan,
                                              time_pengaduan:   		time_pengaduan,//arrWaktu[4],
                                              building_id:			active_id


                                          },
                                          success: function(response){
                                              //var result=eval(response.responseText);
                                           //   console.log(response.responseText)
                                              result=1;
                                              //	alert(result);
                                              switch(result){
                                                  case 1:
                                                      winPengaduan.hide();
                                                      store.load();
                                                      status='insert';
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
                                      } else {
                                          Ext.Ajax.request({
                                              waitMsg: 'Please wait...',
                                              url: base_url+'/index.php/interface/monitoring/update_pengaduan',
                                              params: {
                                                  task: "INSERT",
                                                  person_name:			person_name,
                                                  person_email:			person_email,
                                                  pelanggaran:			pelanggaran,
                                                  pelanggaran2:			pelanggaran2,
                                                  pelanggaran3:			pelanggaran3,
                                                  date_pelanggaran:   	date_pelanggaran,
                                                  sumber:   				sumber,
                                                  date_pengaduan:   		date_pengaduan,
                                                  time_pengaduan:   		time_pengaduan,//arrWaktu[4],
                                                  building_id:			active_id,
                                                  id_pengaduan:         idx


                                              },
                                              success: function(response){
                                                  //var result=eval(response.responseText);
                                                  //   console.log(response.responseText)
                                                  result=1;
                                                  //	alert(result);
                                                  switch(result){
                                                      case 1:
                                                          winPengaduan.hide();
                                                          storeP.load();
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



                                  }
                              });

                          }
                      },
                      {
                          xtype: 'button',
                          margin: '0px 0px 0px 6px',
                          scale: 'medium',
                          ui: 's-button',
                          text: 'Cancel',
                          cls: 's-grey',
                          disabled: false,
                          handler:function(){

                              Ext.MessageBox.confirm('Message', 'Batalkan proses input data pengaduan ?' , function(btn){

                                  if(btn == 'yes')
                                  {
                                      winPengaduan.hide();
                                  }
                              });

                          }
                      }]
              }
          ]
//            ,
//
//				buttons: [{
//				      text: 'Save',
//				      handler: function() {
//					   var form = this.up('form').getForm();
//
//						var person_name 	 = Ext.getCmp('PersonName').getValue();
//						var person_email = Ext.getCmp('PersonEmail').getValue();
//						var pelanggaran 	 = (Ext.getCmp('ck1').getValue())?1:0;
//						var pelanggaran2	 = (Ext.getCmp('ck2').getValue())?1:0;
//						var pelanggaran3 	 = (Ext.getCmp('ck3').getValue())?1:0;
//						var date_pelanggaran = Ext.getCmp('DatePelanggaran').getRawValue();
//						var sumber 			 = Ext.getCmp('Sumber').getValue();
//						var date_pengaduan   = Ext.getCmp('DatePengaduan').getRawValue();
//						var time_pengaduan   = Ext.getCmp('TimePengaduan').getValue();
//
//						var arrWaktu = String(time_pengaduan).split(' ');
//						console.log(arrWaktu);
//
//						Ext.Ajax.request({
//							waitMsg: 'Please wait...',
//							url: base_url+'/index.php/interface/monitoring/insert_pengaduan?v=insert',
//							params: {
//							task: "INSERT",
//							person_name:			person_name,
//						    person_email:			person_email,
//							pelanggaran:			pelanggaran,
//							pelanggaran2:			pelanggaran2,
//							pelanggaran3:			pelanggaran3,
//							date_pelanggaran:   	date_pelanggaran,
//							sumber:   				sumber,
//							date_pengaduan:   		date_pengaduan,
//							time_pengaduan:   		arrWaktu[4],
//							building_id:			active_id
//
//
//						},
//						success: function(response){
//							//var result=eval(response.responseText);
//							console.log(response.responseText)
//							result=1;
//						//	alert(result);
//								switch(result){
//									case 1:
//								//	store.load();
//									break;
//									default:
//									Ext.MessageBox.alert('Warning...','We couldn\'t change this data...');
//									break;
//								}
//						},
//						failure: function(response){
//							var result=response.responseText;
//							Ext.MessageBox.alert('error','Could not connect to the database. Retry later');
//							}
//						});
//
//							winPengaduan.hide(this, function() {
//								//store.sync();
//								store.load();
//						            });
//
//
//					  }
//					},
//					{
//				      text: 'Close',
//				      handler: function() {
//				         winPengaduan.hide();
//						}
//
//				  }]

		});

    var PrintForm;
    /// form print
    PrintForm = Ext.create('Ext.form.Panel', {
        frame: false,
        width: 450,
        bodyPadding: 5,

        fieldDefaults: {
            labelAlign: 'left',
            labelWidth: 120,
            anchor: '100%'
        },
        items: [ {
            xtype: 'combobox',
            minWidth:'300',
            labelWidth: 150,
            anchor: '100%',
            fieldLabel: 'Instansi',
            id:'pInstansiPengawas',
            displayField: 'inst_code',
            valueField: 'inst_id',
            store: storeInstansi,
            queryMode: 'local',
            typeAhead: true
            //  flex: 1


        },{
            xtype: 'textfield', //3
            id:'ttl_pengaduan',
            name: 'ttl_pengaduan',
            fieldLabel: 'Pengaduan',
            labelWidth: 150,
            value: '1',
            allowBlank: false //1
        },
            {
                xtype: 'combobox', //9
                id:'pSumber',
                name: 'psumber',
                fieldLabel: 'Sumber',
                labelWidth: 150,
                displayField: 'name',
                store: Ext.create('Ext.data.Store', {
                    fields: [
                        {type: 'string', name: 'name'}
                    ], data: [
                        {"name":"Website"},
                        {"name":"SMS"},
                        {"name":"Email"}

                    ] }),
                queryMode: 'local',
                typeAhead: true
            },
            {

                xtype: 'checkboxgroup',
                labelWidth: 150,
                height: 23,
                width: '100%',
                layout: {
                    type: 'fit'
                },
                fieldLabel: 'Jenis Pelanggaran',
                vertical: true,
                items: [
                    {
                        xtype: 'checkboxfield',
                        id:'ckp1',
                        boxLabel: 'Merokok di dalam gedung'
                    },
                    {
                        xtype: 'checkboxfield',
                        id:'ckp2',
                        boxLabel: 'Penandaan (Rusak/Tidak Ada)'
                    },
                    {
                        xtype: 'checkboxfield',
                        id:'ckp3',
                        boxLabel: 'Tersedia Ruang atau Area Khusus Merokok'
                    }
                ]
            },{
                xtype: 'datefield', //8
                id:'pDatePelanggaran',
                name: 'pdate_pelanggaran',
                labelWidth: 150,
                fieldLabel: 'Tanggal Pengaduan',
                format:'Y-m-d'
            },{
                xtype: 'textfield', //3
                id:'no_fax',
                name: 'no_fax',
                fieldLabel: 'Fax No',
                labelWidth: 150,
                value: '-',
                allowBlank: false
            }, {
                xtype: 'combobox', //9
                id:'pJenis',
                name: 'pjenis',
                fieldLabel: 'Jenis',
                labelWidth: 150,
                displayField: 'name',
                hidden:true,
                store: Ext.create('Ext.data.Store', {
                    fields: [
                        {type: 'string', name: 'name'}
                    ], data: [
                        {"name":"Pemberitahuan"},
                        {"name":"SP1"},
                        {"name":"SP2"},
                        {"name":"SP3"}


                    ] }),
                queryMode: 'local',
                typeAhead: true
            }, {

                xtype: 'checkboxgroup',
                labelWidth: 150,
                height: 23,
                width: '100%',
                layout: {
                    type: 'fit'
                },
                hidden:true,
                fieldLabel: 'Pelanggaran berulang ? ',
                vertical: true,
                items: [
                    {
                        xtype: 'checkboxfield',
                        id:'ckberulang',
                        boxLabel: ''
                    }
                ]
            }],
        buttons: [{
            margin: '0px 6px 0px 6px',
            scale: 'medium',
            ui: 's-button',
            text: 'Print',
            cls: 's-blue',
            disabled: false,
            handler: function() {
            //    var form = this.up('form').getForm();
                //  alert('h'+active_id);
                var _instansiId         = Ext.getCmp('pInstansiPengawas').getValue();
                var _ttl_pengaduan      = Ext.getCmp('ttl_pengaduan').getValue();
                var _pelanggaran 	    = (Ext.getCmp('ckp1').getValue())?1:0;
                var _pelanggaran2	    = (Ext.getCmp('ckp2').getValue())?1:0;
                var _pelanggaran3 	    = (Ext.getCmp('ckp3').getValue())?1:0;
                var _date_pelanggaran   = Ext.getCmp('pDatePelanggaran').getRawValue();
                var _pSumber 		    = Ext.getCmp('pSumber').getValue();
                var _faxNum             = Ext.getCmp('no_fax').getValue();
                var _typeSurat          = Ext.getCmp('pJenis').getValue();
                var _sBerulang          = (Ext.getCmp('ckberulang').getValue())?1:0;

             //   console.log(_pSumber);
               // console.log(Ext.getCmp('pJenis').getValue());
                var recInstansi = storeInstansi.findRecord('inst_id',_instansiId);
                var _instansiCode = recInstansi.data.inst_code;
                var _instansiHeadName = recInstansi.data.inst_head;
                var _instansiHeadId =  recInstansi.data.inst_head_id;

                //hide parent window





//                // ajax call
//                Ext.Ajax.request({
//                    waitMsg: 'Please wait...',
//                    url: base_url+'/index.php/interface/monitoring/update_surat_penegakan_hukum_status',
//                    params: {
//                        task: "UPDATE",
//                        row:'status',
//                        jenis:					_typeSurat,
//                        berulang:			    _sBerulang,
//                        id:			            aresult.data[0]
//                    },
//                    success: function(response){
//                        //var result=eval(response.responseText);
//                        var result = Ext.decode(response.responseText);
//                        console.log(result);
//
//                    },
//                    failure: function(response){
//                        var result=response.responseText;
//                        Ext.MessageBox.alert('error','Could not connect to the database. Retry later');
//                    }
//                });


               // var jenis=aresult.data[2];
               console.log(aresult.data[2]);
                console.log(aresult.data[4]);
               if(aresult.data[2]=='Pemberitahuan' && aresult.data[3]!=999){
                            preview_cetak_surat(base_url+'/surat/surat_pemberitahuan.php?bname='+bname+'&baddr='+baddr+'&bcity='+bcity+'&bperson='+_instansiHeadName+'&bpersoncode='+_instansiHeadId+'&instansi='+_instansiCode+'&num_pengaduan='+_ttl_pengaduan+'&pelanggaran='+_pelanggaran+'&pelanggaran2='+_pelanggaran2+'&pelanggaran3='+_pelanggaran3+'&date_pelanggaran='+_date_pelanggaran+'&sumber='+_pSumber+'&faxNum='+_faxNum);
               } else if (aresult.data[2]=='SP1' && aresult.data[3]!=999) {
                            preview_cetak_surat(base_url+'/surat/surat_peringatan_pengaduan.php?bname='+bname+'&baddr='+baddr+'&bcity='+bcity+'&bperson='+_instansiHeadName+'&bpersoncode='+_instansiHeadId+'&instansi='+_instansiCode+'&num_pengaduan='+_ttl_pengaduan+'&pelanggaran='+_pelanggaran+'&pelanggaran2='+_pelanggaran2+'&pelanggaran3='+_pelanggaran3+'&date_pelanggaran='+_date_pelanggaran+'&sumber='+_pSumber+'&faxNum='+_faxNum);
               } else if(aresult.data[2]=='SP2' && aresult.data[3]!=999) {
                            preview_cetak_surat(base_url+'/surat/surat_peringatan_pengaduan2.php?bname='+bname+'&baddr='+baddr+'&bcity='+bcity+'&bperson='+_instansiHeadName+'&bpersoncode='+_instansiHeadId+'&instansi='+_instansiCode+'&num_pengaduan='+_ttl_pengaduan+'&pelanggaran='+_pelanggaran+'&pelanggaran2='+_pelanggaran2+'&pelanggaran3='+_pelanggaran3+'&date_pelanggaran='+_date_pelanggaran+'&sumber='+_pSumber+'&faxNum='+_faxNum);
               } else if(aresult.data[2]=='SP3' && aresult.data[3]!=999) {
                            preview_cetak_surat(base_url+'/surat/surat_peringatan_pengaduan3.php?bname='+bname+'&baddr='+baddr+'&bcity='+bcity+'&bperson='+_instansiHeadName+'&bpersoncode='+_instansiHeadId+'&instansi='+_instansiCode+'&num_pengaduan='+_ttl_pengaduan+'&pelanggaran='+_pelanggaran+'&pelanggaran2='+_pelanggaran2+'&pelanggaran3='+_pelanggaran3+'&date_pelanggaran='+_date_pelanggaran+'&sumber='+_pSumber+'&faxNum='+_faxNum);
               } else {
                     Ext.MessageBox.alert('Alert','Sudah lebih dari 3 kali peringatan');
               }

                winpPengaduan.hide();
                winDetil.hide();
                store.load();

                }


        },{
            margin: '0px 6px 0px 6px',
            scale: 'medium',
            ui: 's-button',
            text: 'Close',
            cls: 's-grey',
            disabled: false,
            handler: function() {
                winpPengaduan.hide();
            }

        }
        ]

    });

		//winpPengaduan.show();

  //  }
	//print surat pengaduan
	winpPengaduan = Ext.create('widget.window', {
	    title: 'Cetak Surat',
   	    closable: true,
        closeAction: 'hide',
        width: 470,
        minWidth: 400,
        height: 350,
		modal: true,
        layout: {
            type: 'border',
            padding: 5
        },
     	items: [PrintForm]
	});

 	function displayPrintFormWindow(){
		if(!winpPengaduan.isVisible()){	 
			winpPengaduan.show();
		} else {
			winpPengaduan.hide(this, function() {
		             
		    });
			winpPengaduan.toFront();
		}
	}


    //Form Print Summary pengawasan
    /// form print
    PrintSummaryPengawasan = Ext.create('Ext.form.Panel', {
        frame: false,
        width: 440,
        bodyPadding: 5,

        fieldDefaults: {
            labelAlign: 'left',
            labelWidth: 120,
            anchor: '100%'
        },
        items: [ {
            xtype: 'textfield', //3
            id:'psNoSuratPengawasan',
            name: 'psNoSuratPengawasan',
            fieldLabel: 'No. Surat',
            labelWidth: 150,
            value: '-',
            allowBlank: false //1
        },{
            xtype: 'datefield', //8
            id:'psDateSurat',
            name: 'psDateSurat',
            labelWidth: 150,
            fieldLabel: 'Tanggal surat tugas',
            format:'Y-m-d',
            value: new Date()
        }, {
            xtype: 'textareafield', //3
            id:'psKetSurat',
            name: 'psKetSurat',
            fieldLabel: 'Tentang',
            labelWidth: 150,
            value: '-',
            allowBlank: false //1
        }],
        buttons: [{
            margin: '0px 6px 0px 6px',
            scale: 'medium',
            ui: 's-button',
            text: 'Print',
            cls: 's-blue',
            disabled: false,
            handler: function() {
                var form = this.up('form').getForm();
                //  alert('h'+active_id);
                var _no_surat = Ext.getCmp('psNoSuratPengawasan').getValue();
                var _date_surat = Ext.getCmp('psDateSurat').getRawValue();
                var _ket_surat =  Ext.getCmp('psKetSurat').getValue();
                winpsPengawasan.hide();
                preview_cetak_surat(base_url+'/surat/berita_acara_pengawasan.php?id='+idx+'&no_surat='+_no_surat+'&date_surat='+_date_surat+'&ket_surat='+_ket_surat);
                winDetil.hide();



            }
        },{
            margin: '0px 6px 0px 6px',
            scale: 'medium',
            ui: 's-button',
            text: 'Close',
            cls: 's-grey',
            disabled: false,
            handler: function() {
                winpsPengawasan.hide();
            }
        }
        ]

    });

    //print surat pengaduan
    winpsPengawasan = Ext.create('widget.window', {
        title: 'Laporan Pengawasan',
        closable: true,
        closeAction: 'hide',
        width: 470,
        minWidth: 400,
        height: 210,
        modal: true,
        layout: {
            type: 'border',
            padding: 10
        },
        items: [PrintSummaryPengawasan]
    });



    // Form print pengawasan
    PrintFormPengawasan = Ext.create('Ext.form.Panel', {
        frame: false,
        width: 440,
        bodyPadding: 5,

        fieldDefaults: {
            labelAlign: 'left',
            labelWidth: 120,
            anchor: '100%'
        },
        items: [ {
            xtype: 'combobox',
            minWidth:'300',
            labelWidth: 150,
            anchor: '100%',
            fieldLabel: 'Instansi',
            id:'pInstansiPengawasan',
            displayField: 'inst_code',
            valueField: 'inst_id',
            store: storeInstansi,
            queryMode: 'local',
            typeAhead: true
            //  flex: 1


        },{
            xtype: 'datefield', //8
            id:'pDatePengawasan',
            name: 'pDatePengawasan',
            labelWidth: 150,
            fieldLabel: 'Tanggal Pengawasan',
            format:'Y-m-d'
        },{
            xtype: 'textfield', //3
            id:'pNoSuratPengawasan',
            name: 'pNoSuratPengawasan',
            fieldLabel: 'No. Surat Tugas',
            labelWidth: 150,
            value: '-',
            allowBlank: false //1
        },{
            xtype: 'datefield', //8
            id:'pDateSurat',
            name: 'pDateSurat',
            labelWidth: 150,
            fieldLabel: 'Tanggal Surat Tugas ',
            format:'Y-m-d',
            value:new Date()
        }, {
            xtype: 'textareafield', //3
            id:'pKetSurat',
            name: 'pKetSurat',
            fieldLabel: 'Tentang',
            labelWidth: 150,
            value: '-',
            allowBlank: false //1
        },{
            xtype: 'combobox', //9
            id:'ptypeSuratPengawasan',
            name: 'ptypeSuratPengawasan',
            fieldLabel: 'Jenis Surat',
            labelWidth: 150,
            displayField: 'name',
            store: Ext.create('Ext.data.Store', {
                fields: [
                    {type: 'string', name: 'name'}
                ], data: [
                    {"name":"SP1"},
                    {"name":"SP2"},
                    {"name":"SP3"},


                ] }),
            hidden:true,
            queryMode: 'local',
            typeAhead: true
        },{
            xtype: 'checkboxgroup',
            labelWidth: 150,
            height: 23,
            width: '100%',
            layout: {
                type: 'fit'
            },
            hidden:true,
            fieldLabel: 'Pelanggaran Berulang ?  ',
            vertical: true,
            items: [{
                xtype: 'checkboxfield',
                id:'pberulangPengawasan',
                boxLabel: ''
            }]

        }],
        buttons: [{
            margin: '0px 6px 0px 6px',
            scale: 'medium',
            ui: 's-button',
            text: 'Print',
            cls: 's-blue',
            disabled: false,
            handler: function() {
                var form = this.up('form').getForm();
                //  alert('h'+active_id);
                var _instansiId 	 = Ext.getCmp('pInstansiPengawasan').getValue();
                var _date_pengawasan = Ext.getCmp('pDatePengawasan').getRawValue();
                var _no_surat = Ext.getCmp('pNoSuratPengawasan').getValue();
                var _date_surat = Ext.getCmp('pDateSurat').getRawValue();
                var _ket_surat =  Ext.getCmp('pKetSurat').getValue();
                // var date_pengaduan   = Ext.getCmp('DatePengaduan').getRawValue();
                // var time_pengaduan   = Ext.getCmp('TimePengaduan').getValue();
                var recInstansi = storeInstansi.findRecord('inst_id',_instansiId);
                var _instansiCode = recInstansi.data.inst_code;
                var _instansiHeadName = recInstansi.data.inst_head;
                var _instansiHeadId =  recInstansi.data.inst_head_id;

                var _typeSurat          = Ext.getCmp('ptypeSuratPengawasan').getValue();
                var _sBerulang          = (Ext.getCmp('pberulangPengawasan').getValue())?1:0;


                // ajax call
                var jenis='Peringatan';
//                Ext.Ajax.request({
//                    waitMsg: 'Please wait...',
//                    url: base_url+'/index.php/interface/monitoring/update_surat_penegakan_hukum_status',
//                    params: {
//                        task: "UPDATE",
//                        row:'status',
//                        jenis:					jenis,
//                        berulang:			    _sBerulang,
//                        id:			            aresult.data[0]
//                    },
//                    success: function(response){
//                        //var result=eval(response.responseText);
//                        var result = Ext.decode(response.responseText);
//                        console.log(result);
//
//                    },
//                    failure: function(response){
//                        var result=response.responseText;
//                        Ext.MessageBox.alert('error','Could not connect to the database. Retry later');
//                    }
//                });




                console.log(_instansiHeadName);

                console.log(aresult.data[3]);
                    if(aresult.data.length >0){
                  //  if(jenis=='Peringatan'){
                        if(aresult.data[2]=='SP1'){
                            preview_cetak_surat(base_url+'/surat/surat_peringatan_pengawasan.php?bname='+bname+'&baddr='+baddr+'&bcity='+bcity+'&bperson='+_instansiHeadName+'&bpersoncode='+_instansiHeadId+'&instansi='+_instansiCode+'&date_pengawasan='+_date_pengawasan+'&noSurat='+_no_surat+'&date_surat='+_date_surat+'&ketSurat='+_ket_surat+'&indikator1='+_pindikator1+'&indikator2='+_pindikator2+'&indikator3='+_pindikator3+'&indikator4='+_pindikator4+'&indikator5='+_pindikator5+'&indikator6='+_pindikator6+'&indikator7='+_pindikator7+'&indikator8='+_pindikator8);

                        } else if(aresult.data[2]=='SP2'){
                            preview_cetak_surat(base_url+'/surat/surat_peringatan_pengawasan2.php?bname='+bname+'&baddr='+baddr+'&bcity='+bcity+'&bperson='+_instansiHeadName+'&bpersoncode='+_instansiHeadId+'&instansi='+_instansiCode+'&date_pengawasan='+_date_pengawasan+'&noSurat='+_no_surat+'&date_surat='+_date_surat+'&ketSurat='+_ket_surat+'&indikator1='+_pindikator1+'&indikator2='+_pindikator2+'&indikator3='+_pindikator3+'&indikator4='+_pindikator4+'&indikator5='+_pindikator5+'&indikator6='+_pindikator6+'&indikator7='+_pindikator7+'&indikator8='+_pindikator8);
                        } else if(aresult.data[2]=='SP3'){
                            preview_cetak_surat(base_url+'/surat/surat_peringatan_pengawasan3.php?bname='+bname+'&baddr='+baddr+'&bcity='+bcity+'&bperson='+_instansiHeadName+'&bpersoncode='+_instansiHeadId+'&instansi='+_instansiCode+'&date_pengawasan='+_date_pengawasan+'&noSurat='+_no_surat+'&date_surat='+_date_surat+'&ketSurat='+_ket_surat+'&indikator1='+_pindikator1+'&indikator2='+_pindikator2+'&indikator3='+_pindikator3+'&indikator4='+_pindikator4+'&indikator5='+_pindikator5+'&indikator6='+_pindikator6+'&indikator7='+_pindikator7+'&indikator8='+_pindikator8);

                        } else {


                        }
                    } else {
                        Ext.MessageBox.alert('Alert','Sudah lebih dari 3 kali peringatan');
                    }
                    winpPengawasan.hide();
                    winDetil.hide();


                }

//            }
        },{
            margin: '0px 6px 0px 6px',
            scale: 'medium',
            ui: 's-button',
            text: 'Close',
            cls: 's-grey',
            disabled: false,
            handler: function() {
                winpPengawasan.hide();
            }
        }
        ]

    });

    //winpPengaduan.show();

    //  }
    //print surat pengaduan
    winpPengawasan = Ext.create('widget.window', {
        title: 'Cetak Surat',
        closable: true,
        closeAction: 'hide',
        width: 470,
        minWidth: 400,
        height: 320,
        modal: true,
        layout: {
            type: 'border',
            padding: 10
        },
        items: [PrintFormPengawasan]
    });

    function displayPrintFormPengawasanWindow(){
        if(!winpPengawasan.isVisible()){
            winpPengawasan.show();
        } else {
            winpPengawasan.hide(this, function() {

            });
            winpPengawasan.toFront();
        }
    }


	winPengaduan = Ext.create('widget.window', {
	    title: 'Data Pengaduan',
   	    closable: true,
        closeAction: 'hide',
        width: 500,
        minWidth: 400,
        height: 340,

		modal: true,
        layout: {
            type: 'border',
            padding: 5
        },
    	items: [PengaduanForm]
	});
				
	function displayFormWindow(){
		if(!winPengaduan.isVisible()){
			 
			winPengaduan.show();
		
		} else {
			winPengaduan.hide(this, function() {
		             
		            });
			winPengaduan.toFront();
		}
	}



    //Model Pengaduan
    Ext.define('PengaduanModel', {
        extend: 'Ext.data.Model',
        fields: ['id_pengaduan','person_name','person_email','building_id','building_name','pelanggaran','pelanggaran2','pelanggaran3','sumber','date_pelanggaran','date_pengaduan','time_pengaduan']
    });
    var storeP = Ext.create('Ext.data.JsonStore', {
        model: 'PengaduanModel',
        proxy: {
            type: 'ajax',
            url: base_url+'/index.php/interface/monitoring/json_listing_pengaduan',
            reader: {
                type: 'json',
                root: 'data'
            }
        }
    });

    //Model Pengawasan	
    Ext.define('PengawasanModel', {
        extend: 'Ext.data.Model',
        fields: ['id',
            'indikator1',
            'indikator1_note',
            'indikator2',
            'indikator2_note',
            'indikator3',
            'indikator3_note',
            'indikator4',
            'indikator4_note',
            'indikator5',
            'indikator5_note',
            'indikator6',
            'indikator6_note',
            'indikator7',
            'indikator7_note',
            'indikator8',
            'indikator8_note',
            'pertanyaan1',
            'pertanyaan2',
            'pertanyaan3',
            'pertanyaan4',
            'pertanyaan5',
            'pertanyaan6',
            'rekomendasi1',
            'rekomendasi2',
            'building_id',
            'building_name',
            'pengawas_id',

            'pengawas_id2',

            'pengawas_id3',

            'pengawas_id4',

            'inst_id',
            'inst_code',
            'time_pengawasan',
            'result_status',
            'result_status_donor',
            'created_dttm',
            'no_surat',
            'tanggal_surat',
            'ket_surat' ]
    });

    var storePengawasan = Ext.create('Ext.data.JsonStore', {
        model: 'PengawasanModel',
        proxy: {
            type: 'ajax',
            url: base_url+'/index.php/interface/monitoring/json_get_pengawasan?building_id='+active_id,
            reader: {
                type: 'json',
                root: 'data'
            }
        }
    });
    storePengawasan.load();

    //Model Penegakan Hukum
    Ext.define('PenegakanModel', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'id', type: 'integer'},
            {name: 'tanggal_surat', type: 'string'},
            {name: 'seq', type: 'integer'},
            {name: 'jenis', type: 'string'},
            {name: 'building_id', type: 'string'},
            {name: 'feedback', type: 'bool'},
            // dates can be automatically converted by specifying dateFormat
            {name: 'feedback_date'},
            {name: 'count_down'},
            {name: 'referensi'},
            {name: 'delivery_status'},
            {name: 'status'}
        ]
    });
    var storePenegakan = Ext.create('Ext.data.JsonStore', {
        model: 'PenegakanModel',
        proxy: {
            type: 'ajax',
            url: base_url+'/index.php/interface/monitoring/json_listing_penegakan',
            reader: {
                type: 'json',
                root: 'data'
            }
        }
    });


    //Grid Tab Pengaduan
    Ext.define('DataGrid', {
        extend: 'Ext.grid.Panel',
        alias: 'widget.datagrid',
        store: storeP,
        width: '100%',
        columns: [
            Ext.create('Ext.grid.RowNumberer'), //2
            {
                text: 'id',//3
                dataIndex: 'id_pengaduan',
                hidden:true
            },
            {
                text: 'Nama',//3
                width: 100,
                dataIndex: 'person_name'
            },
            {
                text: 'Email', //4
                width: 120,
                dataIndex: 'person_email'

            },{

                text: 'Sumber', //4
                width: 100,
                dataIndex: 'sumber'

            },{

                text: 'Tanggal Pelanggaran', //4
                width: 120,
                dataIndex: 'date_pelanggaran'

            },{

                text: 'Tanggal Pengaduan', //4
                width: 120,
                dataIndex: 'date_pengaduan'

            },{

                text: 'Waktu Pengaduan', //4
                width: 120,
                dataIndex: 'time_pengaduan'

            },{

                text: 'Jenis Pelanggaran1', //4
                width: 150,
                dataIndex: 'pelanggaran'

            },{

                text: 'Jenis Pelanggaran2', //4
                width: 150,
                dataIndex: 'pelanggaran2'

            },{

                text: 'Jenis Pelanggaran3', //4
                width: 200,
                dataIndex: 'pelanggaran3'

            },{
                xtype:'actioncolumn',
                width:70,
                padding:'4',
                items: [
                    {
                        icon: base_url+'/images/icons/silk/application_form_edit.png',
                        tooltip: 'Edit Pengaduan',
                        iconCls: 'mousepointer',
                        handler: function(grid, rowIndex, colIndex) {
                            var rec = grid.getStore().getAt(rowIndex);
                            console.log(rec);
                            resetFormPengaduan();
                            displayFormWindow();
                            Ext.getCmp('PersonName').setValue(rec.data.person_name);
                            Ext.getCmp('PersonEmail').setValue(rec.data.person_email);
                            Ext.getCmp('Sumber').setValue(rec.data.sumber);
                            var pel1 = (rec.data.pelanggaran!='-')?'true':'false';
                            console.log(pel1);
                            Ext.getCmp('ck1').setValue((rec.data.pelanggaran!='-')?'true':'false');
                            Ext.getCmp('ck2').setValue((rec.data.pelanggaran2!='-')?'true':'false');
                            Ext.getCmp('ck3').setValue((rec.data.pelanggaran3!='-')?'true':'false');
                            Ext.getCmp('DatePelanggaran').setValue(rec.data.date_pelanggaran);
                            Ext.getCmp('DatePengaduan').setValue(rec.data.date_pengaduan);
                            Ext.getCmp('TimePengaduan').setValue(rec.data.time_pengaduan);
                            idx = rec.data.id_pengaduan;
                            status='update';
                            // var tanggal_surat = rec.data.tanggal_surat;
                            // var jenis = rec.data.jenis;
                            // var seq = rec.data.seq;

                        }

                    },
                    {
                        icon: base_url+'/images/icons/silk/error_add.png',
                        tooltip: 'Kirim Surat Pemberitahuan',
                        iconCls: 'mousepointer',
                        handler: function(grid, rowIndex, colIndex) {
                            console.log('update feedback');
                            var rec = grid.getStore().getAt(rowIndex);
                            console.log(rec);
                         //   idx = rec.data.id_pengaduan;
                            // var tanggal_surat = rec.data.tanggal_surat;
                            // var jenis = rec.data.jenis;
                            // var seq = rec.data.seq;
                            var sDate = rec.data.date_pengaduan;
                            var dateArray = sDate.split("-");
                            sDatePengaduan = new Date(dateArray[0], dateArray[1], dateArray[2]);
                            //console.log(idx);

//                 var aa = Ext.Date.format(sDatePengaduan, 'Y-m-d')
//                  console.log(aa);
                            Ext.MessageBox.confirm('Message', 'Kirim surat ?' , function(btn){

                                if(btn == 'yes')
                                {
                                    var jenis = 'Pemberitahuan';

                                    Ext.Ajax.request({
                                        waitMsg: 'Please wait...',
                                        url: base_url+'/index.php/interface/monitoring/insert_penegakan?v=insert',
                                        params: {
                                            task: "INSERT",
                                            jenis:					jenis,
                                            building_id:			active_id


                                        },
                                        success: function(response){
                                            var result = Ext.decode(response.responseText);
                                            //console.log(result);
                                            aresult = result;
                                            console.log(aresult);

                                            //	alert(result);
                                            // printForm(result.data[3],'Pemberitahuan');
                                            if(aresult.data[3]!=999){
                                                displayPrintFormWindow();
                                                var dateField = Ext.getCmp('pDatePelanggaran');
                                                dateField.format = 'Y-m-d';
                                                dateField.setValue(sDate);
                                            } else {
                                                Ext.MessageBox.alert('Alert','Sudah lebih dari 3 kali peringatan. Sanksi selanjutnya adalah melakukan pengumuman ke media. ');

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

                    }]
            }
        ]
    });

    //Grid Tab Pengaduan
    Ext.define('DataGridList', {
        extend: 'Ext.grid.Panel',
        alias: 'widget.datagridlist',
        store: storeP,
        width: '100%',
        height:150,
        columns: [
//            Ext.create('Ext.grid.RowNumberer'), //2
            {
                text: 'id',//3
                dataIndex: 'id_pengaduan',
                hidden:true
            },
            {
                text: 'Nama',//3
                width: 100,
                dataIndex: 'person_name'
            },
            {
                text: 'Email', //4
                width: 120,
                dataIndex: 'person_email'

            },{

                text: 'Sumber', //4
                width: 100,
                dataIndex: 'sumber'

            },{

                text: 'Tanggal Pelanggaran', //4
                width: 120,
                dataIndex: 'date_pelanggaran'

            },{

                text: 'Tanggal Pengaduan', //4
                width: 120,
                dataIndex: 'date_pengaduan'

            },{

                text: 'Waktu Pengaduan', //4
                width: 120,
                dataIndex: 'time_pengaduan'

            }
//            ,{
//
//                text: 'Jenis Pelanggaran1', //4
//                width: 150,
//                dataIndex: 'pelanggaran'
//
//            },{
//
//                text: 'Jenis Pelanggaran2', //4
//                width: 150,
//                dataIndex: 'pelanggaran2'
//
//            },{
//
//                text: 'Jenis Pelanggaran3', //4
//                width: 200,
//                dataIndex: 'pelanggaran3'
//
//            },
//            {
//                xtype:'actioncolumn',
//                width:70,
//                padding:'4',
//                items: [
//                    {
//                        icon: base_url+'/images/icons/silk/application_form_edit.png',
//                        tooltip: 'Edit Pengaduan',
//                        iconCls: 'mousepointer',
//                        handler: function(grid, rowIndex, colIndex) {
//                            var rec = grid.getStore().getAt(rowIndex);
//                            console.log(rec);
//                            resetFormPengaduan();
//                            displayFormWindow();
//                            Ext.getCmp('PersonName').setValue(rec.data.person_name);
//                            Ext.getCmp('PersonEmail').setValue(rec.data.person_email);
//                            Ext.getCmp('Sumber').setValue(rec.data.sumber);
//                            var pel1 = (rec.data.pelanggaran!='-')?'true':'false';
//                            console.log(pel1);
//                            Ext.getCmp('ck1').setValue((rec.data.pelanggaran!='-')?'true':'false');
//                            Ext.getCmp('ck2').setValue((rec.data.pelanggaran2!='-')?'true':'false');
//                            Ext.getCmp('ck3').setValue((rec.data.pelanggaran3!='-')?'true':'false');
//                            Ext.getCmp('DatePelanggaran').setValue(rec.data.date_pelanggaran);
//                            Ext.getCmp('DatePengaduan').setValue(rec.data.date_pengaduan);
//                            Ext.getCmp('TimePengaduan').setValue(rec.data.time_pengaduan);
//                            idx = rec.data.id_pengaduan;
//                            status='update';
//                            // var tanggal_surat = rec.data.tanggal_surat;
//                            // var jenis = rec.data.jenis;
//                            // var seq = rec.data.seq;
//
//                        }
//
//                    },
//                    {
//                        icon: base_url+'/images/icons/silk/error_add.png',
//                        tooltip: 'Kirim Surat Pemberitahuan',
//                        iconCls: 'mousepointer',
//                        handler: function(grid, rowIndex, colIndex) {
//                            console.log('update feedback');
//                            var rec = grid.getStore().getAt(rowIndex);
//                            console.log(rec);
//                            //   idx = rec.data.id_pengaduan;
//                            // var tanggal_surat = rec.data.tanggal_surat;
//                            // var jenis = rec.data.jenis;
//                            // var seq = rec.data.seq;
//                            var sDate = rec.data.date_pengaduan;
//                            var dateArray = sDate.split("-");
//                            sDatePengaduan = new Date(dateArray[0], dateArray[1], dateArray[2]);
//                            //console.log(idx);
//
////                 var aa = Ext.Date.format(sDatePengaduan, 'Y-m-d')
////                  console.log(aa);
//                            Ext.MessageBox.confirm('Message', 'Kirim surat ?' , function(btn){
//
//                                if(btn == 'yes')
//                                {
//                                    var jenis = 'Pemberitahuan';
//
//                                    Ext.Ajax.request({
//                                        waitMsg: 'Please wait...',
//                                        url: base_url+'/index.php/interface/monitoring/insert_penegakan?v=insert',
//                                        params: {
//                                            task: "INSERT",
//                                            jenis:					jenis,
//                                            building_id:			active_id
//
//
//                                        },
//                                        success: function(response){
//                                            var result = Ext.decode(response.responseText);
//                                            //console.log(result);
//                                            aresult = result;
//                                            console.log(aresult);
//
//                                            //	alert(result);
//                                            // printForm(result.data[3],'Pemberitahuan');
//                                            if(aresult.data[3]!=999){
//                                                displayPrintFormWindow();
//                                                var dateField = Ext.getCmp('pDatePelanggaran');
//                                                dateField.format = 'Y-m-d';
//                                                dateField.setValue(sDate);
//                                            } else {
//                                                Ext.MessageBox.alert('Alert','Sudah lebih dari 3 kali peringatan. Sanksi selanjutnya adalah melakukan pengumuman ke media. ');
//
//                                            }
//
//
//                                        },
//                                        failure: function(response){
//                                            var result=response.responseText;
//                                            Ext.MessageBox.alert('error','Could not connect to the database. Retry later');
//                                        }
//                                    });
//
//
//                                }
//                            });
//
//
//                        }
//
//                    }
//                ]
//            }
        ]
    });


    //Grid Tab Pengawasan
	Ext.define('DataGrid2', {
	        extend: 'Ext.grid.Panel',
	        alias: 'widget.datagrid2',

	store: storePengawasan,
	width: '100%',
	columns: [
	       Ext.create('Ext.grid.RowNumberer'), //2
        {
            text: 'id',//3
            dataIndex: 'id',
            hidden:true
        },
	{
	    text: 'Tanggal Pengawasan',//3
		width: 150,
	    dataIndex: 'created_dttm'
	},
	{
		text: 'Hasil', //4
		width: 120,
		dataIndex: 'result_status'

	},{
            xtype:'actioncolumn',
            width:70,
            padding:'4',
            items: [
                {
                    icon:base_url+'/images/icons/silk/application_view_detail.png',
                    tooltip:'Summary',
                    iconCls: 'mousepointer',
                    handler:function(grid,rowIndex,colIndex){
                        var rec = grid.getStore().getAt(rowIndex);
                        console.log(rec);
                        var _bphone ='';
                        var _bfax='';
                        var _instansiHeadName='';
                        var _instansiHeadId='';
                        var _instansiCode='';
                        var _date_pengawasan='';
                        var _nama_pengawas='';
                        idx = rec.data.id;
                        winpsPengawasan.show();
                       // preview_cetak_surat(base_url+'/surat/berita_acara_pengawasan.php?id='+rec.data.id);
                       // winDetil.hide();

                    }
                },
                {
                    icon:base_url+'/images/icons/silk/application_form_edit.png',
                    tooltip:'Edit Pengawasan',
                    iconCls: 'mousepointer',
                    handler:function(grid,rowIndex,colIndex){
                        var rec = grid.getStore().getAt(rowIndex);
                      //  console.log(rec);
                        storePengawas.load();
                        resetFormPengawasan();
                        win.show();
                        Ext.getCmp('InstansiPengawas').setValue(rec.data.inst_code);
                        Ext.getCmp('DatePengawasan').setValue(rec.data.created_dttm);
                        Ext.getCmp('WaktuPengawasan').setValue(rec.data.time_pengawasan);
                        //options
//                        Ext.getCmp('Indikator1').setValue(rec.data.indikator1);
                        Ext.getCmp('Indikator1').items.items[(rec.data.indikator1=='Ya')?0:1].setValue(true);
                        Ext.getCmp('Indikator2').items.items[(rec.data.indikator2=='Ya')?0:1].setValue(true);
                        Ext.getCmp('Indikator3').items.items[(rec.data.indikator3=='Ya')?0:1].setValue(true);
                        Ext.getCmp('Indikator4').items.items[(rec.data.indikator4=='Ya')?0:1].setValue(true);
                        Ext.getCmp('Indikator5').items.items[(rec.data.indikator5=='Ya')?0:1].setValue(true);
                        Ext.getCmp('Indikator6').items.items[(rec.data.indikator6=='Ya')?0:1].setValue(true);
                        Ext.getCmp('Indikator7').items.items[(rec.data.indikator7=='Ya')?0:1].setValue(true);
                        Ext.getCmp('Indikator8').items.items[(rec.data.indikator8=='Ya')?0:1].setValue(true);

                        indikator1_note = rec.data.indikator1_note;
                        indikator2_note = rec.data.indikator2_note;
                        indikator3_note = rec.data.indikator3_note;
                        indikator4_note = rec.data.indikator4_note;
                        indikator5_note = rec.data.indikator5_note;
                        indikator6_note = rec.data.indikator6_note;
                        indikator7_note = rec.data.indikator7_note;
                        indikator8_note = rec.data.indikator8_note;

                        //options
//                      Ext.getCmp('Indikator1').setValue(rec.data.indikator1);
                        Ext.getCmp('Pertanyaan1').items.items[(rec.data.pertanyaan1=='Ya')?0:1].setValue(true);
                        Ext.getCmp('Pertanyaan2').items.items[(rec.data.pertanyaan2=='Ya')?0:1].setValue(true);
                        Ext.getCmp('Pertanyaan3').items.items[(rec.data.pertanyaan3=='Ya')?0:1].setValue(true);
                        Ext.getCmp('Pertanyaan4').items.items[(rec.data.pertanyaan4=='Ya')?0:1].setValue(true);

                        Ext.getCmp('Pertanyaan5').setValue(rec.data.pertanyaan5);
                        Ext.getCmp('Pertanyaan6').setValue(rec.data.pertanyaan6);

                        Ext.getCmp('Rekomendasi1').setValue(rec.data.rekomendasi1);
                        Ext.getCmp('Rekomendasi2').setValue(rec.data.rekomendasi2);
                        storePengawas.clearFilter(false);
                        //console.log(rec.data.emp_name);
                      //  console.log(rec.data.pengawas_id);
                       // console.log(rec);
                        NamaPengawas1 = '';
                        NamaPengawas2 = '';
                        NamaPengawas3 = '';
                        NamaPengawas4 = '';

                        var pengawas=[];
                        if(rec.data.pengawas_id2==''){
                            pengawas =[rec.data.pengawas_id];
                        } else if(rec.data.pengawas_id3==''){
                            pengawas =[rec.data.pengawas_id,rec.data.pengawas_id2];
                        } else if(rec.data.pengawas_id4==''){
                            pengawas =[rec.data.pengawas_id,rec.data.pengawas_id2,rec.data.pengawas_id3];
                        } else {
                            pengawas =[rec.data.pengawas_id,rec.data.pengawas_id2,rec.data.pengawas_id3,rec.data.pengawas_id4];
                        }
                        Ext.getCmp('NamaPengawas').setValue(pengawas);
                        status='update';
                        idx=rec.data.id;
                        changeEmp=1;
                        changeinst=1;
                        console.log(changeEmp);
                    }
                },
                {
                    icon: base_url+'/images/icons/silk/error_add.png',
                    tooltip: 'Kirim Surat Peringatan',
                    iconCls: 'mousepointer',
                    handler: function(grid, rowIndex, colIndex) {
                    console.log('halo');
                        var rec = grid.getStore().getAt(rowIndex);
                        console.log(rec);
                        idx=rec.data.id;
                      //  storePengawasan.clearFilter(false);
                        var recPengawasan = storePengawasan.findRecord('id',idx);
                        if(recPengawasan!==null){
                            console.log(recPengawasan);
                            _pindikator1=recPengawasan.data.indikator1;
                            _pindikator2=recPengawasan.data.indikator2;;
                            _pindikator3=recPengawasan.data.indikator3;;
                            _pindikator4=recPengawasan.data.indikator4;;
                            _pindikator5=recPengawasan.data.indikator5;;
                            _pindikator6=recPengawasan.data.indikator6;;
                            _pindikator7=recPengawasan.data.indikator7;;
                            _pindikator8=recPengawasan.data.indikator8;;
                        }
                        // var tanggal_surat = rec.data.tanggal_surat;
                        // var jenis = rec.data.jenis;
                        // var seq = rec.data.seq;
                        var sDate = rec.data.created_dttm;
                        Ext.MessageBox.confirm('Message', 'Kirim surat peringatan ?' , function(btn){

                            if(btn == 'yes')
                            {
                                var jenisx = 'Peringatan';	//window.open(
                                Ext.Ajax.request({
                                    waitMsg: 'Please wait...',
                                    url: base_url+'/index.php/interface/monitoring/insert_penegakan?v=insert',
                                    params: {
                                        task: "INSERT",
                                        jenis:					jenisx,
                                        building_id:			active_id


                                    },
                                    success: function(response){
                                        //var result=eval(response.responseText);
                                        var result = Ext.decode(response.responseText);
                                        console.log(result);
                                        //	alert(result);

                                        //console.log(result);
                                        aresult = result;
                                        console.log(aresult);


                                        if(aresult.data[3]!=999){
                                            displayPrintFormPengawasanWindow();
                                            var dateField = Ext.getCmp('pDatePengawasan');
                                            dateField.format = 'Y-m-d';
                                            dateField.setValue(sDate);
                                        } else {
                                            Ext.MessageBox.alert('Alert','Sudah lebih dari 3 kali peringatan. Sanksi selanjutnya adalah melakukan pengumuman ke media. ');

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
             ]
        }]
	});

    //Grid Tab Pengawasan
    Ext.define('DataGridList2', {
        extend: 'Ext.grid.Panel',
        alias: 'widget.datagridlist2',

        store: storePengawasan,
        width: '100%',
        height:150,
        columns: [
//            Ext.create('Ext.grid.RowNumberer'), //2
            {
                text: 'id',//3
                dataIndex: 'id',
                hidden:true
            },
            {
                text: 'Tanggal Pengawasan',//3
                width: 150,
                dataIndex: 'created_dttm'
            },
            {
                text: 'Hasil', //4
                width: 120,
                dataIndex: 'result_status'

            }

        ]
    });

    //Form Print Summary pengawasan
    /// form print
    FormUpdateSurat = Ext.create('Ext.form.Panel', {
        frame: false,
        width: 440,
        bodyPadding: 5,

        fieldDefaults: {
            labelAlign: 'left',
            labelWidth: 120,
            anchor: '100%'
        },
        items: [ {
            xtype: 'textfield', //3
            id:'psNoSuratPengawasan',
            name: 'psNoSuratPengawasan',
            fieldLabel: 'No. Surat',
            labelWidth: 150,
            value: '-',
            allowBlank: false //1
        },{
            xtype: 'datefield', //8
            id:'psDateSurat',
            name: 'psDateSurat',
            labelWidth: 150,
            fieldLabel: 'Tanggal Surat',
            format:'Y-m-d',
            value: new Date()
        }, {
            xtype: 'textareafield', //3
            id:'psKetSurat',
            name: 'psKetSurat',
            fieldLabel: 'Keterangan Surat',
            labelWidth: 150,
            value: '-',
            allowBlank: false //1
        }],
        buttons: [{
            margin: '0px 6px 0px 6px',
            scale: 'medium',
            ui: 's-button',
            text: 'Save',
            cls: 's-blue',
            disabled: false,
            handler: function() {
                var form = this.up('form').getForm();
                //  alert('h'+active_id);
                var _no_surat = Ext.getCmp('psNoSuratPengawasan').getValue();
                var _date_surat = Ext.getCmp('psDateSurat').getRawValue();
                var _ket_surat =  Ext.getCmp('psKetSurat').getValue();

                Ext.Ajax.request({
                    waitMsg: 'Please wait...',
                    url: base_url+'/index.php/interface/monitoring/update_surat_penegakan_hukum',
                    params: {
                        task: "UPDATE",
                        tglSurat:				_date_surat,
                        noSurat:                _no_surat,
                        ketSurat:               _ket_surat,
                        id:			idx
                    },
                    success: function(response){
                        //var result=eval(response.responseText);
                        var result = Ext.decode(response.responseText);
                        console.log(result);
                        storePenegakan.load();

                    },
                    failure: function(response){
                        var result=response.responseText;
                        Ext.MessageBox.alert('error','Could not connect to the database. Retry later');
                    }
                });


                winUpdateSurat.hide();
                store.load();

            }
        },{
            margin: '0px 6px 0px 6px',
            scale: 'medium',
            ui: 's-button',
            text: 'Cancel',
            cls: 's-grey',
            disabled: false,
            handler: function() {
                winUpdateSurat.hide();
            }
        }
        ]

    });

    //print surat pengaduan
    winUpdateSurat = Ext.create('widget.window', {
        title: 'Update Surat',
        closable: true,
        closeAction: 'hide',
        width: 470,
        minWidth: 400,
        height: 220,
        modal: true,
        layout: {
            type: 'border',
            padding: 10
        },
        items: [FormUpdateSurat]
    });



    //Grid Tab Penegakkan Hukum
    Ext.define('DataGrid3', {
        extend: 'Ext.grid.Panel',
        alias: 'widget.datagrid3',
        store: storePenegakan,
        width: '100%',
        viewConfig: {
            stripeRows: false,
            getRowClass: function(record) {
                var colorGrid;
                if(record.get('status') =='inactive') {
                    colorGrid= 'inactive-row';
                } else if (record.get('delivery_status') =='sent' && record.get('status') =='active'){
                    colorGrid= 'sent-row';
                } else {
                    colorGrid= 'normal-row';
                }

                return  colorGrid;
//            return (record.get('status') =='inactive') ? 'inactive-row' : 'normal-row';
            }
        },
        columns: [

            {
                text: 'Tanggal Surat',//3
                width: 100,
                dataIndex: 'tanggal_surat'
            },
            {
                text: 'Sifat', //4
                width: 120,
                dataIndex: 'jenis'

            },{
                text: 'Tingkat', //4
                width: 70,
                dataIndex: 'seq',
                hidden:true

            },{
                text: 'No. Surat', //4
                width: 70,
                dataIndex: 'referensi'

            },{
                text: 'Delivery Status', //4
                width: 100,
                dataIndex: 'delivery_status'

            },{
                xtype: 'checkcolumn',
                header: 'Feedback?',
                dataIndex: 'feedback',
                width: 70,
                listeners:{
                    'blur':function(d,newVal, Opts){
                        console.log('halo');
                    }
                }
            },
            {
                text: 'Feedback Date', //4
                width: 100,
                dataIndex: 'feedback_date'

            },{
                text: 'Count Day', //4
                width: 80,
                dataIndex: 'count_down'

            },{
                xtype:'actioncolumn',
                width:70,
                padding:'10',
                items: [
                    {
                        icon: base_url+'/images/icons/silk/tick.png',
                        tooltip: 'Update Feedback',
                        iconCls: 'mousepointer',
                        style:'margin-right:10px;padding-right:10px;',
                        handler: function(grid, rowIndex, colIndex) {
                            console.log('update feedback');
                            var rec = grid.getStore().getAt(rowIndex);
                            console.log(rec);
                            var tanggal_surat = rec.data.tanggal_surat;
                            var jenis = rec.data.jenis;
                            var seq = rec.data.seq;
                            var feedback = rec.data.feedback;

                            Ext.MessageBox.confirm('Info', 'Update feedback ?' , function(btn){

                                if(btn == 'yes')
                                {

                                    Ext.Ajax.request({
                                        waitMsg: 'Please wait...',
                                        url: base_url+'/index.php/interface/monitoring/update_penegakan_hukum',
                                        params: {
                                            task: "UPDATE",
                                            building_id:	active_id,
                                            tanggal_surat: tanggal_surat,
                                            jenis: jenis,
                                            seq: seq,
                                            feedback:feedback

                                        },
                                        success: function(response){

                                            var result=eval(response.responseText);
                                            console.log(result);
                                            switch(result){
                                                case 1:
                                                    storePenegakan.load();
                                                    //	window.location.reload();
                                                    //Ext.getCmp('locationGrid').store.load();

                                                    break;
                                                default:
                                                    Ext.MessageBox.alert('Warning...','We couldn\'t change this data...');
                                                    break;
                                            }


                                        },
                                        failure: function(response){
                                            var result=eval(response.responseText);
                                        }
                                    });
                                }
                            });


                        }

                    },{

                        icon:  base_url+'/images/icons/silk/email_transfer.png',
                        tooltip: 'Update Pengiriman Surat',
                        iconCls: 'mousepointer',
                        handler: function(grid, rowIndex, colIndex) {
                            var rec = grid.getStore().getAt(rowIndex);
                            idx = rec.data.id;
                            if(rec.data.delivery_status=='sent'){
                                Ext.MessageBox.alert('Info', 'Surat sudah terkirim.' );
                            } else {
                                winUpdateSurat.show();
                            }

                        }
                    },{

                        icon:  base_url+'/images/icons/silk/decline.png',
                        tooltip: 'Batalkan Pengiriman Surat',
                        iconCls: 'mousepointer',
                        handler: function(grid, rowIndex, colIndex) {
                            var rec = grid.getStore().getAt(rowIndex);
                            idx = rec.data.id;

                            if(rec.data.delivery_status=='sent'){
                                Ext.MessageBox.alert('Info', 'Surat sudah terkirim. Tidak bisa dibatalkan.' );
                            } else {

                            Ext.MessageBox.confirm('Info', 'Batalkan Pengiriman Surat ?' , function(btn){

                                if(btn == 'yes')
                                {

                                    Ext.Ajax.request({
                                        waitMsg: 'Please wait...',
                                        url: base_url+'/index.php/interface/monitoring/cancel_penegakan_hukum',
                                        params: {
                                            task: "UPDATE",
                                            id:	idx

                                        },
                                        success: function(response){

                                            var result=eval(response.responseText);
                                            console.log(result);
                                            switch(result){
                                                case 1:
                                                    storePenegakan.load();
                                                    break;
                                                default:
                                                    Ext.MessageBox.alert('Warning...','We couldn\'t change this data...');
                                                    break;
                                            }


                                        },
                                        failure: function(response){
                                            var result=eval(response.responseText);
                                        }
                                    });
                                }
                            });
                            }


                        }
                    }]
            }]
    });

    //Grid Tab Penegakkan Hukum
    Ext.define('DataGridList3', {
        extend: 'Ext.grid.Panel',
        alias: 'widget.datagridlist3',
        store: storePenegakan,
        width: '100%',
        height:150,
        viewConfig: {
            stripeRows: false,
            getRowClass: function(record) {
                var colorGrid;
                if(record.get('status') =='inactive') {
                    colorGrid= 'inactive-row';
                } else if (record.get('delivery_status') =='sent' && record.get('status') =='active'){
                    colorGrid= 'sent-row';
                } else {
                    colorGrid= 'normal-row';
                }

                return  colorGrid;
//            return (record.get('status') =='inactive') ? 'inactive-row' : 'normal-row';
            }
        },
        columns: [
//            Ext.create('Ext.grid.RowNumberer'), //2
            {
                text: 'Tanggal Surat',//3
                width: 100,
                dataIndex: 'tanggal_surat'
            },
            {
                text: 'Sifat', //4
                width: 120,
                dataIndex: 'jenis'

            },{
                text: 'Tingkat', //4
                width: 70,
                dataIndex: 'seq',
                hidden:true

            },{
                text: 'No. Surat', //4
                width: 70,
                dataIndex: 'referensi'

            },{
                text: 'Delivery Status', //4
                width: 100,
                dataIndex: 'delivery_status'

            },{
                xtype: 'checkcolumn',
                header: 'Feedback?',
                dataIndex: 'feedback',
                width: 70,
                listeners:{
                    'blur':function(d,newVal, Opts){
                        console.log('halo');
                    }
                }
            },
            {
                text: 'Feedback Date', //4
                width: 100,
                dataIndex: 'feedback_date'

            },{
                text: 'Count Day', //4
                width: 80,
                dataIndex: 'count_down'

            }
        ]
    });




    winDetil = Ext.create('widget.window', {
        title: 'Detail',
        closable: true,
        closeAction: 'hide',
        width: 800,
        minWidth: 370,
        height: 280,
        modal: true,
        layout: {
            type: 'border',
            padding: 5
        },
        items: [
            {
                xtype: 'tabpanel',
                tabBar: {
                    plain: true
                },
                region: 'center',
                items: [
                    {
                        title: 'Pengaduan',
                        xtype: 'datagrid'
                    },
                    {
                        title: 'Pengawasan',
                        xtype: 'datagrid2'
                    },
                    {
                        title: 'Penegakan Hukum',
                        xtype: 'datagrid3'
                    }
                ]
            }],
        buttons: [
            {
                margin: '0px 0px 0px 6px',

                scale: 'medium',
                ui: 's-button',
                text: 'Close',
                cls: 's-grey',
                disabled: false,
                handler: function () {
                    winDetil.hide();
                    store.load();
                }
            }
        ]

    });


    winDetilList = Ext.create('widget.window', {
        title: 'List Summary',
        closable: true,
        closeAction: 'hide',
        width: 800,
        height: 500,
        modal: true,
        autoScroll: true,
        layout: {
            type: 'border',
            padding: 5
        },
        items: [
            {
                xtype: 'panel',
                width: 770,
                height: 450,
                frame: true,
                items: [
                    {
                        title: 'Pengaduan',
                        xtype: 'datagridlist'
                    },
                    {
                        title: 'Pengawasan',
                        xtype: 'datagridlist2'
                    },
                    {
                        title: 'Penegakan Hukum',
                        xtype: 'datagridlist3'
                    }
                ]
            }],
        buttons: [
            {
                margin: '0px 0px 0px 6px',

                scale: 'medium',
                ui: 's-button',
                text: 'Close',
                cls: 's-grey',
                disabled: false,
                handler: function () {
                    winDetilList.hide();
                }
            }
        ]

    });


    // Panel Search Box
    Ext.create('Ext.panel.Panel', {
        renderTo: 'search-box',
        title: 'Cari Lokasi',
        width: '99%',
        style:'padding:5px;',
        bodyPadding: 10,
        layout: 'hbox',

        items: [{
            xtype: 'combo',
            label:'Cari Gedung',
            id:'searchResult',
            store: searchStoreName,
            displayField: 'building_name',
            valueField:'building_id',
            typeAhead: false,
            hideLabel: true,
            hideTrigger:true,
            queryMode: 'local',
            width: 400,
            style:'padding-right:5px;margin-right:5px;',
            enableKeyEvents:true,
            listConfig: {
                loadingText: 'Searching...',
                emptyText: 'No matching posts found.',

                // Custom rendering template for each item
                getInnerTpl: function() {
                    return '<h3><span>{building_name}</h3>' +
                        '{building_address} , {building_city}';
                }
            },
            listeners:{
                'keydown':function(element, event, opts){
                    //  console.log(element);
//                    console.log(event.keyCode);
                    //  console.log(element.lastKey);
                    if(event.keyCode==13 && element.lastKey==13){
                        var sSearchRes = this.getValue();
                        var rec = store.findRecord('building_id',sSearchRes);
//                        console.log(rec);

//                        console.log(this.getValue());
                        if(rec===null){
                            //console.log(element.getValue());
                            Ext.MessageBox.confirm('Info', 'Tambah Lokasi ini dalam daftar pengawasan ?' , function(btn){

                                if(btn == 'yes')
                                {

                                    Ext.Ajax.request({
                                        waitMsg: 'Please wait...',
                                        url: base_url+'/index.php/interface/monitoring/insert_gedung_pengawasan',
                                        params: {
                                            task: "INSERT",
                                            building_id:	sSearchRes

                                        },
                                        success: function(response){

                                            var result=eval(response.responseText);
                                            console.log(result);
                                            switch(result){
                                                case 1:
                                                    store.load();
                                                    //	window.location.reload();
                                                    //Ext.getCmp('locationGrid').store.load();

                                                    break;
                                                default:
                                                    Ext.MessageBox.alert('Warning...','We couldn\'t change this data...');
                                                    break;
                                            }


                                        },
                                        failure: function(response){
                                            var result=eval(response.responseText);
                                        }
                                    });
                                }
                            });
                        } else {
                            Ext.MessageBox.alert('Info', 'Lokasi ini sudah ada dalam daftar pengawasan.' ,null);
                        }
                    } else if(event.keyCode===27){
                        element.setValue('');
                    }
                }
            }
//            ,
//            pageSize: 10

        }, {

            xtype: 'button',
            margin: '0px 0px 0px 6px',
            scale: 'medium',
            iconCls:'controladd',
            iconAlign:'left',
            disabled: false,
            text: 'Tambah ke Daftar Pengawasan',
            handler:function(){
                var searchResult = Ext.getCmp('searchResult').getValue();
                var rec = store.findRecord('building_id',searchResult);
                // console.log(rec);

                //console.log(this.getValue());
                if(rec===null){
                    Ext.MessageBox.confirm('Info', 'Tambah Lokasi ini dalam daftar pengawasan ?' , function(btn){

                        if(btn == 'yes')
                        {

                            Ext.Ajax.request({
                                waitMsg: 'Please wait...',
                                url: base_url+'/index.php/interface/monitoring/insert_gedung_pengawasan',
                                params: {
                                    task: "INSERT",
                                    building_id:	searchResult

                                },
                                success: function(response){

                                    var result=eval(response.responseText);
                                    console.log(result);
                                    switch(result){
                                        case 1:
                                            store.load();
                                            //window.location.reload();
                                            //Ext.getCmp('locationGrid').store.load();

                                            break;
                                        default:
                                            Ext.MessageBox.alert('Warning...','We couldn\'t change this data...');
                                            break;
                                    }


                                },
                                failure: function(response){
                                    var result=eval(response.responseText);
                                }
                            });
                        }
                    });
                } else {
                    Ext.MessageBox.alert('Info', 'Lokasi ini sudah ada dalam daftar pengawasan.' ,null);
                }
            }

            // html: 'Live search requires a minimum of 4 characters.'
        },
            {

                xtype: 'button',
                margin: '0px 0px 0px 6px',
                scale: 'medium',
                iconCls:'controladd',
                iconAlign:'left',
                disabled: false,
                text: 'Tambah Gedung Baru',
                handler : function(){
                    window.location = base_url+'/index.php/interface/location';
                }

                // html: 'Live search requires a minimum of 4 characters.'
            }]
    });

	   	

	// Monitoring Location Grid
    Ext.create('Ext.grid.Panel', {
        store: store,
        id:'locationGrid',
        width: '100%',
        margin:'5px',
        title: 'Daftar Lokasi Monitoring & Pengawasan',
        renderTo: 'location-grid',
        loadMask: true,
        features: [filters],
        viewConfig: {
            stripeRows: false,
            getRowClass: function(record) {
                var label='normal-row';
                if((parseInt(record.get('type_pemberitahuan'))+parseInt(record.get('type_peringatan')))==1){
                   label='warning-row';
                } else if((parseInt(record.get('type_pemberitahuan'))+parseInt(record.get('type_peringatan')))==2){
                    label='yellow-row';
                } else if((parseInt(record.get('type_pemberitahuan'))+parseInt(record.get('type_peringatan')))==3){
                   label='red-row';
                } else {
                    label='normal-row';
                }
                return label;
            }
        },
        columns: [
//            Ext.create('Ext.grid.RowNumberer'), //2
            {
            	    text: 'Kode',//3
            		width: 50,
            	    dataIndex: 'building_id'
            },
            {
                text: 'Nama Lokasi', //4
                width: 250,
                dataIndex: 'building_name',
                editor: {
                    xtype:'textfield',
                    allowBlank:false
                }
            },{
                text: 'Alamat',
                width: 200,
                dataIndex: 'building_address',
                editor: {
                    xtype:'textfield',
                    allowBlank:false
                }
            },
//		{
//		text: 'No. Telepon', //5 xtype: 'booleancolumn',
//		width: 80,
//		dataIndex: 'building_phone',
//		editor: {
//		         xtype:'textfield',
//		         allowBlank:false
//		      }
//		},
//		{
//		text: 'Penanggung Jawab', //5 xtype: 'booleancolumn',
//		width: 130,
//		dataIndex: 'building_resp_person',
//		editor: {
//		         xtype:'textfield',
//		         allowBlank:false
//		      }
//		},
            {
                text: 'Kota',//3
                width: 140,
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
                width: 150,
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

            },{
                xtype:'actioncolumn',
                width:70,
                padding:'4',
                items: [
                    {
                        icon: base_url+'/images/user.png',
                        tooltip: 'Pengaduan',
                        iconCls: 'mousepointer',
                        handler: function(grid, rowIndex, colIndex) {
                            var rec = grid.getStore().getAt(rowIndex);
                            Ext.MessageBox.confirm('Message', 'Input Data Pengaduan ?' , function(btn){

                                if(btn == 'yes')
                                {
                                    //rec.get('building_name')
                                    resetFormPengaduan();
                                    displayFormWindow();
                                    winPengaduan.setTitle('Data Pengaduan ('+rec.get('building_name')+')');
                                    //	PengaduanForm.setBrand(rec.get('building_id'));
                                    active_id = rec.get('building_id');



                                }

                            });
                            //	 Ext.MessageBox.confirm('Message', 'Do you really want to delete it?' , doDel);

                        }
                    },
                    {
                        icon: base_url+'/images/list.png',
                        tooltip: 'Pengawasan',
                        iconCls: 'mousepointer',
                        handler: function(grid, rowIndex, colIndex) {
                            var rec = grid.getStore().getAt(rowIndex);
                            Ext.MessageBox.confirm('Message', 'Input Berita Acara Pengawasan ?' , function(btn){

                                if(btn == 'yes')
                                {
                                    resetFormPengawasan();
                                    //Ext.getCmp('displayfield').setValue(rec.get('building_name'));
                                    win.setTitle('Berita Acara Pengawasan ('+rec.get('building_name')+')');
                                    active_id = rec.get('building_id');
                                    win.show();
                                    storePengawas.load();
                                }

                            });
                            //	 Ext.MessageBox.confirm('Message', 'Do you really want to delete it?' , doDel);

                        }
                    },
                    {
                        icon: base_url+'/images/info2.png',
                        tooltip: 'Detail',
                        iconCls: 'mousepointer',
                        handler: function(grid, rowIndex, colIndex) {
                            var rec = grid.getStore().getAt(rowIndex);
                            // Ext.MessageBox.alert('Delete',rec.get('building_name'));
                            //console.log(rec);
                            storeP.clearFilter(true);
                            storeP.load();
                            storeP.filter('building_name',rec.get('building_name'));

                            active_id = rec.get('building_id');
                            bname = rec.get('building_name');
                            var proxy = {
                                type: 'ajax',
                                url: base_url+'/index.php/interface/monitoring/json_get_pengawasan?building_id='+active_id,
                                reader: {
                                    type: 'json',
                                    root: 'data'
                                }
                            }

                            storePengawasan.removeAll(false);
                            storePengawasan.setProxy(proxy);
                            storePengawasan.load();

//                            storePengawasan.clearFilter(false);
//                            console.log(rec.get('surveillance_id'));
//                            storePengawasan.filter('id',rec.get('surveillance_id'));


                            //	bname = '....................................';
                            baddr = rec.get('building_address');
                            bcity = rec.get('building_city');
                            //	bperson = rec.get('building_resp_person');
                            bperson = '...........................................';
                            bpersoncode = '..........................';//rec.get('building_name');

                            storePenegakan.clearFilter(true);
                            storePenegakan.load();
                            storePenegakan.filter('building_id',rec.get('building_id'));
                            winDetil.setTitle('Summary ('+rec.get('building_name')+')');
                            winDetil.show();
                            //	storeP.filter('building_id',rec.get('building_id'));

                        }
                    }
                    ,
                    {
                        icon: base_url+'/images/icons/silk/outline.png',
                        tooltip: 'List Summary',
                        iconCls: 'mousepointer',
                        padding:5,
                        handler: function(grid, rowIndex, colIndex) {
                            var rec = grid.getStore().getAt(rowIndex);
                            // Ext.MessageBox.alert('Delete',rec.get('building_name'));
                            //	console.log(rec.get('building_id'))
                            storeP.clearFilter(true);
                            storeP.load();
                            storeP.filter('building_name',rec.get('building_name'));

                            storePengawasan.clearFilter(true);
                            storePengawasan.load();
                            storePengawasan.filter('building_id',rec.get('building_id'));
                            active_id = rec.get('building_id');
                            bname = rec.get('building_name');

                            //	bname = '....................................';
                            baddr = rec.get('building_address');
                            bcity = rec.get('building_city');
                            //	bperson = rec.get('building_resp_person');
                            bperson = '...........................................';
                            bpersoncode = '..........................';//rec.get('building_name');

                            storePenegakan.clearFilter(true);
                            storePenegakan.load();
                            storePenegakan.filter('building_id',rec.get('building_id'));
                            winDetilList.setTitle('List Summary ('+rec.get('building_name')+')');
                            winDetilList.show();
                            //	storeP.filter('building_id',rec.get('building_id'));

                        }
                    }
                ]
            }]

    });
		
	

});
