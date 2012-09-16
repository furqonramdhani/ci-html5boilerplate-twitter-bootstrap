var base_url = 'http://localhost/repo/sfj';
var basicmatch = /[a-z0-9]/i;
function _fromMoney(str) { str = str.replace(/\./g,'');return str.replace(/\,/g,'.');}
function _compStr(a,b) { var ret = 0; for(var i=0;i<a.length;i++) { if(i>=b.length) { ret = 1; continue; } if(a.charCodeAt(i)==b.charCodeAt(i)) { continue; } else if (a.charCodeAt(i)>b.charCodeAt(i)) { ret = 1; } else { ret = -1; } if(ret!=0) { return ret; } } if(b.length>a.length&&ret==0) { ret = -1; } return ret; }
function ajaxInit() { var c=null; try { c=new ActiveXObject('Msxml2.XMLHTTP'); } catch(e) { try { c=new ActiveXObject('Microsoft.XMLHTTP'); } catch(ee) { c=null; } } if(!c&& typeof XMLHttpRequest!='undefined') { c=new XMLHttpRequest(); } return c; }
function recjsarray(code){ try { eval('var ret='+code); return ret; } catch(e) { return false; } }
function ctimer(cmd,ms){this.cmd=cmd;this.ms=ms;this.tp=0;}
ctimer.prototype.start=function(){if(this.tp>0)this.reset();this.tp=window.setTimeout(this.cmd,this.ms);}
ctimer.prototype.reset=function(){if(this.tp>0)window.clearTimeout(this.tp);this.tp=0;}
function trim(str){return str.replace(/^(\s+)?(\S*)(\s+)?$/,'$2');}
function ltrim(str){return str.replace(/^\s*/,'');}
function rtrim(str){return str.replace(/\s*$/,'');}
function delay(milliseconds){var then,now;then=new Date().getTime();now=then;while((now-then)<milliseconds){now=new Date().getTime();}}
function getkeyc(e){if(document.layers)return e.which;else if(document.all)return event.keyCode;else if(document.getElementById)return e.keyCode;return 0;}
function urlencode(Va){if(encodeURIComponent) return encodeURIComponent(Va);if(escape) return escape(Va)}
function _gel(a) { return document.getElementById(a);}
function _geln(a) { return document.getElementsByTagName(a);}
function _dce(a) { return document.createElement(a); }
function _ajaxSend(a){var c=ajaxInit();if(c){c.open("GET",a,true);c.send(null)}}
function _move(o,x,y){var e=_gel(o);if(e){e.style.left=x;e.style.top=y;return true;}else{return false;}}
function fixE(a) { if(!a) return null; if(typeof a=="undefined") a=window.event; if(typeof a.layerX=="undefined") a.layerX=a.offsetX; if(typeof a.layerY=="undefined") a.layerY=a.offsetY; return a }

function oX(a){
	var pos = Position.positionedOffset(a);
	return pos[0];
}
function oY(a){
	var pos = Position.positionedOffset(a);
	return pos[1];
}
function uxx(a){a.parentNode.style.display="none";a.parentNode.style.display=""}
function u(a){ a.parentNode.style.display="none"; z=a.nextSibling; zp=a.parentNode; at = a; if(z) { zp.removeChild(a); zp.insertBefore(at,z); } else { zp.removeChild(a); zp.appendChild(at); } a.parentNode.style.display=""}
function _us(a,b){for(i=0;i<b.length;i++){if(a==b[i]){b.splice(i,1);return b;}}return false;}
var _af=null;
function _caf(x) { if(!_af) { var dv = _dce('div'); dv.setAttribute('style','position:absolute;color:white;visibility:hidden;top:0px;left:0px;padding:10px;'); _af = document.body.appendChild(dv); _af.appendChild(progress_span(_caf.txt)); } switch(x.readyState) { case 4 : setTimeout('_hidcaf()',1000); break; default : _af.style.visibility='visible'; break; } }
function _hidcaf() { _af.style.visibility='hidden'; }

