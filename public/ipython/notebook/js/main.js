// Copyright (c) IPython Development Team.
// Distributed under the terms of the Modified BSD License.

require([
    'base/js/namespace',
    'jquery',
    'notebook/js/notebook',
    'contents',
    'services/config',
    'base/js/utils',
    'base/js/page',
    'base/js/events',
    'auth/js/loginwidget',
    'notebook/js/maintoolbar',
    'notebook/js/pager',
    'notebook/js/quickhelp',
    'notebook/js/menubar',
    'notebook/js/notificationarea',
    'notebook/js/savewidget',
    'notebook/js/actions',
    'notebook/js/keyboardmanager',
    'notebook/js/kernelselector',
    'codemirror/lib/codemirror',
    'notebook/js/about',
    // only loaded, not used, please keep sure this is loaded last
    'custom/custom',
    'job_progress',
    'sidebar',
    'chat'
], function(
    IPython,
    $,
    notebook,
    contents,
    configmod,
    utils,
    page,
    events,
    loginwidget,
    maintoolbar,
    pager,
    quickhelp,
    menubar,
    notificationarea,
    savewidget,
    actions,
    keyboardmanager,
    kernelselector,
    CodeMirror,
    about,
    // please keep sure that even if not used, this is loaded last
    custom,
    job_progress,
    chat
    ) {
    "use strict";

    // compat with old IPython, remove for IPython > 3.0
    window.CodeMirror = CodeMirror;

    var common_options = {
        ws_url : eval(utils.get_body_data("wsUrl"))(),
        base_url : utils.get_body_data("baseUrl"),
        notebook_path : utils.get_body_data("notebookPath"),
        notebook_name : utils.get_body_data('notebookName')
    };

    var config_section = new configmod.ConfigSection('notebook', common_options);
    config_section.load();
    var common_config = new configmod.ConfigSection('common', common_options);
    common_config.load();
    var page = new page.Page();
    var pager = new pager.Pager('div#pager', {
        events: events});
    var acts = new actions.init();
    var keyboard_manager = new keyboardmanager.KeyboardManager({
        pager: pager,
        events: events,
        actions: acts });
    var save_widget = new savewidget.SaveWidget('span#save_widget', {
        events: events,
        keyboard_manager: keyboard_manager});
    var contents = new contents.Contents($.extend({
        events: events, config:config_section},
        common_options));
    var notebook = new notebook.Notebook('div#notebook', $.extend({
        events: events,
        keyboard_manager: keyboard_manager,
        save_widget: save_widget,
        contents: contents,
        config: config_section},
        common_options));
    var login_widget = new loginwidget.LoginWidget('span#login_widget', common_options);
    var toolbar = new maintoolbar.MainToolBar('#maintoolbar-container', {
        notebook: notebook,
        events: events,
        actions: acts});
    var quick_help = new quickhelp.QuickHelp({
        keyboard_manager: keyboard_manager,
        events: events,
        notebook: notebook});
    keyboard_manager.set_notebook(notebook);
    keyboard_manager.set_quickhelp(quick_help);
    var menubar = new menubar.MenuBar('#menubar', $.extend({
        notebook: notebook,
        contents: contents,
        events: events,
        save_widget: save_widget,
        quick_help: quick_help},
        common_options));
    var notification_area = new notificationarea.NotebookNotificationArea(
        '#notification_area', {
        events: events,
        save_widget: save_widget,
        notebook: notebook,
        keyboard_manager: keyboard_manager});
    notification_area.init_notification_widgets();
    var kernel_selector = new kernelselector.KernelSelector(
        '#kernel_logo_widget', notebook);

    $('body').append('<div id="fonttest"><pre><span id="test1">x</span>'+
                     '<span id="test2" style="font-weight: bold;">x</span>'+
                     '<span id="test3" style="font-style: italic;">x</span></pre></div>');
    var nh = $('#test1').innerHeight();
    var bh = $('#test2').innerHeight();
    var ih = $('#test3').innerHeight();
    if(nh != bh || nh != ih) {
        $('head').append('<style>.CodeMirror span { vertical-align: bottom; }</style>');
    }
    $('#fonttest').remove();

    page.show();

    var first_load = function () {
        var hash = document.location.hash;
        if (hash) {
            document.location.hash = '';
            document.location.hash = hash;
        }
        notebook.set_autosave_interval(notebook.minimum_autosave_interval);
        // only do this once
        events.off('notebook_loaded.Notebook', first_load);
    };
    events.on('notebook_loaded.Notebook', first_load);

    IPython.page = page;
    IPython.notebook = notebook;
    IPython.contents = contents;
    IPython.pager = pager;
    IPython.quick_help = quick_help;
    IPython.login_widget = login_widget;
    IPython.menubar = menubar;
    IPython.toolbar = toolbar;
    IPython.notification_area = notification_area;
    IPython.keyboard_manager = keyboard_manager;
    IPython.save_widget = save_widget;
    IPython.tooltip = notebook.tooltip;

    events.trigger('app_initialized.NotebookApp');
    utils.load_extensions_from_config(config_section);
    utils.load_extensions_from_config(common_config);
    notebook.load_notebook(common_options.notebook_path);

//-----------------------------------------------------------------------------------------
    function CallServer ()     
{     
 this.xhr_object;     
 this.server_response;     
      
 this.createXMLHTTPRequest = createXMLHTTPRequest;     
 this.sendDataToServer = sendDataToServer;     
 this.displayAnswer = displayAnswer;     
 this.launch = launch;     
}     


//On crée l'objet XMLHttpRequest     

function createXMLHTTPRequest()     
{     
 this.xhr_object = null;     
      
 if(window.XMLHttpRequest)     
 {     
    this.xhr_object = new XMLHttpRequest();     
 }     
 else if(window.ActiveXObject)      
 {     
    this.xhr_object = new ActiveXObject("Microsoft.XMLHTTP");     
 }     
 else      
 {     
    alert("Your browser doesn't provide XMLHttprequest functionality");     
    return;     
 }     
}     

//On envoit des données au serveur et on reçoit la réponse en mode synchrone dans this.server_response     

function sendDataToServer (data_to_send)     
{     
 var xhr_object = this.xhr_object;     
      
 xhr_object.open("POST", "/spark-notebook/bibli.pl", false);     

 xhr_object.setRequestHeader("Content-type", "application/x-www-form-urlencoded");     
      
 xhr_object.send(data_to_send);     
      
 if(xhr_object.readyState == 4)     
 {      
  this.server_response = xhr_object.responseText;     
 }     
}     

//On injecte la réponse du serveur dans la div nommée resultat    

function displayAnswer ()     
{      
 document.getElementByClassName("BoxInfo").innerHTML = this.server_response;     
}     

//Exécution du Javascript  

function launch (data)     
{     ;
 this.sendDataToServer(data);     
      
 this.displayAnswer();     
}     


function createIframe(data,className)
{
ifrm = document.createElement("IFRAME");
ifrm.setAttribute("src", data);
ifrm.style.width = 550+"px";
ifrm.style.height = 400+"px";
iframe.class="BoxInfo";
document.body.appendChild(ifrm);
//document.getElementByClassName(className).appendChild(ifrm);
}

$(document).on('mouseover', function(e)
{
	if (e.target.className == 'cm-variable' || e.target.className == 'cm-keyword')
		{
                //récupération du mot ciblé par l'utilisateur
                var data = e.target.text;
                var className = e.target.className;
                //Création de l'objet call_server    
                var call_server = new CallServer();     
                call_server.createXMLHTTPRequest();
                createIframe(data,className);
                call_server.launch(data);
		}
});


    //timer a implémenter a la fin
    /*
    $(document).on("mouseover",function(e){
    if (e.type === 'mouseenter') {
       clearTimeout( $this.data('timeout') );
       $this.slideDown('fast');

    }else{ // is mouseleave:
       $this.data( 'timeout', setTimeout(function(){
           $this.slideUp('fast');
       },2000));  
   }
 });*/

});
