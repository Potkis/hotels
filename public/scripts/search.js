$('#hotel-search').on('input', function() {
  var search = $(this).serialize();
  if(search === "search=") {
    search = "all"
  }
  $.get('/hotels?' + search, function(data) {
    $('#hotel-grid').html('');
    data.forEach(function(hotel) {
      $('#hotel-grid').append(`
        <div class="col-md-3 col-sm-6">
          <div class="thumbnail">
            <img src="${ hotel.image }">
            <div class="caption">
              <h4>${ hotel.name }</h4>
            </div>
            <p>
              <a href="/hotels/${ hotel._id }" class="btn btn-primary">More Info</a>
            </p>
          </div>
        </div>
      `);
    });
  });
});

$('#hotel-search').submit(function(event) {
  event.preventDefault();
});