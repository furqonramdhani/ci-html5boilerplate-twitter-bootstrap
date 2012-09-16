Ext.Loader.setConfig({enabled: true});
Ext.Loader.setPath('Ext.ux', '/js/ext-4.1/ux');
Ext.require([
	'Ext.data.*',
    'Ext.panel.*',
    'Ext.form.*'
]);

Ext.onReady(function() {

    var simple = Ext.widget({
        xtype: 'form',
        layout: 'form',
        renderTo: 'location-grid',
        id: 'PassForm',
        frame: true,
        title: 'Ubah Password',
        bodyPadding: '5 5 0',
        width: 350,
        defaults: {
            msgTarget: 'side',
            labelWidth: 150,
            inputType: 'password'
        },
        defaultType: 'textfield',
        items: [{
            fieldLabel: 'Password Baru',
            name: 'password',
            allowBlank:false

        },{
            fieldLabel: 'Konfirmasi Password Baru',
            name: 'repassword',
            allowBlank:false
        }],

        buttons: [{
            id:'save',
            margin: '0px 0px 0px 6px',
            scale: 'medium',
            ui: 's-button',
            text: 'Save',
            cls: 's-blue',
            disabled: false,
            handler: function() {
                var form = this.up('form').getForm();

                form.submit({
                    url: '/index.php/sysadmin/change_password/chpass',
                    waitMsg: 'Sending the info...',
                    success: function(fp, o) {
                        Ext.Msg.alert('Success', 'Form submitted.');

                    }
                });


            }

        }]
    });


});