/////////// DRAT AND DROG      
var p=0;       // interval ID
var drect=null;    // drag rectangle DIV
// this function return drag rectangle 2px border, grey color
function h() {
   if(!drect) {
      drect=document.createElement('DIV');
      drect.style.display='none';
      drect.style.position='absolute';
      drect.style.cursor='move';
      drect.style.zIndex='300';
      drect.style.border='2px solid #7777ee';
      drect.style.backgroundColor='#7777ee';
      drect.style.opacity=0.5;
      document.body.appendChild(drect);
   }
   return drect;
}
// hide drag rectangle
function q() {
   h().style.display='none';
}

// animate function
function s(a,c,b) {              // a adalah module, c adalah threshold
   var e=parseInt(h().style.left);     // e is x coordinat of drag rect
   var f=parseInt(h().style.top);      // f is y coordinat of drag rect
   var i=(e-oX(a))/b;                  // i is
   var j=(f-oY(a))/b;
   return setInterval( function() {
      if(b<1) {
         clearInterval(p);
         q();
         return
      }
      b-=1;
      e-=i;
      f-=j;
      h().style.left=parseInt(e)+'px';
      h().style.top=parseInt(f)+'px' },c/b)
}

function gsc_getquery(elt, q) { 
   q = ltrim(q); 
   q = q.replace('\s+', ' '); 
   if (q.length == 0 || !basicmatch.test(q)) { 
      gsc_emptyresults(elt); return ''; 
   } 
   if (elt.cq && (elt.cq == q || elt.tempQuery == q)) { 
      return ''; 
   } 
   elt.cq = q; 
   return q; 
}
function gsc_hide(elt) { if (elt) elt.style.display = 'none'; }
function gsc_ishidden(elt) { return elt.style.display == 'none'; }
function gsc_show(elt) { if (elt) elt.style.display = 'block'; }
function gsc_emptyresults(elt) { if (!elt) return; elt.innerHTML = ''; elt.numres = 0; elt.selectedIndex = 0; elt.res = []; elt.resId = []; gsc_hide(elt); }
function gsc_addresult(elt, qElt, q, c, sel) { 
   if (!elt) return; 
   if (sel) elt.selectedIndex = elt.numres; 
   idx = elt.numres; 
   elt.res[elt.numres++] = q; 
   var _res = ''; 
   _res += '<div class="' 
         + (sel ? 'srs' : 'sr') 
         + '"' 
         + ' onmouseover="gsc_mouseover(\''  + elt.id  + '\', \''  + qElt.id  + '\', '  + idx  + ')"' 
         + ' onmouseout="gsc_mouseout(\''  + elt.id  + '\', '  + idx  + ')"' 
         + ' onclick="gsc_mouseclick(\''  + elt.id  + '\', \''  + qElt.id  + '\', '  + idx  + ')">'; 
   _res += '<span class="srt">'  + q  + '</span>'; 
   if (c.length > 0) {
      _res += '<span class="src">'  + c  + '</span>';
      _res += '</div>'; 
   }
   elt.innerHTML += _res; 
}
function gsc_mouseover(id, qId, idx) { elt = _gel(id); elt.selectedIndex = idx; qElt = _gel(qId); qElt.focus(); gsc_highlightsel(elt); }
function gsc_mouseout(id, idx) { elt = _gel(id); elt.selectedIndex = -1; gsc_highlightsel(elt); }
function gsc_mouseclick(id, qId, idx) { elt = _gel(id); qElt = _gel(qId); qElt.value = elt.res[idx]; qElt.form.submit(); }
function gsc_handleup(elt, qElt) { if (elt.numres > 0 && gsc_ishidden(elt)) { gsc_show(elt); return; } if (elt.selectedIndex == 0) { return; } else if (elt.selectedIndex < 0) { elt.selectedIndex = elt.numres - 1; } else { elt.selectedIndex--; }; gsc_highlightsel(elt, qElt); }
function gsc_handledown(elt, qElt) { if (elt.numres > 0 && gsc_ishidden(elt)) { gsc_show(elt); return; } if (elt.selectedIndex == elt.numres - 1) { elt.selectedIndex = 0; } else if (elt.selectedIndex < 0) { elt.selectedIndex = 0; } else { elt.selectedIndex++; }; gsc_highlightsel(elt, qElt); }
function gsc_highlightsel(elt, qElt) { 
   divs = elt.getElementsByTagName('div'); 
   for (i = 0; i < divs.length; i++) { 
      if (i == elt.selectedIndex) { 
         divs[i].className = 'srs'; 
         elt.tempQuery = elt.res[i]; 
         if (qElt) { 
            qElt.value = elt.res[i]; 
            if (qElt.createTextRange) { 
               r = qElt.createTextRange(); 
               r.moveStart('character', elt.cq.length); 
               r.moveEnd('character', qElt.value.length); 
               r.select(); 
            } 
         } 
      } else { 
         divs[i].className = 'sr'; 
      } 
   } 
}

