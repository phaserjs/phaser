<?php
    require('list.php');

    if ($_SERVER['SERVER_NAME'] == '192.168.0.100')
    {
        require('index_local.php');
    }
    else
    {
        require('index_remote.php');
    }
?>