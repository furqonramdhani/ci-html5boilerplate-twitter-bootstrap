<?php

$building_id = $_GET["oid"];
$inst_id = $_GET["pid"];
$admission_id = $_GET["aid"];

$db=&Database::getInstance();

$paper = "A4";

switch($paper) {
   case "A6":
      $width = 350;
      $height = 400;
      $page_size_w = "10.5cm";
      $page_size_h = "14.8cm";
      $offset_left = 220;
      break;
   case "A4":
   default:
      $width = 350;
      $height = 400;
      $page_size_w = "10.5cm";
      $page_size_h = "16.7cm";
      $offset_left = 10;
     break;

}




echo '<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"
	xmlns:w="urn:schemas-microsoft-com:office:word"
	xmlns:m="http://schemas.microsoft.com/office/2004/12/omml"
	xmlns:css="http://macVmlSchemaUri" xmlns="http://www.w3.org/TR/REC-html40">

	<head>
	<meta http-equiv=Content-Type content="text/html; charset=macintosh">
	<meta name=ProgId content=Word.Document>
	<meta name=Generator content="Microsoft Word 2008">
	<meta name=Originator content="Microsoft Word 2008">
	
	<style>
	<!--
	 /* Font Definitions */
	@font-face
		{font-family:Calibri;
		panose-1:2 15 5 2 2 2 4 3 2 4;
		mso-font-charset:0;
		mso-generic-font-family:auto;
		mso-font-pitch:variable;
		mso-font-signature:3 0 0 0 1 0;}
	@font-face
		{font-family:Tahoma;
		panose-1:2 11 6 4 3 5 4 4 2 4;
		mso-font-charset:0;
		mso-generic-font-family:auto;
		mso-font-pitch:variable;
		mso-font-signature:3 0 0 0 1 0;}
	 /* Style Definitions */
	p.MsoNormal, li.MsoNormal, div.MsoNormal
		{mso-style-parent:"";
		margin:0cm;
		margin-bottom:.0001pt;
		mso-pagination:widow-orphan;
		font-size:10pt;
		font-family:"Times New Roman";
		mso-fareast-font-family:"Times New Roman";
		mso-bidi-font-family:"Times New Roman";}
	a:link, span.MsoHyperlink
		{color:blue;
		text-decoration:underline;
		text-underline:single;}
	a:visited, span.MsoHyperlinkFollowed
		{mso-style-noshow:yes;
		color:purple;
		text-decoration:underline;
		text-underline:single;}
	 /* Page Definitions */
	@page
		{mso-footnote-separator:url(":Lampiran 4. Format Surat Pemberitahuan Pelanggaran KDM 2_files:header.htm") fs;
		mso-footnote-continuation-separator:url(":Lampiran 4. Format Surat Pemberitahuan Pelanggaran KDM 2_files:header.htm") fcs;
		mso-endnote-separator:url(":Lampiran 4. Format Surat Pemberitahuan Pelanggaran KDM 2_files:header.htm") es;
		mso-endnote-continuation-separator:url(":Lampiran 4. Format Surat Pemberitahuan Pelanggaran KDM 2_files:header.htm") ecs;}
	@page Section1
		{size:595.45pt 841.7pt;
		margin:57.6pt 54.0pt 45.35pt 54.0pt;
		mso-header-margin:36.0pt;
		mso-footer-margin:36.0pt;
		mso-paper-source:0;}
	div.Section1
		{page:Section1;}
	 /* List Definitions */
	@list l0
		{mso-list-id:1205097395;
		mso-list-type:hybrid;
		mso-list-template-ids:-1648968784 67698703 67698713 67698715 67698703 67698713 67698715 67698703 67698713 67698715;}
	@list l0:level1
		{mso-level-tab-stop:none;
		mso-level-number-position:left;
		text-indent:-18.0pt;}
	@list l1
		{mso-list-id:1553924431;
		mso-list-type:hybrid;
		mso-list-template-ids:1823239776 -795200932 67698713 67698715 67698703 67698713 67698715 67698703 67698713 67698715;}
	@list l1:level1
		{mso-level-tab-stop:none;
		mso-level-number-position:left;
		margin-left:81.0pt;
		text-indent:-18.0pt;}
	ol
		{margin-bottom:0cm;}
	ul
		{margin-bottom:0cm;}
	-->
	</style>
	<!--[if gte mso 10]>
	<style>
	 /* Style Definitions */

	table.MsoNormalTable
		{mso-style-name:"Table Normal";
		mso-tstyle-rowband-size:0;
		mso-tstyle-colband-size:0;
		mso-style-noshow:yes;
		mso-style-parent:"";
		mso-padding-alt:0cm 5.4pt 0cm 5.4pt;
		mso-para-margin:0cm;
		mso-para-margin-bottom:.0001pt;
		mso-pagination:widow-orphan;
		
		font-family:"Times New Roman";
		mso-ascii-font-family:Calibri;
		mso-hansi-font-family:Calibri;}
	</style>
	<![endif]--><!--[if gte mso 9]><xml>
	 <o:shapedefaults v:ext="edit" spidmax="1027"/>
	</xml><![endif]--><!--[if gte mso 9]><xml>
	 <o:shapelayout v:ext="edit">
	  <o:idmap v:ext="edit" data="1"/>
	 </o:shapelayout></xml><![endif]-->
	
	<style type="text/css" media="screen">
	   body {
	      padding-top:2px;
		  padding-left:2px;
		  padding-right:1px;	      
	      font-size: 8pt;
	      background-color:#fff;
	   }
	   .pagediv {font-size:0.83em;padding:15px;background-color:#fff;width:${width}px;top:10px;margin-left:${offset_left}px;margin-bottom:10px;-moz-box-shadow:2px 2px 10px #999;}
	   .innerpage {width:${width}px !important;padding:0px;}
	   .header {}
	   .footer {}
	   table.invoice_info {font-size:1em;border-spacing:0;padding:0;margin:0;}
	   div.patient_info {padding:2px;}
	   table.patient_info {font-size:1em;border-spacing:0px;padding:0px;margin:0px;}
	   table.order_info {font-size:1em;border-spacing:0px;border:0px;margin:0px;margin-top:5px;width:100%;}
	   table.order_info thead tr td {border-bottom:2px solid #000000;border-top:1px solid #000000;}
	   table.order_info tbody tr.total td {font-weight:bold;border-top:2px solid #000000;border-bottom:2px solid #000000;vertical-align:top;}
	</style>

	<style type="text/css" media="print">
	   @page { size:${page_size_w} ${page_size_h}; margin: 1cm; padding:0cm; }
	   body {
	      font-size: 8pt;
	      background-color:#fff;
	      margin:0;
	   }
	   .pagediv{margin:0cm;padding:0.5cm;}
	   .innerpage {padding:0cm;page-break-inside:avoid;}
	   .header {page-break-before:avoid;}
	   .footer {page-break-after:always;}
	   table.invoice_info {font-size:1em;border-spacing:0;padding:0;margin:0;}
	   div.patient_info {padding:2px;}
	   table.patient_info {font-size:1em;border-spacing:0px;padding:0px;margin:0px;}
	   table.order_info {font-size:1em;border-spacing:0px;border:0px;margin:0px;margin-top:5px;width:100%;}
	   table.order_info thead tr td {border-bottom:2px solid #000000;border-top:1px solid #000000;}
	   table.order_info tbody tr.total td {font-weight:bold;border-top:2px solid #000000;border-bottom:2px solid #000000;vertical-align:top;}
	</style>
	
	</head>

	<body lang=EN-US link=blue vlink=purple style="tab-interval:36.0pt">

	<div class=Section1>

	<p class=MsoNormal style="tab-stops:45.0pt 54.0pt 63.0pt"><span lang=FI
	style="font-family:Tahoma;mso-bidi-font-family:Tahoma;
	mso-ansi-language:FI"><span style="mso-tab-count:1">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span>
		<table width="100%" border="0" cellspacing="1" cellpadding="0" style="font-size:10pt;">
		  <tr>
		    <td>&nbsp;</td>
		    <td></td>
		    <td><div align="right">..............2011</div></td>
		  </tr>
		  <tr>
		    <td>Nomor</td>
		    <td>: </td>
		    <td></td>
		  </tr>
		  <tr>
		    <td>Sifat</td>
		    <td>: Penting</td>
		    <td></td>
		  </tr>
		  <tr>
		    <td>Lampiran</td>
		    <td>: </td>
		    <td>Kepada</td>
		  </tr>
		  <tr>
		    <td>Hal</td>
		    <td>: <strong>Pemberitahuan Pelanggaran</strong></td>
		    <td>Yth. Pimpinan/Pengelola Gedung</td>
		  </tr>
		  <tr>
		    <td>&nbsp;</td>
		    <td><strong>&nbsp;&nbsp;Kawasan Dilarang Merokok</strong></td>
		    <td>'.$building_id.'</td>
		  </tr>
		  <tr>
		    <td></td>
		    <td>&nbsp;</td>
		    <td>Jl. .................................</td>
		  </tr>
		  <tr>
		    <td>&nbsp;</td>
		    <td>&nbsp;</td>
		    <td>Jakarta ................</td>
		  </tr>
		  <tr>
		    <td>&nbsp;</td>
		    <td>&nbsp;</td>
		    <td>di </td>
		  </tr>
		  <tr>
		    <td>&nbsp;</td>
		    <td>&nbsp;</td>
		    <td>Tempat</td>
		  </tr>
		  <tr>
		    <td>&nbsp;</td>
		    <td>&nbsp;</td>
		    <td>&nbsp;</td>
		  </tr>
		</table>

	<p class=MsoNormal style="margin-top:0cm;margin-right:0cm;margin-bottom:10.0pt;
	margin-left:63.0pt;text-align:justify;text-indent:36.0pt;tab-stops:45.0pt"><span
	lang=FI style="font-family:Tahoma;mso-bidi-font-family:Tahoma;
	mso-ansi-language:FI">Berdasarkan pengaduan masyarakat yang kami terima melalui
	website </span><a href="http://www.pedulijakarta.com"><span lang=FI
	style="font-family:Tahoma;mso-bidi-font-family:Tahoma;
	color:#000;mso-ansi-language:FI">www.pedulijakarta.com</span></a><span
	lang=FI style="font-family:Tahoma;mso-bidi-font-family:Tahoma;
	mso-ansi-language:FI">/call center .............. sebanyak ... pengaduan yaitu
	pada tanggal ..... , <b style="mso-bidi-font-weight:normal">di tempat
	kegiatan/usaha Saudara </b>.............<b style="mso-bidi-font-weight:normal">
	masih terdapat pelanggaran Kawasan Dilarang Merokok</b> <b style="mso-bidi-font-weight:
	normal">(KDM)</b>, yaitu: <o:p></o:p></span></p>

	<p class=MsoNormal style="margin-left:81.0pt;text-align:justify;text-indent:
	-18.0pt;mso-list:l1 level1 lfo2;tab-stops:45.0pt"><![if !supportLists]><span
	lang=FI style="font-family:Tahoma;mso-fareast-font-family:
	Tahoma;mso-bidi-font-family:Tahoma;mso-ansi-language:FI"><span
	style="mso-list:Ignore">1.<span style="font:7.0pt "Times New Roman"">&nbsp;&nbsp;&nbsp;&nbsp;
	</span></span></span><![endif]><span lang=FI style="
	font-family:Tahoma;mso-bidi-font-family:Tahoma;mso-ansi-language:FI"><span
	style="mso-spacerun: yes">&nbsp;</span>Masih ditemukan orang yang merokok di
	dalam gedung. <o:p></o:p></span></p>

	<p class=MsoNormal style="margin-left:81.0pt;text-align:justify;text-indent:
	-18.0pt;mso-list:l1 level1 lfo2;tab-stops:45.0pt"><![if !supportLists]><span
	lang=FI style="font-family:Tahoma;mso-fareast-font-family:
	Tahoma;mso-bidi-font-family:Tahoma;mso-ansi-language:FI"><span
	style="mso-list:Ignore">2.<span style="font:7.0pt "Times New Roman"">&nbsp;&nbsp;&nbsp;&nbsp;
	</span></span></span><![endif]><span lang=FI style="
	font-family:Tahoma;mso-bidi-font-family:Tahoma;mso-ansi-language:FI"><span
	style="mso-spacerun: yes">&nbsp;&nbsp;</span>........................<o:p></o:p></span></p>

	<p class=MsoNormal style="margin-left:81.0pt;text-align:justify;text-indent:
	-18.0pt;mso-list:l1 level1 lfo2;tab-stops:45.0pt"><![if !supportLists]><span
	lang=FI style="font-family:Tahoma;mso-fareast-font-family:
	Tahoma;mso-bidi-font-family:Tahoma;mso-ansi-language:FI"><span
	style="mso-list:Ignore">3.<span style="font:7.0pt "Times New Roman"">&nbsp;&nbsp;&nbsp;&nbsp;
	</span></span></span><![endif]><span lang=FI style="
	font-family:Tahoma;mso-bidi-font-family:Tahoma;mso-ansi-language:FI"><span
	style="mso-spacerun: yes">&nbsp;&nbsp;</span>.......................<o:p></o:p></span></p>

	<p class=MsoNormal style="margin-left:81.0pt;text-align:justify;tab-stops:45.0pt"><span
	lang=FI style="font-family:Tahoma;mso-bidi-font-family:Tahoma;
	mso-ansi-language:FI"><o:p>&nbsp;</o:p></span></p>

	<p class=MsoNormal style="margin-top:0cm;margin-right:0cm;margin-bottom:10.0pt;
	margin-left:63.0pt;text-align:justify;text-indent:36.0pt;tab-stops:45.0pt"><span
	lang=FI style="font-family:Tahoma;mso-bidi-font-family:Tahoma;
	mso-ansi-language:FI">Sehubungan dengan hal tersebut di atas, dan berdasarkan Peraturan
	Daerah Nomor 2 Tahun 2005 tentang <i style="mso-bidi-font-style:normal">Pengendalian
	Pencemaran Udara</i>, Peraturan Gubernur Nomor 75 Tahun 2005 tentang <i
	style="mso-bidi-font-style:normal">Kawasan Dilarang Merokok</i>, dan
	diberlakukannya Peraturan Gubernur Nomor 88 Tahun 2010 tentang <i
	style="mso-bidi-font-style:normal">Perubahan Atas Peraturan Gubernur Nomor 75
	Tahun 2005 tentang Kawasan Dilarang Merokok</i>, <b style="mso-bidi-font-weight:
	normal">Saudara diwajibkan untuk</b> <b style="mso-bidi-font-weight:normal">melakukan
	perbaikan atas<span style="mso-spacerun: yes">&nbsp; </span>pelanggaran
	tersebut di atas, dan melaporkan hasil perbaikannya secara tertulis</b> <b
	style="mso-bidi-font-weight:normal">(bila perlu disertai dengan bukti foto)<span
	style="mso-spacerun: yes">&nbsp; </span></b>melalui<span style="mso-spacerun:
	yes">&nbsp; </span></span><span style="text-decoration:underline;font-family:Tahoma;mso-bidi-font-family:Tahoma;color:windowtext;mso-ansi-language:FI">info@pedulijakarta.com</span><span
	lang=FI style="font-family:Tahoma;mso-bidi-font-family:Tahoma;
	mso-ansi-language:FI"><span style="mso-spacerun: yes">&nbsp; </span>atau ke No.
	Fax. ........... Perlu diketahui bahwa kami sewaktu-waktu akan meninjau ke
	lokasi Saudara sebagai tindak lanjut atas pengaduan masyarakat tanpa
	pemberitahuan terlebih dahulu.<o:p></o:p></span></p>

	<p class=MsoNormal style="margin-top:0cm;margin-right:0cm;margin-bottom:10.0pt;
	margin-left:63.0pt;text-align:justify;text-indent:36.0pt;tab-stops:45.0pt"><span
	lang=FI style="font-family:Tahoma;mso-bidi-font-family:Tahoma;
	mso-ansi-language:FI">Apabila diperlukan, panduan praktis pelaksanaan Kawasan
	Dilarang Merokok untuk Tempat Umum dan Tempat Kerja dapat dilihat di </span><a
	href="http://www.smokefreejakarta.or.id"><span lang=FI style="
	font-family:Tahoma;mso-bidi-font-family:Tahoma;color:windowtext;mso-ansi-language:
	FI">www.smokefreejakarta.or.id</span></a><span lang=FI style="
	font-family:Tahoma;mso-bidi-font-family:Tahoma;mso-ansi-language:FI"> atau </span><span style="text-decoration:underline;	font-family:Tahoma;mso-bidi-font-family:Tahoma;color:windowtext;mso-ansi-language:FI">http://bplhd.jakarta.go.id</span><span lang=FI style="
	font-family:Tahoma;mso-bidi-font-family:Tahoma;mso-ansi-language:FI"><span
	style="mso-spacerun: yes">&nbsp; </span>untuk digunakan sebagai panduan.<o:p></o:p></span></p>

	<p class=MsoNormal style="margin-top:0cm;margin-right:0cm;margin-bottom:10.0pt;
	margin-left:63.0pt;text-align:justify;text-indent:36.0pt;tab-stops:45.0pt"><span
	lang=FI style="font-family:Tahoma;mso-bidi-font-family:Tahoma;
	mso-ansi-language:FI">Atas perhatian dan kerjasama saudara, diucapkan terima
	kasih.<o:p></o:p></span></p>

	<p class=MsoNormal style="margin-top:0cm;margin-right:0cm;margin-bottom:10.0pt;
	margin-left:63.0pt;text-align:justify;text-indent:36.0pt;tab-stops:45.0pt"><span
	lang=FI style="font-family:Tahoma;mso-bidi-font-family:Tahoma;
	mso-ansi-language:FI"><o:p>&nbsp;</o:p></span></p>

	<p class=MsoNormal align=center style="margin-left:184.3pt;text-align:center;
	tab-stops:0cm"><b style="mso-bidi-font-weight:normal"><span lang=FI
	style="font-family:Tahoma;mso-bidi-font-family:Tahoma;
	mso-ansi-language:FI">KEPALA INSTANSI<o:p></o:p></span></b></p>

	<p class=MsoNormal align=center style="margin-left:184.3pt;text-align:center;
	tab-stops:0cm"><b style="mso-bidi-font-weight:normal"><span lang=FI
	style="font-family:Tahoma;mso-bidi-font-family:Tahoma;
	mso-ansi-language:FI">PROVINSI DAERAH KHUSUS IBUKOTA JAKARTA,<o:p></o:p></span></b></p>

	<p class=MsoNormal align=center style="margin-left:184.3pt;text-align:center;
	tab-stops:0cm"><b style="mso-bidi-font-weight:normal"><span lang=FI
	style="font-family:Tahoma;mso-bidi-font-family:Tahoma;
	mso-ansi-language:FI"><o:p>&nbsp;</o:p></span></b></p>

	<p class=MsoNormal align=center style="margin-left:184.3pt;text-align:center;
	tab-stops:0cm"><b style="mso-bidi-font-weight:normal"><span lang=FI
	style="font-family:Tahoma;mso-bidi-font-family:Tahoma;
	mso-ansi-language:FI"><o:p>&nbsp;</o:p></span></b></p>

	<p class=MsoNormal align=center style="margin-left:184.3pt;text-align:center;
	tab-stops:0cm"><b style="mso-bidi-font-weight:normal"><span lang=FI
	style="font-family:Tahoma;mso-bidi-font-family:Tahoma;
	mso-ansi-language:FI"><o:p>&nbsp;</o:p></span></b></p>

	<p class=MsoNormal align=center style="margin-left:184.3pt;text-align:center;
	tab-stops:0cm"><b style="mso-bidi-font-weight:normal"><span lang=FI
	style="font-family:Tahoma;mso-bidi-font-family:Tahoma;
	mso-ansi-language:FI">..................................................................<o:p></o:p></span></b></p>

	<p class=MsoNormal align=center style="margin-left:184.3pt;text-align:center;
	tab-stops:0cm"><b style="mso-bidi-font-weight:normal"><span lang=FI
	style="font-family:Tahoma;mso-bidi-font-family:Tahoma;
	mso-ansi-language:FI">NIP. ...........................................</span></b><span
	lang=FI style="font-family:Tahoma;mso-bidi-font-family:Tahoma;
	mso-ansi-language:FI"><o:p></o:p></span></p>

	<p class=MsoNormal style="tab-stops:45.0pt"><span lang=FI style="font-size:
	9.0pt;font-family:Tahoma;mso-bidi-font-family:Tahoma;mso-ansi-language:FI">Tembusan
	:<o:p></o:p></span></p>

	<p class=MsoNormal style="margin-left:13.5pt;text-indent:-13.5pt;mso-list:l0 level1 lfo1;
	tab-stops:13.5pt"><![if !supportLists]><span lang=FI style="font-size:9.0pt;
	font-family:Tahoma;mso-fareast-font-family:Tahoma;mso-bidi-font-family:Tahoma;
	mso-ansi-language:FI"><span style="mso-list:Ignore">1.<span style="font:7.0pt "Times New Roman"">&nbsp;&nbsp;
	</span></span></span><![endif]><span lang=FI style="font-size:9.0pt;font-family:
	Tahoma;mso-bidi-font-family:Tahoma;mso-ansi-language:FI">Gubernur Provinsi DKI
	Jakarta;<o:p></o:p></span></p>

	<p class=MsoNormal style="margin-left:13.5pt;text-indent:-13.5pt;mso-list:l0 level1 lfo1;
	tab-stops:13.5pt"><![if !supportLists]><span lang=FI style="font-size:9.0pt;
	font-family:Tahoma;mso-fareast-font-family:Tahoma;mso-bidi-font-family:Tahoma;
	mso-ansi-language:FI"><span style="mso-list:Ignore">2.<span style="font:7.0pt "Times New Roman"">&nbsp;&nbsp;
	</span></span></span><![endif]><span lang=FI style="font-size:9.0pt;font-family:
	Tahoma;mso-bidi-font-family:Tahoma;mso-ansi-language:FI">Asisten Kesehatan
	Masyarakat Sekda Provinsi DKI Jakarta;<o:p></o:p></span></p>

	<p class=MsoNormal style="margin-left:13.5pt;text-indent:-13.5pt;mso-list:l0 level1 lfo1;
	tab-stops:13.5pt"><![if !supportLists]><span lang=FI style="font-size:9.0pt;
	font-family:Tahoma;mso-fareast-font-family:Tahoma;mso-bidi-font-family:Tahoma;
	mso-ansi-language:FI"><span style="mso-list:Ignore">3.<span style="font:7.0pt "Times New Roman"">&nbsp;&nbsp;
	</span></span></span><![endif]><span lang=FI style="font-size:9.0pt;font-family:
	Tahoma;mso-bidi-font-family:Tahoma;mso-ansi-language:FI">Walikota Jakarta ...;<o:p></o:p></span></p>

	<p class=MsoNormal style="margin-left:13.5pt;text-indent:-13.5pt;mso-list:l0 level1 lfo1;
	tab-stops:13.5pt"><![if !supportLists]><span lang=FI style="font-size:9.0pt;
	mso-ansi-language:FI"><span style="mso-list:Ignore">4.<span style="font:7.0pt "Times New Roman"">&nbsp;&nbsp;&nbsp;
	</span></span></span><![endif]><span lang=FI style="font-size:9.0pt;font-family:
	Tahoma;mso-bidi-font-family:Tahoma;mso-ansi-language:FI">Kepala Dinas Terkait.</span><span
	lang=FI style="font-size:9.0pt;mso-ansi-language:FI"><o:p></o:p></span></p>

	<p class=MsoNormal><span lang=ES-TRAD style="mso-ansi-language:ES-TRAD"><o:p>&nbsp;</o:p></span></p>

	</div>

	</body>

	</html>
';
