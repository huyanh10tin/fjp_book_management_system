/* global SimpleMDE */

//= require simplemde/dist/simplemde.min
//= require propellerkit/components/datetimepicker/js/bootstrap-datetimepicker
//= require_self


$(document).ready(function () {
  $('#datepicker-start').datetimepicker({
    minDate: new Date()
  });

  $('#datepicker-end').datetimepicker({
    minDate: new Date(),
    useCurrent: false
  });

  $('#datepicker-start').on('dp.change', function (e) {
    $('#datepicker-end').data('DateTimePicker').minDate(e.date);
  });
  $('#datepicker-end').on('dp.change', function (e) {
    $('#datepicker-start').data('DateTimePicker').maxDate(e.date);
  });

  $(document).on('click', '.btn-toggle-reply', function () {
    var id = $(this).parent().attr('data');
    $(this).addClass('hide');
    $(this).siblings().removeClass('hide');
    $('.child-comment-field' + id).toggleClass('hide');
    $('.btn-toggle-reply' + id).toggleClass('hide');
  });

  $('.owl-carousel').owlCarousel();

  $(document).on('click','.book-image-others',function(){
    $(this).attr('id');
    var url = $(this).attr('src');
    $('.book-image').attr('src', url);
  });

  $(document).on('click','.btn-send-req', function(){
    var start = $('#datepicker-start').val();
    var end = $('#datepicker-end').val();
    var id = $('.current-book-id').attr('id');

    $('#datepicker-start').val('');
    $('#datepicker-end').val('');

    if(start != '' && end != '') {
      $.ajax({
        beforeSend: function(xhr){
          xhr.setRequestHeader('X-CSRF-Token',
            $('meta[name="csrf-token"]').attr('content'));
        },
        type: 'POST',
        url: '/borrows',
        data: {
          borrow: {
            time_start: start,
            time_end: end,
            book_id: id
          }
        },
        success: function(e) {
          $('.modal-send-req-result').append(e);
          $('#send-req-success-modal').modal('show');
        }
      });
    }
  });

  var editors = {};

  var editorOptions = {
    element: $('#cmt-0')[0],
    status: false,
    toolbar: false,
    forceSync: true,
    spellChecker: false
  };

  editors['comment-0'] = new SimpleMDE(editorOptions);

  $('li.load-html').click(function(){
    var id = $(this).attr('data');
    $('#preview-' + id).html(editors['comment-' + id]
      .options.previewRender(editors['comment-' + id].value()));
  });

  $('.fa-reply').click(function () {
    var id = $(this).attr('data');

    if(editors['comment-' + id] === undefined){
      editorOptions.element = $('#comment-' + id)[0];
      editors['comment-' + id] = new SimpleMDE(editorOptions);
    }

    setTimeout(function(){
      $('.reply-' + id).removeClass('hidden');
    }, 200);
  });

  $('.btn-cancel').click(function (e) {
    e.preventDefault();
    var id = $(this).attr('data');
    $('.reply-' + id).addClass('hidden');
  });
});
