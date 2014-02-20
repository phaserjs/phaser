<?php
    require('list.php');

    if ($_SERVER['SERVER_NAME'] == '192.168.0.100')
    {
        require('view_local.php');
    }
    else
    {
        require('view_remote.php');
    }
?>