function getCookieVal (offset) { var endstr = document.cookie.indexOf (";", offset); if (endstr == -1) { endstr = document.cookie.length; } return unescape(document.cookie.substring(offset, endstr)); }
function GetCookie (name) { var arg = name + "="; var alen = arg.length; var clen = document.cookie.length; var i = 0; while (i < clen) { var j = i + alen; if (document.cookie.substring(i, j) == arg) { return getCookieVal (j); } i = document.cookie.indexOf(" ", i) + 1; if (i == 0) break;  } return null; }
function SetCookie (name, value) { var argv = SetCookie.arguments; var argc = SetCookie.arguments.length; var expires = (argc > 2) ? argv[2] : null; var path = (argc > 3) ? argv[3] : null; var domain = (argc > 4) ? argv[4] : null; var secure = (argc > 5) ? argv[5] : false; document.cookie = name + "=" + escape (value) + ((expires == null) ? "" : ("; expires=" + expires.toGMTString())) + ((path == null) ? "" : ("; path=" + path)) + ((domain == null) ? "" : ("; domain=" + domain)) + ((secure == true) ? "; secure" : ""); }

function parseForm(form_id) {
   var frm = _gel(form_id);
   if(frm) {
      var el = frm.elements;
      var ret='';
      for (var i=0;i<el.length;i++) {
         if(!el[i].name) continue;
         switch(el[i].type) {
            case 'radio':
            case 'checkbox':
               if(el[i].checked) {
                  ret += '@@'+el[i].name +'^^'+el[i].value
               }
               break;
            default:
               ret += '@@'+el[i].name +'^^'+el[i].value
               break;
         }
      }
      ret=urlencode(ret.substring(2));
      return ret;
   }
}

function strPad(sText,sTextPad,nTextLen) {
   var nMissing = nTextLen - sText.toString().length;
   var ret = '';
   var padding = sTextPad.substring(0,1);
   if (nMissing > 0) {
      for (var i = 0; i < nMissing; i++) ret += padding;
   }
   ret+=sText;
   return ret;
}
function translateIdCom(idn) {
   var inx = _gel(idn).value.split('=');
   return inx[1];
}

function translateIdParent(idn) {
   var inx = _gel(idn).value.split('=');
   return inx[0];
}

var _current_q=null;
function _onkeypress(e) {
   key=getkeyc(e);
   switch(key) {
      case 13:
         e.cancelBubble=true;
         return false;
         break;
   }
};

