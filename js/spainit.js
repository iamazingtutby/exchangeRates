(function ($) {

    $(document).ready(function () {

// отслеживаем изменение закладки в УРЛе
window.onhashchange = SwitchToStateFromURLHash;

// текущее состояние приложения
var SPAStateH={};

// вызывается при изменении закладки УРЛа
// а также при первом открытии страницы
function SwitchToStateFromURLHash(){
    var URLHash = window.location.hash;

    // убираем из закладки УРЛа решётку
    var StateStr=URLHash.substr(1);

    // если закладка непустая, читаем из неё состояние и отображаем
    if ( StateStr!="" ){
        SPAStateH={ pagename: StateStr };

    } else {
        SPAStateH={ pagename: 'tables' }; // иначе показываем главную страницу
    }

    // обновляем вариабельную часть страницы под текущее состояние
    var PageHTML="";
    switch ( SPAStateH.pagename )
    {
        case 'tables':
            $.ajax('/tpl/table.html',
                {
                    success: function (data) {
                        PageHTML = data;
                        $('#dynamicContent').html(PageHTML);
                        $('.datepicker').datepicker();
                    }
                }
            );
            break;

        case 'columns':
            $.ajax('/tpl/column-graph.html',
                {
                    success: function (data) {
                        PageHTML = data;
                        $('#dynamicContent').html(PageHTML);
                    }
                }
            );
            break;
        case 'linears':
            $.ajax('/tpl/linear-graph.html',
                {
                    success: function (data) {
                        PageHTML = data;
                        $('#dynamicContent').html(PageHTML);
                    }
                }
            );
            break;
    }

    $('#dynamicContent').html(PageHTML);

}

// устанавливает в закладке УРЛа новое состояние приложения
// и затем устанавливает+отображает это состояние
function SwitchToState(NewStateH){
    // устанавливаем закладку УРЛа
    // нужно для правильной работы кнопок навигации браузера
    var StateStr = NewStateH.pagename;

    location.hash = StateStr;

    // АВТОМАТИЧЕСКИ вызовется SwitchToStateFromURLHash()
    // т.к. закладка УРЛа изменилась (ЕСЛИ она действительно изменилась)
}

        $('.control-buttons .btn').each( function () {
           $(this).on('click', function () {
               var _state = $(this).data('state');
               console.log('===---', _state);
               SwitchToState( { pagename: _state } );
           })
        });

// переключаемся в состояние, которое сейчас прописано в закладке УРЛ
SwitchToStateFromURLHash();
    });
})(jQuery);