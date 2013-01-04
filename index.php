<?php
    /*
        syntax:
            http://tools.sbr.so/API/domainLookup/?callback=FUNCTION&domain=DOMAIN&return=a|mx|ns|registrar|registrant|status|expires
            https://therebelrobot.com/tools/API/domainLookup/?callback=FUNCTIONNAME&domain=DOMAIN&return=a|mx|ns|registrar|registrant|status|expires
            
            
            $.getJSON('https://therebelrobot.com/tools/API/domainLookup/?callback='+functionname+'&domain='+domain+'&return=a|mx|ns|registrar|registrant|status|expires', function(data){
                });
    */
    header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1 header("Pragma: no-cache"); 
    header("Expires: Sat, 26 Jul 1997 05:00:00 GMT"); // Date in the past 
    header('Content-type: application/json; charset=utf-8'); 

    
    $domain = strtolower($_GET['domain']);
    $function = $_GET['callback'];
    $records = $_GET['return'];
        $records = explode('|', $records);
    
    $return = array();
    
    
    include('includes/whois/whois.main.php');
    function arecord($domain) {
        $result = dns_get_record($domain);
        $final = array();
        foreach ($result as $server) {
            if ($server['type'] == "A") {
                $host = $server['host'];
                $aIp = $server['ip'];
                $final[$host] = $aIp;
            }
        }
        return $final;
    }

    function nameserver($domain) {
        $result = dns_get_record($domain, DNS_ANY, $authns, $addtl);
        $final = array();
        foreach ($authns as $server) {
            $target = strtolower($server['target']);
            $nsresult = dns_get_record($target);
            foreach ($nsresult as $nsserver) {
                if ($nsserver['type'] == "A") {
                    $nsserverip = $nsserver['ip'];
                }
            }
                
            $final[$target] = $nsserverip;

        }
        return $final;
    }
    
    function mailinfo($domain) {
        $result = dns_get_record($domain);
        $final = array();

        foreach ($result as $server) {
            if ($server['type'] == "MX") {
                $target = strtolower($server['target']);
                    $mailresult = dns_get_record($target);
        
                    foreach ($mailresult as $mailserver) {
                        if ($mailserver['type'] == "A") {
                            $mailserverip = $mailserver['ip'];
                        }
                    }
                    $final[$target] = $mailserverip."-".$server['pri'];
                }
                
            
        }
        return $final;
    }
    function whoisinfo($domain){
        $whois = new Whois();
        $result = $whois->Lookup($domain);
        return $result;
    }
    
    $domainWhois = whoisinfo($domain);
    foreach ($records as  $record){
        switch ($record) {
            case 'a':
                $return['a'] = arecord($domain);
                break;
            case 'mx':
                $return['mx'] = mailinfo($domain);
                break;
            case 'ns':
                $return['ns'] = nameserver($domain);
                break;
            case 'registrar':
                $return['registrar']['name'] = $domainWhois["regrinfo"]["domain"]["sponsor"].'('.$domainWhois["regyinfo"]["registrar"].')';
                break;
            case 'status':
                $return['status'] = $domainWhois["regrinfo"]["domain"]["status"];
                break;
            case 'registrant':
                $return['registrant'] = $domainWhois["regrinfo"]["owner"]["name"];
                break;
            case 'expires':
                $return['expires'] = $domainExpires = $domainWhois["regrinfo"]["domain"]["expires"];
                break;
        }
    }
    /*
    $domainArecords = arecord($domain);
    $domainMXrecords = mailinfo($domain);
    $domainNS = nameserver($domain);
    $domainWhois = whoisinfo($domain);
    $domainRegistrar = $domainWhois["regyinfo"]["registrar"];
    $domainRegistrarURL = $domainWhois["regyinfo"]["referrer"];
    $domainSponsor = $domainWhois["regrinfo"]["domain"]["sponsor"];
    $domainRegistrant = $domainWhois["regrinfo"]["owner"]["name"];
    $domainExpires = $domainWhois["regrinfo"]["domain"]["expires"];
    $domainCreated = $domainWhois["regrinfo"]["domain"]["created"];
    $domainRenewed = $domainWhois["regrinfo"]["domain"]["changed"];
    $domainStatus = $domainWhois["regrinfo"]["domain"]["status"];
    if (count($domainStatus)>1){
        $newStatus = '';
        foreach ($domainStatus as $status){
            $newStatus .= $status.'|';
        }
        $domainStatus = $newStatus;
    }
    else{
    
        $domainStatus = $domainWhois["regrinfo"]["domain"]["status"][0];
        if (strlen($domainStatus) == 1){
            $domainStatus = $domainWhois["regrinfo"]["domain"]["status"];
            
        }
    }*/
    echo $function."(".json_encode($return).")";
/*    
$obj=array('this','is','a','test'); 
echo 'domainAPIresults('.json_encode($obj).')'; */
    /*
    echo "functionName: ".$function."<br />";
    echo "A records: ".$domainArecords."<br />";
    echo "MX Records: ".$domainMXrecords."<br />";
    echo "Nameservers: ".$domainNS."<br />";
    echo "Registrar: ".$domainRegistrar." - ".$domainRegistrarURL."<br />";
    echo "Sponsoring Registrar: ".$domainSponsor."<br />";
    echo "Registrant: ".$domainRegistrant." - until ".$domainExpires."<br />";
    echo "Status: ".$domainStatus ."<br />";*/
    die();
?>