function _onkeydown(e) { 
   key = getkeyc(e);
   _current_q=e.target; 
   switch (key) { 
      case 27: 
         gsc_hide( _subres); 
         return false; 
         break; 
      case 38: 
         gsc_handleup( _subres, _current_q); 
         return false; 
         break; 
      case 40: 
         gsc_handledown( _subres, _current_q); 
         return false; 
         break;
      case 13:
         _current_q._add(_subres.selectedIndex);
         return false;
         break;
      default: 
         _subgt.start(); 
   } 
   return true; 
}
var _qt = new ctimer('_qt.ontimerexpire()', 350);
_qt.ontimerexpire = function() { _q = gsc_getquery( _subres, qconcept.value); if (_q.length == 0) { return false; }; pjx_app_getConcept(_q,'',_qconceptsuccess); }
var oldqconcept=null;
function oldshow_qconcept(uid,o_id,d,e) {
   e.cancelBubble=true;
   if(qconcept&&qconcept.uid!=uid) {
      qconcept.blur();
      qconcept.style.visibility='hidden';
      _gel('spancon_'+qconcept.uid).style.display='';
      gsc_hide(_subres);
   }
   qconcept = _gel('qconcept_'+uid);
   if(qconcept) {
      qconcept.obj_id = o_id;
      qconcept.uid = uid;
      qconcept.span = _gel('spancon_'+uid);
      qconcept.value='';
      _subres.cq=null;
      if(qconcept.style.visibility=='hidden') {
         qconcept.style.visibility='visible';
         qconcept.span.style.display='none';
         qconcept.focus();
         document.onclick=revertConcept;
         qconcept.onkeypress=function(e) {
            key=getkeyc(e);
            switch(key) {
               case 13:
                  e.cancelBubble=true;
                  qconcept.blur();
                  qconcept.style.visibility='hidden';
                  qconcept.span.style.display='';
                  qconcept=null;
                  return false;
                  break;
            }
         };
         qconcept.onkeydown=function(e) { 
            key = getkeyc(e);
            switch (key) { 
               case 27: 
                  gsc_hide( _subres); 
                  revertConcept();
                  return false; 
                  break; 
               case 38: 
                  gsc_handleup( _subres, qconcept); 
                  return false; 
                  break; 
               case 40: 
                  gsc_handledown( _subres, qconcept); 
                  return false; 
                  break;
               case 13:
                  e.cancelBubble=true;
                  _setconcept(_subres.selectedIndex);
                  return false;
                  break;
               default: 
                  _qt.start(); 
            } 
            return true; 
         };
         return false;
      } else {
         qconcept.style.visibility='hidden';
         qconcept.span.style.display='';
         qconcept=null;
      }
      
   }
   
}
function fetchNodeUp(d,sNode) {
   while(d!=null) {
      d=d.parentNode;
      if(d!=null&&sNode!=null&&d.nodeName.toLowerCase()==sNode.toLowerCase()) {
         return d;
      }
   }
   return null;
}

function fetchIdUp(d,Id) {
   while(d!=null) {
      d=d.parentNode;
      if(d!=null&&Id!=null&&d.id==Id) {
         return d;
      }
   }
   return null;
}

function doNewObj(uid,p_o_id,con_class_id) {
   _current_q = _gel('inp_'+uid);
   pjx_app_createCom(p_o_id,con_class_id,_current_q._show);
}
function _destroy(obj) {
   if(obj&&obj.parentNode) {
      obj.parentNode.removeChild(obj);
      obj=null;
   }
}

var img_progress = new Image();
img_progress.src = base_url+'/images/progress2.gif';
function progress_span() {
   var imgx = document.createElement('img');
   imgx.src = img_progress.src;
   imgx.style.verticalAlign = 'middle';
   imgx.style.height = '6px';
   imgx.style.marginLeft = '7px';
   var span = document.createElement('span');
   span.style.fontWeight = 'normal';
   if(progress_span.arguments[1]) {
      span.setAttribute('id',progress_span.arguments[1]);
   }
   if(progress_span.arguments[0]) {
      span.innerHTML = progress_span.arguments[0];
   } else {
      span.innerHTML =' ... proses';
   }
   span.insertBefore(imgx,span.firstChild);
   return span;
}

