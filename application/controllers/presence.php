<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Presence extends MY_Controller {
	
	public function index(){	
		
		/*
		 *set up title and keywords (if not the default in custom.php config file will be set) 
		 */
		$this->title = "Category";
		$this->keywords = "Category";
		
		$this->_render('pages/presence');
	}
	
}