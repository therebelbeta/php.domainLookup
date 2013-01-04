function getSelText(){
                var txt = '';
                if (window.getSelection){
                    txt = window.getSelection();
                    return txt;
                }
                else if (document.getSelection){
                    txt = document.getSelection();
                    return txt;
                }else if (document.selection){
                    txt = document.selection.createRange().text;
                    return txt;
                }else{    
                    return false;
                }
            }
            function DumpObjectIndented(obj, indent)
            {
              var result = "";
              if (indent == null) indent = "";
            
              for (var property in obj)
              {
                var value = obj[property];
                if (typeof value == 'string')
                  value = "" + value + "";
                else if (typeof value == 'object')
                {
                  if (value instanceof Array)
                  {
                    // Just let JS convert the Array to a string!
                    value = "[ " + value + " ]";
                  }
                  else
                  {
                    // Recursive dump
                    // (replace "  " by "\t" or something else if you prefer)
                    var od = DumpObjectIndented(value, indent + "");
                    // If you like { on the same line as the key
                    //value = "{\n" + od + "" + indent + "}";
                    // If you prefer { and } to be aligned
                    value = "" + indent + "{" + od + "" + indent + "}";
                  }
                }
                result += indent + "" + property + ":" + value + "|";
              }
              return result.replace(/,\n$/, "");
            };
            
            function domainAPIresults(data){
                $('.DNSlookup').html('');
                var thisData = DumpObjectIndented(data,'');
                thisData = thisData.split('|}|');
                $.each(thisData, function(index, fullrecord){
                    fullrecord = fullrecord.split(':{');
                    var thisType = fullrecord[0];
                    var thisRecord = fullrecord[1];
                    switch(thisType){
                        case 'a':
                            thisRecord = thisRecord.split("|");
                            $.each(thisRecord, function(key, value){
                                var thisArecord = value;
                                thisArecord = thisArecord.split(":");
                                    
                                thisAserver = thisArecord[1];
                                
                                $('.DNSlookup').append('<div class="a record"><span class="label">A record</span><span class="IP">'+thisAserver+'</span></div>');
                            });
                            break;
                        case 'mx':
                            thisRecord = thisRecord.split("|");
                            $.each(thisRecord, function(key, value){
                                var thisMXrecord = value;
                                thisMXrecord = thisMXrecord.split(":");
                                    thisMXname = thisMXrecord[0];
                                thisMXserver = thisMXrecord[1];
                                thisMXserver = thisMXserver.split("-");
                                    thisMXip = thisMXserver[0];
                                    thisMXprio = thisMXserver[1];
                                $('.DNSlookup').append('<div class="mx record"><span class="label">MX record</span><span class="IP">'+thisMXip+'</span><span class="name">'+thisMXname+'</span><span class="prio">'+thisMXprio+'</span></div>');
                            });
                            break;
                        case 'ns':
                            thisRecord = thisRecord.split("|");
                            $.each(thisRecord, function(key, value){
                                var thisNSrecord = value;
                                thisNSrecord = thisNSrecord.split(":");
                                    thisNSname = thisNSrecord[0];
                                thisNSserver = thisNSrecord[1];
                                $('.WhoisLookup').append('<div class="ns record"><span class="label">NS</span><span class="name">'+thisNSname+'</span></div>');
                            });
                            break;
                        case 'registrar':
                            thisRegistrar = thisRecord.split(":");
                            thisRegistrar = thisRegistrar[1];
                            $('.WhoisLookup').prepend('<div class="registrar record"><span class="label">Registrar</span><span class="name">'+thisRegistrar+'</span></div>');
                            
                            /* */
                            break;
                    };
                    /*Pull registrant/expires/status info and append*/
                    /*DONE!!!*/
                });
                $('.IP').click(function(){
                    var IP = $(this).html();
                    window.open('http://www.ipchecking.com/?ip='+IP+'&check=Lookup');
                });
                style();
                stylePosition();
            };
            function runAPI(domain){
                $('.DNSlookup').html('');
                $('.WhoisLookup').html('');
                $.getJSON('http://tools.sbr.so/API/domainLookup/?domain='+domain+'&return=a|mx|ns|registrar|registrant|status|expires&callback=?', function(data){});
            };
            function Win(type, params){
                var percent = eval(params);
                if (type == 'width'){
                    var final = (($(window).width())/100)*percent;
                    return final;
                }
                else if (type == 'height'){
                    var final = (($(window).height())/100)*percent;
                    return final;
                }
            }
            function style(){
                $('.popupfade').css({
                    'position':'absolute',
                    'top':'0px',
                    'left':'0px',
                    'width':'100%',
                    'height':'100%',
                    'background-image':"url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9wGFAcEKdqCCHEAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAIklEQVQ4y2P8//+/DwMVARMDlcGogaMGjho4auCogUPFQABI6QNx4gRNUQAAAABJRU5ErkJggg==')",
                    'z-index':'1000'
                });
                
                $('.popup').css({
                    'display':' inline-block',
                    'position':'relative',
                    'width':'auto',
                    'background-color':'#ffffff',
                    '-webkit-box-shadow':' 5px 5px 20px 10px rgba(100, 150, 255, 0.35)',
                    'box-shadow':' 5px 5px 20px 10px rgba(100, 150, 255, 0.35)',
                    
                    '-webkit-border-radius':' 30px 30px 30px 0px',
                    'border-radius':' 30px 30px 30px 0px',
                    'font-family':'Arial, sans',
                    'font-size':'10px',
                    'z-index':'1001'
                });
                $('.popupclose').css({
                    'display':'block',
                    'width':'24px',
                    'height':'24px',
                    'background-image':"url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAABIAAAASABGyWs+AAADjUlEQVRIx+2TT2gjdRTHv5PZZCbJJNk2mSSYpJ2kJdbWHmQ3sT2ZdY+C4LZJ07KCBw+CeJQ9iYInwYOIJ/Hkiuu2ybIURFjUFgoaaSnqtomt28SmWmpNmj/zm6TJZGa8pFLSJt2bID548OP3fu/7+b3fez/gf/u3jercmJl5KUjr2Y9YlhmoiuT9xN3EJ70EovEbL7Cs8cNWU96XVfVW4ovEd6fjdGfC6NNj716//vzMyMiIo9E4ftHjfYLa3Egvnyc+PTMddfJ84lrkmt0v+Ad2c7lnHj7c/Pj0Gd2ZLI3iVVVFpVLB+Pg4BgeFt2Px6XfOF3fcmZycpEWxCpqmoaiq1HnuTAVjo2O/FIqHLwf8AQMhBAM+HxrNRsTr8/xTSSw2FeOd/J2JiQmaiCI4zoLUDymlRqTXNjczOz0B6XT6MBAc/vbwz4O4IAQMhIjwerxoNpsRr89DjY0+5ex32D8Ph8K0WK3CzFmQSn2v/FUozi7MJxcvbPKJTcWnnrVx3Nfh8ARXr0uwcFakM2lIkqSFroYoIongzBasra0phaOj2cTdxMJjTVEnxGIyPwiFwtZaTYLFYgEFCoSIMHMc1tfXlfJRaW5+PjnfTaMn4ATCmcxLV69cMRaLBaiqBpfThZ9+/lErH5XjvcTPn6LOG2iU38gwjKoo0DQNgAa51QLLGinoqNGL8ulewVhsaravv++zYPBJulKtwGq1gWEYSJIEnuchy3JE8A92/Sc9AdH4jTmb7fLt4aEhuiqKMJvM2NreUv/Y3z92uVx6SaqBd9jRlOWIPyB0hdBdxa22TwUhQBMiwmg0IZvdUcqV6k1ZkT+olMsxJ88ztVoNdrsdstyMBIb850LOAKLR6HMWq+W+zzdAE0LAsibkcjmlUiq9kly4t5DZyBwMBoRlQsRpu93B1I9r6LvcD7nVigwNC4XNjcxqzyZTOvV1j8dDi1URDGPA7m5OOTjYfyOZvL8EwA3AvXhvcfe3fH7u0c4jUaejQSQCt9sNvcFw68IpUjX8XpMk6A0G5PN7yt7e3ptffflgGQAPwHXiK0sr+a3tX1/NZrOEoijU63W0mq3tTr1LnRulYvk9VVH0GoVgqVS8vfzNyioAFgDTdhpAEwC1mlpNK00lKkm1m7SOuiRWS2+deZEuQ6QHYDwlqm/7Sc80AC0AchvWAEDa68cCnI7T7Up17bUGQG270gZp+M/a3+TZiTUwQDIFAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAABJRU5ErkJggg==')",
                    'background-size':'100% 100%',
                    'position':'absolute',
                    'top':'-8px',
                    'right':'-8px',
                    'cursor':'pointer'
                });
                $('.popuptitle').css({
                    'font-weight':'bold',
                    'padding':'10px',
                    'font-size':'12px'
                    
                });
                $('.DNSlookup').css({
                    'float':'left',
                    'display':'block',
                    'width':'auto',
                    'padding-left':'10px',
                    'padding-right':'10px',
                    'padding-bottom':'10px'
                });
                $('.WhoisLookup').css({
                    'float':'left',
                    'display':'block',
                    'width':'auto',
                    'padding-right':'10px',
                    'padding-bottom':'10px'
                });
                    $(' .popup .record').css({
                        'display':'block',
                        'padding':'10px'
                    });
                    $('.popup .record.hidden').css({
                        'display':' none',
                        'padding':'0px'
                    });
                    $('.popup span.label').css({
                        'float':'left'
                    });
                    $('.popup span:not(.label)').css({
                        'float':'right',
                        'padding-left':'10px'
                    });
                    $('.popup span.prio').css({
                        'float':'left'
                    });
                        $('.popup .IP').css({
                            'text-decoration':'underline',
                            'color':'blue',
                            'cursor':'pointer'
                        });
                    $('.popup button').css({
                        'font-size':'8px',
                        'font-weight':'200',
                        'float':'right',
                        'position':'relative',
                        'top':'-12px',
                        'right':'5px'
                    });
                $('.popup .clear').css({
                    'clear':'both'
                });
            };
            function stylePosition(){
                
                $('.popupwrapper').css({
                    'position':'absolute',
                    'top':((Win('height','50'))-(($('.popup').height())/2)),
                    'left':((Win('width','50'))-(($('.popup').width())/2))
                });
            };
            function popUp(){
                var domain = getSelText();
                $('body').append('<div class="popupfade"></div><div class="popupwrapper"><div class="popup"><div class="popupclose"></div><div class="popuptitle">'+domain+' Lookup <button class="reload">reload data</button></div><div class="DNSlookup"><div class="a record hidden"><span class="label"></span> <span class="IP"></span></div><div class="mx record hidden"><span class="label"></span><span class="IP"></span><span class="name"></span> <span class="prio"></span> </div></div><div class="WhoisLookup"><div class="registrar record hidden"><span class="label"></span> <span class="name"></span> </div><div class="NS record hidden"><span class="label"></span> <span class="name"></span> </div><div class="registrant record hidden"><span class="label"></span> <span class="name"></span> </div><div class="Status record hidden"><span class="label"></span> <span class="name"></span> </div><div class="Expires record hidden"><span class="label"></span> <span class="name"></span> </div></div><div class="clear"></div></div></div>');
                
                style();
                
                /*function*/
                $('.popupclose').click(function(){
                    $('.popupfade').remove();
                    $('.popupwrapper').remove();
                });
                $('.DNSlookup').html('Looking up... <img src="data:image/gif;base64,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" />');
                runAPI();
                $('.reload').click(function(){
                    runAPI(domain);
                });
            };
            popUp();