var img_circlewaitgrey = new Image();
img_circlewaitgrey.src = base_url+'/images/srcajaxwait.gif';
img_circlewaitgrey.style.margin = '1px';
img_circlewaitgrey.style.height = '14px';
img_circlewaitgrey.style.verticalAlign = 'middle';

var img_next = new Image();
img_next.src = base_url+'/images/next.gif';
img_next.style.margin = '2px';
var img_prev = new Image();
img_prev.src = base_url+'/images/prev.gif';
img_prev.style.margin = '2px';
//img_prev = _dce('div');
//img_prev.innerHTML = '&lt;&lt;';
//img_next = _dce('div');
//img_next.innerHTML = '&gt;&gt;';

var last_ajax_id = 1;

function _make_ajax(_qq) {
   _make_id(_qq);
   _make_subres(_qq);
   _qq.setAttribute('autocomplete','off');
   
   _qq._query = function() {
      var q = '';
      if(_qq._get_param) {
         q = _qq._get_param();
      } else {
         if(_qq.value) {
            q = _qq.value;
            q = trim(q);
         }
      }
      if(_qq.getAttribute('type')=='text'&&q.length == 0) {
         _qq._showResult(false);
         if(_qq._inp_key) {
            _qq.onkeypress=_qq._inp_key;
         }
         return;
      }
      _qq._showProgress();
      _qq._cq = q;
      if(_qq._send_query) {
         _qq._send_query(q,_qq._success); 
      }
   };
   
   _qq._inp_key=function(e) {
      key = getkeyc(e);
      switch (key) { 
         case 27: 
            if(_qq.getAttribute('type')=='text') {
               _qq.value = '';
            }
            if(_qq._onescape) {
               _qq._onescape();
            }
            return false;
            break;
         case 13:
            _qq._query();
            e.cancelBubble = true;
            return false;
            break;
         case 8:
            var q = trim(_qq.value);
            if(q.length < 3) {
               _qq._showResult(false);
            }
            break;
         case 9:
            if(_qq._ontab) {
               _qq._ontab();
               e.cancelBubble=true;
               return false;
            }
            break;
         default:
            break;
      } 
      return true; 
   };
   
   _qq.onkeypress = _qq._inp_key;
   _make_success(_qq);
   _make_redraw(_qq);
   _make_result(_qq);
   _qq._reset = function() {
      _qq._data = new Array();
      _qq._data_count = 0;
      _qq.onkeypress=_qq._inp_key;
   };
   
}

function _make_dropdown(_qq) {
   _make_id(_qq);
   _make_subres(_qq);
   
   _qq._query = function() {
      var q = '';
      if(_qq._get_param) {
         q = _qq._get_param();
      }
      _qq._showProgress();
      if(_qq._send_query&&_qq._success) {
         _qq._send_query(q,_qq._success); 
      }
   };
   
   _qq._reset = function() {
      _qq._data = new Array();
      _qq._data_count = 0;
      //_qq.onkeypress=false;
   };

   _make_success(_qq);
   _make_redraw(_qq);
   _make_result(_qq);
   _qq._dropdownized = true;
}

function __mov(id, idx) {
   var _qq = _gel(id);
   if(_qq) {
      _qq._selectedIndex = idx;
      _qq.focus();
      _qq._highlightsel();
   }
}

function __mup(id) {
}
   
function __ocl(id,idx) {
   var _qq = _gel(id);
   if(_qq) {
      _qq._get_result(idx);
   }
}

function _make_timer(_qq) {
   // setup timer
   _qq.tp = 0;
   _qq.ms = 1;
   _qq.timer_start=function() {
      if(this.tp>0) this.timer_reset();
      this.tp=window.setTimeout(this._query,this.ms);
   };
   _qq.timer_reset=function() {
      if(_qq.tp>0) window.clearTimeout(_qq.tp);
      _qq.tp=0;
   };
}

