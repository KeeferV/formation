function order(id) {
  //alert(id);
  $.ajax({
    url: "api/order/" + id,
    type: "GET",
    accept: 'application/json',
    //data: JSON.stringify({service: "moreHomeArticles", start: start, lastId: lastId}),
    async: true,
    //timeout: 5000,
    success: function (result, textStatus, jqXHR) {
      console.log(result)
      alert(result.response.message)
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(jqXHR)
      console.log(textStatus)
      //
    }
  });
}