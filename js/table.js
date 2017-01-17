function CreateTablePage() {

    var threeStatic = [],
        curIds = [145,298,292];
    
    this.getThreeData = function () {
            threeStatic.length = 0;

            for(var i=0; i<curIds.length; i++){
                var reqUrl = 'http://www.nbrb.by/API/ExRates/Rates/' + curIds[i];
                $.ajax({
                    url: reqUrl,
                    type: 'GET',
                    cache: false,
                    success: function (data) {
                        threeStatic.push(data);
                    },
                    error: function () {
                        alert('Error');
                    }
                });
            }

        console.log('threeStatic ', threeStatic);
    };
    this.createTable = function (tpl, par) {
        par.html('');
        for(var i=0; i<tpl.length; i++){
            var tag = tpl[i].tag;
            var elem = $("<" + tag + ">");
            par.append(elem);
            if('options' in tpl[i]){
                if('attributes' in tpl[i]['options']){
                    var _arr = tpl[i]['options']['attributes'];
                    for(var key in _arr)
                        elem.attr(key , _arr[key])
                }
                if('children' in tpl[i]['options']){
                    this.createTable(tpl[i]['options']['children'], elem)
                }
                if('text' in tpl[i]['options']){
                    elem.text(tpl[i]['options'].text);
                }
            }
        }
    };
    this.staticTable = function () {
        $('.preloader').show();
        this.getThreeData();

            var tableTpl = [
                {
                    tag: 'table', options: {
                    attributes: {id: 'curTable', class: 'table table-bordered currency-table'}, children: [
                        {
                            tag: 'thead', options: {
                            children: [
                                {
                                    tag: 'tr', options: {
                                    children: [
                                        {
                                            tag: 'th',
                                            options: {attributes: {class: 'first'}, text: 'Валюта'}
                                        },
                                        {tag: 'th', options: {attributes: {class: 'second'}, text: 'Курс'}}
                                    ]
                                }
                                }
                            ]
                        }
                        },
                        {
                            tag: 'tbody'
                        }
                    ]
                }
                }
            ];

            var par = $('.table-data');
            this.createTable(tableTpl, par);

        function fillThree(){
            if(threeStatic.length == 3){
                for(var j=0; j<threeStatic.length; j++){
                    $('#curTable').find('tbody')
                        .append('<tr><td>'+threeStatic[j].Cur_Scale+' '+threeStatic[j].Cur_Name+'</td><td>'+threeStatic[j].Cur_OfficialRate +' бел.руб</td></tr>');
                }
                console.log('filled');
            } else {
                setTimeout(fillThree, 300);
            }
        }
        setTimeout(fillThree, 300);

        $('.preloader').fadeOut();
    };
    
    this.dynamicTable = function () {
       var _btn = $('.t-btns-row .btn');
            _btn.on('click', function () {

                $('.preloader').show();
                var currentBtn = $(this).data('cur');
                var _from = $('input.date-from').val(),
                    _to = $('input.date-to').val(),
                    _id;

                switch (currentBtn){
                    case ('rub'):
                        _id = 298; // id рос рубля
                        getOneCurrency(_from, _to, _id);
                        break;
                    case ('usd'):
                        _id = 145; // id usd
                        getOneCurrency(_from, _to, _id);
                        break;
                    case ('eur'):
                        _id = 292; // id euro
                        getOneCurrency(_from, _to, _id);
                        break;
                }

                function getOneCurrency(_from, _to, _id) {
                    var requestUrl = "http://www.nbrb.by/API/ExRates/Rates/Dynamics/"+_id+"?startDate="+_from+"&endDate="+_to+"";

                    $.ajax({
                        url: requestUrl,
                        type: 'GET',
                        cache: false,
                        success: function (data) {
                            fillTable(data);
                        },
                        error: function () {
                            alert('Error');
                        }
                    });
                    function fillTable(data) {
                        console.log('data -- ', data);
                        var tableTpl = [
                            {tag: 'table', options: {attributes: {id: 'curTable', class: 'table table-bordered currency-table'}, children: [
                                {tag: 'thead', options: { children: [
                                    {tag: 'tr', options: { children: [
                                        {tag: 'th', options: {attributes: {class: 'first'}, text: 'Дата'}},
                                        {tag: 'th', options: {attributes: {class: 'second'}, text: 'Валюта'}},
                                        {tag: 'th', options: {attributes: {class: 'second'}, text: 'Курс'}}
                                    ]}}
                                ]}},
                                {
                                    tag: 'tbody'
                                }
                            ]}}
                        ];
                        function createTable(tpl, par) {
                            par.html('');
                            for(var i=0; i<tpl.length; i++){
                                var tag = tpl[i].tag;
                                var elem = $("<" + tag + ">");
                                par.append(elem);
                                if('options' in tpl[i]){
                                    if('attributes' in tpl[i]['options']){
                                        var _arr = tpl[i]['options']['attributes'];
                                        for(var key in _arr)
                                            elem.attr(key , _arr[key])
                                    }
                                    if('children' in tpl[i]['options']){
                                        createTable(tpl[i]['options']['children'], elem)
                                    }
                                    if('text' in tpl[i]['options']){
                                        elem.text(tpl[i]['options'].text);
                                    }
                                }
                            }
                        }

                        var par = $('.d-table-data');
                        createTable(tableTpl, par);

                        function fillAll(){
                            if(data){
                                for(var j=0; j<data.length; j++){
                                    var name;
                                    switch (data[j].Cur_ID){
                                        case (145):
                                            name = '1 Доллар США';
                                            break;
                                        case (292):
                                            name = '1 Евро';
                                            break;
                                        case (298):
                                            name = '100 Российских рублей';
                                            break;
                                    }

                                    var __date = new Date(data[j].Date);

                                    var dd = __date.getDate();
                                    if (dd < 10) {dd = '0' + dd}

                                    var mm = __date.getMonth();

                                    function monthName(mm) {
                                        var _names = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
                                        return _names[mm];
                                    }

                                    var _date = dd + ' ' + monthName(mm) + ' ' + __date.getFullYear();
                                    $('.d-table-data #curTable').find('tbody')
                                        .append('<tr><td>'+_date+'</td><td>'+name+'</td><td>'+data[j].Cur_OfficialRate+' бел.руб</td></tr>');
                                }
                                console.log('filled all');
                            } else {
                                setTimeout( fillAll , 300);
                            }
                        }
                        setTimeout( fillAll , 300);

                    }
                }

                $('.preloader').fadeOut();
            });
    };
    
    this.init = function () {
        this.staticTable();
        this.dynamicTable();
    }
    
}