function sql2string(t) {
      var myear = new Array('Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember');
      var dttm = t.split(' ');
      var dt,tt;
      var y,m,d,hh,mm,ss;
      y=m=d=hh=mm=ss=null;
      dt = dttm[0].split('-');
      y=parseInt(dt[0]*1);
      m=parseInt(dt[1]*1);
      d=parseInt(dt[2]*1);
      var datestr='';
      datestr += d+' '+myear[m-1]+' '+y;
      if(sql2string.arguments[1]=='datetime') {
         tt = dttm[1].split(':');
         datestr += ' '+strPad(tt[0],'0',2)+':'+strPad(tt[1],'0',2);
      } else if(sql2string.arguments[1]=='datetimesec') {
         tt = dttm[1].split(':');
         datestr += ' '+strPad(tt[0],'0',2)+':'+strPad(tt[1],'0',2)+':'+strPad(tt[2],'0',2);
      } else if(sql2string.arguments[1]=='time') {
         tt = dttm[1].split(':');
         datestr = ' '+strPad(tt[0],'0',2)+':'+strPad(tt[1],'0',2);
      } else if(sql2string.arguments[1]=='timesec') {
         tt = dttm[1].split(':');
         datestr = ' '+strPad(tt[0],'0',2)+':'+strPad(tt[1],'0',2)+':'+strPad(tt[2],'0',2);
      }
      return datestr;
   }

   function dttm2class(t) {
      var dttm = t.split(' ');
      var dt,tt;
      dt = dttm[0].split('-');
      tt = dttm[1].split(':');
      datestr = strPad(dt[0],'0',4)+strPad(dt[1],'0',2)+strPad(dt[2],'0',2)+strPad(tt[0],'0',2)+strPad(tt[1],'0',2)+strPad(tt[2],'0',2);
      return datestr;
   }


function doSelectAll(inp) {
   if(inp) {
      inp.selectionStart = 0;
      inp.selectionEnd = inp.value.length;
      inp.focus();
   }
}

function _dsa(inp) {
   if(inp) {
      inp.selectionStart = 0;
      inp.selectionEnd = inp.value.length;
      inp.focus();
   }
}

var ksave = 1;
function _savekey() {
   ksave.kd = document.onkeydown;
   ksave.kp = document.onkeypress;
   document.onkeydown = null;
   document.onkeypress = null;
}

function _revertkey() {
   document.onkeydown = ksave.kd;
   document.onkeypress = ksave.kp;
}

function thSep(nStr) {
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? ',' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + '.' + '$2');
	}
	return x1 + x2;
}


//// new printing framework
function do_print_iframe(nm) { window.frames[nm].focus(); window.frames[nm].print(); }

function close_preview() {
   _destroy(dvpreview.iframe);
   _destroy(dvpreview.frame);
   _destroy(dvpreview.bg1);
   _destroy(dvpreview.bg0);
   _destroy(dvpreview);
   dvpreview.frame = null;
   dvpreview.bg1 = null;
   dvpreview.bg0 = null;
   dvpreview = null;
}

var dvpreview = null;
function setup_preview() {
   if(dvpreview) {
      close_preview();
   }
   
   var btn_printserver = '';
   
 
   
   var nm = uniqid();
   dvpreview = _dce('div');
   dvpreview.setAttribute('class','xpreview');
   dvpreview = document.body.appendChild(dvpreview);
   dvpreview.bg0 = _dce('div');
   dvpreview.bg0.setAttribute('class','xpreview_bg0');
   dvpreview.bg0 = dvpreview.appendChild(dvpreview.bg0);
   dvpreview.bg1 = _dce('div');
   dvpreview.bg1.setAttribute('class','xpreview_bg1');
   dvpreview.bg1 = dvpreview.appendChild(dvpreview.bg1);
   dvpreview.btn = _dce('div');
   dvpreview.btn.setAttribute('class','xpreview_dvbtn');
   dvpreview.btn = dvpreview.bg1.appendChild(dvpreview.btn);
   dvpreview.btn.innerHTML = '<input type="button" value="Print" class="xpreview_btn" onclick="do_print_iframe(\''+nm+'\');"/>&nbsp;'
                           + btn_printserver
                           + '<input type="button" value="Close" class="xpreview_btn" onclick="close_preview();"/>&nbsp;';
   dvpreview.pn = _dce('div');
   dvpreview.pn.setAttribute('class','xpreview_pn');
   dvpreview.pn = dvpreview.bg1.appendChild(dvpreview.pn);
   dvpreview.pn.onclick=close_preview;
   dvpreview.frame = _dce('div');
   dvpreview.frame.setAttribute('class','xpreview_frame');
   dvpreview.frame = dvpreview.bg1.appendChild(dvpreview.frame);
   dvpreview.iframe = _dce('iframe');
   dvpreview.iframe.setAttribute('class','xpreview_iframe');
   dvpreview.iframe.setAttribute('id',nm);
   dvpreview.iframe.setAttribute('name',nm);
   dvpreview.iframe = dvpreview.frame.appendChild(dvpreview.iframe);
}

function uniqid (prefix, more_entropy) {
   // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
   // +    revised by: Kankrelune (http://www.webfaktory.info/)
   // %        note 1: Uses an internal counter (in php_js global) to avoid collision
   // *     example 1: uniqid();    // *     returns 1: 'a30285b160c14'
   // *     example 2: uniqid('foo');
   // *     returns 2: 'fooa30285b1cd361'
   // *     example 3: uniqid('bar', true);
   // *     returns 3: 'bara20285b23dfd1.31879087'
   
   if (typeof prefix == 'undefined') prefix = "";

   var retId;
   var formatSeed = function (seed, reqWidth) {
      seed = parseInt(seed,10).toString(16); // to hex str
      if (reqWidth < seed.length) { // so long we split
         return seed.slice(seed.length - reqWidth);
      }
      if (reqWidth > seed.length) { // so short we pad
         return Array(1 + (reqWidth - seed.length)).join('0')+seed;
      }
      return seed;
   }; 
   // BEGIN REDUNDANT
   if (!this.php_js) {
      this.php_js = {};
   }
    // END REDUNDANT
   if (!this.php_js.uniqidSeed) { // init seed with big random int
      this.php_js.uniqidSeed = Math.floor(Math.random() * 0x75bcd15);
   }
   this.php_js.uniqidSeed++; 
   retId  = prefix; // start with prefix, add current milliseconds hex string
   retId += formatSeed(parseInt(new Date().getTime()/1000,10),8);
   retId += formatSeed(this.php_js.uniqidSeed,5); // add seed hex string
   if (more_entropy) {
      // for more entropy we add a float lower to 10
      retId += (Math.random()*10).toFixed(8).toString();
   }
   return retId;
}

// The data for all month
var monthData = [
//    {"code":0,"monthNameEN":"All","monthNameID":"All"},
    {"code":1,"monthNameEN":"January","monthNameID":"Januari"},
    {"code":2,"monthNameEN":"February","monthNameID":"Februari"},
    {"code":3,"monthNameEN":"March","monthNameID":"Maret"},
    {"code":4,"monthNameEN":"April","monthNameID":"April"},
    {"code":5,"monthNameEN":"May","monthNameID":"Mei"},
    {"code":6,"monthNameEN":"June","monthNameID":"Juni"},
    {"code":7,"monthNameEN":"July","monthNameID":"Juli"},
    {"code":8,"monthNameEN":"August","monthNameID":"Agustus"},
    {"code":9,"monthNameEN":"September","monthNameID":"September"},
    {"code":10,"monthNameEN":"October","monthNameID":"Oktober"},
    {"code":11,"monthNameEN":"November","monthNameID":"November"},
    {"code":12,"monthNameEN":"December","monthNameID":"Desember"}
];

var yearData = [
    {"code":"2012"},
    {"code":"2013"},
    {"code":"2014"},
    {"code":"2015"}
];

var monthName;
var yearName;